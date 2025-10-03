import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PRD for project:', projectData.projectName);

    // Construct a detailed prompt for PRD generation
    const systemPrompt = `You are an expert product strategist and PRD writer. Generate a comprehensive, professional product vision and requirements document based on user inputs. Focus on clarity, actionability, and strategic insight.`;

    const userPrompt = `Create a detailed Product Requirements Document (PRD) vision statement for the following product:

Project Name: ${projectData.projectName}
Target Audience: ${projectData.targetAudience.join(", ")}
Problem Statement: ${projectData.problem}
Unique Value / Magic Moment: ${projectData.magic}
${projectData.platforms?.length ? `Platforms: ${projectData.platforms.join(", ")}` : ''}
${projectData.competitors ? `Competitors: ${projectData.competitors}` : ''}
${projectData.budget ? `Budget: ${projectData.budget}` : ''}
${projectData.teamSize ? `Team Size: ${projectData.teamSize}` : ''}

Generate:
1. A compelling product vision statement (2-3 sentences that clearly articulate the value proposition)
2. A list of 15 prioritized features (mix of must-have MVP features and future enhancements)
3. Key user actions (primary actions users will take)
4. Success metrics (how to measure product success)

Return your response in the following JSON format:
{
  "valueProposition": "The main vision statement",
  "features": ["feature 1", "feature 2", ...],
  "primaryUserActions": ["action 1", "action 2", ...],
  "successMetrics": ["metric 1", "metric 2", ...]
}`;

    // Call Lovable AI Gateway with Google Gemini
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI generation failed. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;

    if (!generatedContent) {
      console.error('No content generated from AI');
      return new Response(
        JSON.stringify({ error: 'Failed to generate content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI generated content successfully');

    // Parse the JSON response from AI
    let parsedContent;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = generatedContent.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : generatedContent;
      parsedContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: create structured content from raw text
      parsedContent = {
        valueProposition: generatedContent.split('\n')[0] || generatedContent.slice(0, 200),
        features: [],
        primaryUserActions: [],
        successMetrics: []
      };
    }

    // Calculate confidence based on content quality
    const confidence = parsedContent.valueProposition.length > 50 && parsedContent.features.length >= 10 
      ? 'high' 
      : parsedContent.valueProposition.length > 20 
        ? 'medium' 
        : 'low';

    const result = {
      valueProposition: parsedContent.valueProposition,
      confidence,
      features: parsedContent.features || [],
      primaryUserActions: parsedContent.primaryUserActions || [],
      successMetrics: parsedContent.successMetrics || [],
      aiGenerated: true,
      timestamp: new Date().toISOString(),
      model: 'google/gemini-2.5-flash'
    };

    console.log('PRD generation completed successfully');

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-prd function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

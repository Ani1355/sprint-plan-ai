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

    const userPrompt = `Create a detailed Product Requirements Document (PRD) for the following product:

Project Name: ${projectData.projectName}
Target Audience: ${projectData.targetAudience.join(", ")}
Problem Statement: ${projectData.problem}
Unique Value / Magic Moment: ${projectData.magic}
${projectData.platforms?.length ? `Platforms: ${projectData.platforms.join(", ")}` : ''}
${projectData.competitors ? `Competitors: ${projectData.competitors}` : ''}
${projectData.budget ? `Budget: ${projectData.budget}` : ''}
${projectData.teamSize ? `Team Size: ${projectData.teamSize}` : ''}

Generate exactly 15 prioritized features ranked by value/effort ratio. Each feature MUST include:
- Unique numeric id (1-15)
- Concise title (3-6 words, specific to this project)
- Clear description (1-2 sentences explaining user benefit)
- valueScore (0-100, business/user value)
- effortScore (0-100, development complexity)
- category: Top 5 as "Must", next 5 as "Should", next 3 as "Could", last 2 as "Won't"
- estimatedEffort: "Low" if effortScore < 40, "Medium" if 40-70, "High" if > 70
- isMVP: true for top 7 features by (valueScore - effortScore), false otherwise

IMPORTANT: Features must be specific to this project and target audience, not generic templates.

Return ONLY valid JSON in this exact format:
{
  "valueProposition": "2-3 sentence compelling vision statement",
  "primaryUserAction": "The main action users take",
  "confidence": "high",
  "features": [
    {
      "id": "1",
      "title": "Specific Feature Name",
      "description": "Clear benefit for the user",
      "valueScore": 85,
      "effortScore": 40,
      "category": "Must",
      "estimatedEffort": "Medium",
      "isMVP": true
    }
  ],
  "successMetrics": ["Specific measurable metric 1", "Specific measurable metric 2", "Specific measurable metric 3"]
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
    const hasValidFeatures = Array.isArray(parsedContent.features) && 
                             parsedContent.features.length >= 10 &&
                             parsedContent.features.every((f: any) => f.id && f.title && f.description);
    
    const confidence = parsedContent.valueProposition?.length > 50 && hasValidFeatures
      ? 'high' 
      : parsedContent.valueProposition?.length > 20 
        ? 'medium' 
        : 'low';

    const result = {
      valueProposition: parsedContent.valueProposition || '',
      primaryUserAction: parsedContent.primaryUserAction || '',
      confidence: parsedContent.confidence || confidence,
      features: parsedContent.features || [],
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

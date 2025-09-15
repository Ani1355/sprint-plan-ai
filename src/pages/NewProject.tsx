import { useState } from "react";
import { NewProjectWizard } from "@/components/wizard/NewProjectWizard";
import { Navigate } from "react-router-dom";

export default function NewProject() {
  const [showWizard, setShowWizard] = useState(true);

  const handleClose = () => {
    setShowWizard(false);
  };

  // If wizard is closed, redirect to dashboard
  if (!showWizard) {
    return <Navigate to="/" replace />;
  }

  return (
    <NewProjectWizard 
      open={showWizard}
      onClose={handleClose}
    />
  );
}
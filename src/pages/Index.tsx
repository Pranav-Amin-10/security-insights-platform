
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/", { replace: true });
  }, [navigate]);

  return <div>Redirecting to dashboard...</div>;
};

export default Index;

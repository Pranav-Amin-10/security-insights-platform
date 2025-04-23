
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/");
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default Index;

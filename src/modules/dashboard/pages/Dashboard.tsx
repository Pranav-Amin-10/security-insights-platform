
import React from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const modules = [
    {
      title: "VAPT",
      description: "Vulnerability Assessment and Penetration Testing",
      link: "/vapt",
      icon: "🔍"
    },
    {
      title: "Compliance",
      description: "Security compliance and standards management",
      link: "/compliance",
      icon: "📋"
    },
    {
      title: "SSL/TLS",
      description: "SSL/TLS certificate analysis and monitoring",
      link: "/ssl",
      icon: "🔒"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Insights Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Monitor and manage your security posture across multiple vectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Link to={module.link} key={index}>
              <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-4">{module.icon}</div>
                <h2 className="text-xl font-bold mb-2">{module.title}</h2>
                <p className="text-gray-600">{module.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Security Overview</h2>
          <p className="text-gray-600 mb-4">
            Select one of the security modules above to start analyzing your systems.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

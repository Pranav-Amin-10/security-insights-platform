
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Shield, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const modules = [
    {
      title: "VAPT Module",
      description: "Automated Vulnerability Assessment & Penetration Testing",
      icon: Shield,
      link: "/vapt",
      features: [
        "10-Stage Penetration Testing",
        "Automated Reconnaissance",
        "Vulnerability Analysis",
        "Detailed PDF Reports"
      ]
    },
    {
      title: "Compliance Audit",
      description: "GDPR & ISO 27001 Compliance Assessment",
      icon: FileText,
      link: "/compliance",
      features: [
        "Self-Assessment Checklists",
        "Risk Analysis",
        "Gap Identification",
        "Remediation Planning"
      ]
    },
    {
      title: "SSL/TLS Checker",
      description: "Certificate & Configuration Analysis",
      icon: Shield,
      link: "/ssl",
      features: [
        "Certificate Validation",
        "Protocol Analysis",
        "Security Score",
        "Best Practice Recommendations"
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6">
              Enterprise Security <span className="text-blue-600">Automation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive security assessment platform for vulnerability testing,
              compliance auditing, and SSL/TLS analysis.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Link to={module.link} key={index}>
                <Card className="h-full p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <module.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold ml-3 text-gray-900">
                      {module.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Start with our VAPT module for a comprehensive security assessment
            </p>
            <Link
              to="/vapt"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
              <Shield className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

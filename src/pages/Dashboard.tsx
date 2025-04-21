
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Shield, AlertCircle, Lock, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Insights Platform</h1>
          <p className="text-gray-600 mb-6">
            Enterprise-level cybersecurity automation platform for vulnerability assessment, 
            compliance analysis, and security configuration checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* VAPT Module Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold">VAPT Module</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">
                Complete 10-stage penetration testing workflow with detailed vulnerability assessment.
              </p>
              <Link 
                to="/vapt"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Start VAPT Scan
              </Link>
            </div>
          </Card>

          {/* Compliance Module Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Compliance Audit</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">
                GDPR and ISO 27001 compliance assessment with remediation recommendations.
              </p>
              <Link 
                to="/compliance"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Start Compliance Audit
              </Link>
            </div>
          </Card>

          {/* SSL Module Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">SSL/TLS Checker</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">
                Certificate and protocol analysis for web security configuration.
              </p>
              <Link 
                to="/ssl"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Check SSL Configuration
              </Link>
            </div>
          </Card>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Platform</h3>
              <p className="text-gray-600">
                This locally hosted cybersecurity platform provides powerful tools for enterprise security assessment.
                All data is processed locally with Supabase storage integration for results. 
                Each module generates comprehensive PDF reports with specific remediation recommendations.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">API Integrations:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                  <li>Shodan API for reconnaissance</li>
                  <li>ipinfo.io for IP geolocation</li>
                  <li>WHOIS and DNS lookup tools</li>
                  <li>SSL Labs API for certificate analysis</li>
                  <li>Supabase database for results storage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

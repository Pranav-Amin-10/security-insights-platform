
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSSLReport } from "@/lib/pdf-utils";

// Mock SSL check result
const mockSSLResult = {
  domain: "example.com",
  timestamp: new Date().toISOString(),
  overallRating: "A+",
  score: 95,
  certificate: {
    subject: "CN=example.com",
    issuer: "CN=Let's Encrypt Authority X3",
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 90
  },
  protocols: [
    { name: "TLS 1.3", enabled: true, secure: true },
    { name: "TLS 1.2", enabled: true, secure: true },
    { name: "TLS 1.1", enabled: false, secure: false },
    { name: "TLS 1.0", enabled: false, secure: false },
    { name: "SSL 3.0", enabled: false, secure: false }
  ],
  ciphers: [
    { name: "TLS_AES_256_GCM_SHA384", strength: "Strong" },
    { name: "TLS_CHACHA20_POLY1305_SHA256", strength: "Strong" },
    { name: "TLS_AES_128_GCM_SHA256", strength: "Strong" },
    { name: "ECDHE-RSA-AES256-GCM-SHA384", strength: "Strong" },
    { name: "ECDHE-RSA-AES128-GCM-SHA256", strength: "Strong" }
  ],
  vulnerabilities: [
    {
      name: "LUCKY13",
      severity: "Low",
      description: "The LUCKY13 attack is a timing side-channel attack against CBC-mode ciphersuites in TLS."
    }
  ]
};

const SSLModule = () => {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleCheck = () => {
    if (!domain) {
      toast.error("Please enter a domain to check");
      return;
    }
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockResult = {...mockSSLResult, domain};
      setResult(mockResult);
      setLoading(false);
      toast.success(`SSL/TLS check completed for ${domain}`);
    }, 2000);
  };
  
  const handleDownloadReport = () => {
    try {
      const doc = generateSSLReport(result);
      doc.save(`SSL_Report_${result.domain}_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("SSL report downloaded successfully");
    } catch (error) {
      console.error("Error generating SSL report:", error);
      toast.error("Error generating SSL report");
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">SSL/TLS Certificate Analysis</h1>
          <p className="text-gray-600 mb-6">
            Check the security of your domains with comprehensive SSL/TLS certificate analysis.
          </p>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter domain (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCheck} disabled={loading}>
              {loading ? "Checking..." : "Check SSL/TLS"}
            </Button>
          </div>
        </Card>
        
        {result && (
          <Card className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Results for {result.domain}</h2>
              <Button onClick={handleDownloadReport}>Download Report</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium mb-2">Overall Rating</h3>
                <div className={`text-4xl font-bold ${
                  result.overallRating.startsWith('A') ? 'text-green-600' : 
                  result.overallRating.startsWith('B') ? 'text-blue-600' :
                  result.overallRating.startsWith('C') ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.overallRating}
                </div>
                <p className="mt-2">Score: {result.score}/100</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Certificate</h3>
                <p className="text-sm mb-1"><strong>Issuer:</strong> {result.certificate.issuer}</p>
                <p className="text-sm mb-1"><strong>Valid Until:</strong> {new Date(result.certificate.validTo).toLocaleDateString()}</p>
                <p className="text-sm"><strong>Days Remaining:</strong> {result.certificate.daysRemaining}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Protocols</h3>
                <ul className="text-sm">
                  {result.protocols.map((protocol, index) => (
                    <li key={index} className="mb-1">
                      <span className={protocol.enabled ? 
                        (protocol.secure ? 'text-green-600' : 'text-red-600') : 
                        'text-gray-400'
                      }>
                        {protocol.name}: {protocol.enabled ? 
                          (protocol.secure ? '✅ Secure' : '❌ Insecure') : 
                          '⚪ Disabled'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Cipher Suites</h3>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Cipher</th>
                      <th className="p-2 text-left">Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.ciphers.map((cipher, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2">{cipher.name}</td>
                        <td className={`p-2 ${
                          cipher.strength === 'Strong' ? 'text-green-600' :
                          cipher.strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {cipher.strength}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Vulnerabilities</h3>
                {result.vulnerabilities.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.vulnerabilities.map((vuln, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="p-2">{vuln.name}</td>
                          <td className={`p-2 ${
                            vuln.severity === 'Critical' ? 'text-red-600' :
                            vuln.severity === 'High' ? 'text-orange-600' :
                            vuln.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            {vuln.severity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-green-600">No vulnerabilities detected!</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Implement HTTP Strict Transport Security (HSTS)</li>
                <li>Configure strong cipher suite preferences</li>
                <li>Ensure proper certificate renewal process is in place</li>
                <li>Disable TLS 1.0 and 1.1 if they are still enabled</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SSLModule;

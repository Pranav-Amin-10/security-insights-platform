
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Lock, AlertCircle, Shield, Info } from "lucide-react";
import { SSLCheckResult } from "@/types";
import { checkSSL, saveSSLResults } from "@/lib/api-utils";
import { generateSSLReport } from "@/lib/pdf-utils";

const SSLModule = () => {
  const [domain, setDomain] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checkComplete, setCheckComplete] = useState<boolean>(false);
  const [results, setResults] = useState<SSLCheckResult | null>(null);
  
  // Perform the SSL check
  const performCheck = async () => {
    if (!domain) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      const sslResults = await checkSSL(domain);
      setResults(sslResults);
      setCheckComplete(true);
      
      // Save to Supabase
      await saveSSLResults(sslResults);
    } catch (error) {
      console.error('Error checking SSL:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Download the report
  const downloadReport = () => {
    if (!results) return;
    
    const doc = generateSSLReport(results);
    doc.save(`SSL_Report_${results.domain}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  
  // Reset the check
  const resetCheck = () => {
    setDomain("");
    setCheckComplete(false);
    setResults(null);
  };
  
  // Get color for rating
  const getRatingColor = (rating: string): string => {
    switch(rating.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">SSL/TLS Configuration Checker</h1>
          <p className="text-gray-600 mb-6">
            Analyze domain SSL/TLS security configuration, certificates, and protocols to identify vulnerabilities.
          </p>
        </div>
        
        {!checkComplete ? (
          <Card className="p-6">
            <div className="text-center max-w-md mx-auto">
              <div className="bg-blue-100 p-6 rounded-full inline-flex mb-6">
                <Lock className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-6">SSL/TLS Security Check</h2>
              <p className="text-gray-600 mb-8">
                Enter a domain to analyze its SSL certificate and security configuration.
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="flex-1"
                />
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={performCheck}
                  disabled={!domain || loading}
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Results for {results?.domain}</h2>
                  <p className="text-sm text-gray-500">
                    Check performed: {new Date(results?.timestamp || "").toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={downloadReport}
                  >
                    Download Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetCheck}
                  >
                    New Check
                  </Button>
                </div>
              </div>
              
              {/* Overall Rating */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-1 items-center gap-4">
                    <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                      results?.overallRating.charAt(0) === 'A' ? 'bg-green-100' :
                      results?.overallRating.charAt(0) === 'B' ? 'bg-blue-100' :
                      results?.overallRating.charAt(0) === 'C' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      <span className="text-4xl font-bold">{results?.overallRating}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Overall Rating</h3>
                      <p className="text-gray-600 mb-2">
                        Your SSL configuration scored {results?.score} out of 100.
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            results?.score !== undefined && results?.score >= 90 ? 'bg-green-600' :
                            results?.score !== undefined && results?.score >= 75 ? 'bg-blue-600' :
                            results?.score !== undefined && results?.score >= 50 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`} 
                          style={{ width: `${results?.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Certificate Information */}
              <h3 className="text-lg font-medium mb-4">Certificate Information</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Subject</p>
                    <p className="font-medium">{results?.certificate.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Issuer</p>
                    <p>{results?.certificate.issuer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Valid From</p>
                    <p>{new Date(results?.certificate.validFrom || "").toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Valid To</p>
                    <div className="flex items-center gap-2">
                      <p>{new Date(results?.certificate.validTo || "").toLocaleDateString()}</p>
                      {results?.certificate.daysRemaining !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          results.certificate.daysRemaining > 90 ? 'bg-green-100 text-green-800' :
                          results.certificate.daysRemaining > 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {results.certificate.daysRemaining} days remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Protocol Support */}
              <h3 className="text-lg font-medium mb-4">Protocol Support</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results?.protocols.map((protocol, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {protocol.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            protocol.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {protocol.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {protocol.enabled && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              protocol.secure
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {protocol.secure ? 'Secure' : 'Insecure'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Cipher Support */}
              <h3 className="text-lg font-medium mb-4">Cipher Support</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cipher</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results?.ciphers.map((cipher, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {cipher.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cipher.strength === 'Strong' 
                              ? 'bg-green-100 text-green-800' 
                              : cipher.strength === 'Weak'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cipher.strength}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Vulnerabilities */}
              {results?.vulnerabilities && results.vulnerabilities.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mb-4">Detected Vulnerabilities</h3>
                  <div className="space-y-4 mb-6">
                    {results.vulnerabilities.map((vuln, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-md overflow-hidden ${
                          vuln.severity === 'Critical' ? 'border-red-300' :
                          vuln.severity === 'High' ? 'border-orange-300' :
                          vuln.severity === 'Medium' ? 'border-yellow-300' :
                          'border-blue-300'
                        }`}
                      >
                        <div className={`px-4 py-2 flex items-center justify-between ${
                          vuln.severity === 'Critical' ? 'bg-red-100' :
                          vuln.severity === 'High' ? 'bg-orange-100' :
                          vuln.severity === 'Medium' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <h5 className="font-medium">{vuln.name}</h5>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            vuln.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                            vuln.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                            vuln.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {vuln.severity}
                          </span>
                        </div>
                        <div className="p-4">
                          <p className="text-sm">{vuln.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Recommendations */}
              <h3 className="text-lg font-medium mb-4">Recommendations</h3>
              <div className="space-y-4">
                {results?.protocols.some(p => !p.secure && p.enabled) && (
                  <div className="bg-white p-4 rounded-md border border-yellow-200">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Disable Insecure Protocols</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Disable the following insecure protocols: {
                            results.protocols
                              .filter(p => !p.secure && p.enabled)
                              .map(p => p.name)
                              .join(', ')
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {results?.ciphers.some(c => c.strength !== 'Strong') && (
                  <div className="bg-white p-4 rounded-md border border-yellow-200">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Disable Weak Ciphers</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Disable the following weak or insecure ciphers: {
                            results.ciphers
                              .filter(c => c.strength !== 'Strong')
                              .map(c => c.name)
                              .join(', ')
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {results?.certificate.daysRemaining !== undefined && results.certificate.daysRemaining < 30 && (
                  <div className="bg-white p-4 rounded-md border border-red-200">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Certificate Expiry</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Your certificate will expire in {results.certificate.daysRemaining} days.
                          Consider renewing it soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white p-4 rounded-md border border-blue-200">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Implement HSTS</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Implement HTTP Strict Transport Security (HSTS) to enforce secure connections.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md border border-blue-200">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Implement CSP</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Implement Content Security Policy headers to prevent XSS and data injection attacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SSLModule;

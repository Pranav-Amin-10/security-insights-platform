import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react";
import { VAPTStage, VAPTScanResults, Vulnerability } from "@/types";
import { 
  shodanReconnaissance, 
  getIPInfo, 
  getWHOIS, 
  getDNSRecords, 
  generateVulnerabilities,
  saveVAPTResults 
} from "@/lib/api-utils";
import { generateVAPTReport } from "@/lib/pdf-utils";

const initialStages: VAPTStage[] = [
  {
    id: 1,
    name: "Planning",
    description: "Define objectives, scope, and target systems",
    completed: false,
    results: null
  },
  {
    id: 2,
    name: "Reconnaissance",
    description: "Gather information about the target",
    completed: false,
    results: null
  },
  {
    id: 3,
    name: "Scanning",
    description: "Identify vulnerabilities and open ports",
    completed: false,
    results: null
  },
  {
    id: 4,
    name: "Vulnerability Analysis",
    description: "Analyze and categorize discovered vulnerabilities",
    completed: false,
    results: null
  },
  {
    id: 5,
    name: "Exploitation",
    description: "Attempt to exploit discovered vulnerabilities",
    completed: false,
    results: null
  },
  {
    id: 6,
    name: "Post Exploitation",
    description: "Maintain access and explore the system",
    completed: false,
    results: null
  },
  {
    id: 7,
    name: "Analysis",
    description: "Analyze findings and determine impact",
    completed: false,
    results: null
  },
  {
    id: 8,
    name: "Reporting",
    description: "Document findings and recommendations",
    completed: false,
    results: null
  },
  {
    id: 9,
    name: "Remediation Planning",
    description: "Plan for addressing discovered vulnerabilities",
    completed: false,
    results: null
  },
  {
    id: 10,
    name: "Remediation Verification",
    description: "Verify that remediation efforts were successful",
    completed: false,
    results: null
  }
];

const VAPTModule = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [stages, setStages] = useState<VAPTStage[]>(initialStages);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<VAPTScanResults | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  
  const [targetSystem, setTargetSystem] = useState<string>("");
  const [scopeDetails, setScopeDetails] = useState<string>("");
  const [testingMethod, setTestingMethod] = useState<string>("black-box");
  const [isAutomating, setIsAutomating] = useState<boolean>(false);
  
  const nextStage = async () => {
    if (activeStage >= stages.length) return;
    
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedStages = [...stages];
    updatedStages[activeStage - 1].completed = true;
    
    switch (activeStage) {
      case 1: // Planning
        updatedStages[activeStage - 1].results = {
          target: targetSystem,
          scope: scopeDetails,
          method: testingMethod,
          timestamp: new Date().toISOString()
        };
        break;
        
      case 2: // Reconnaissance
        const shodanResults = await shodanReconnaissance(targetSystem);
        const ipInfo = await getIPInfo(targetSystem);
        const whois = await getWHOIS(targetSystem);
        const dnsRecords = await getDNSRecords(targetSystem);
        
        updatedStages[activeStage - 1].results = {
          shodan: shodanResults,
          ipInfo,
          whois,
          dnsRecords
        };
        break;
        
      case 3: // Scanning
        const scanVulnerabilities = generateVulnerabilities(Math.floor(Math.random() * 5) + 5);
        setVulnerabilities(scanVulnerabilities);
        
        updatedStages[activeStage - 1].results = {
          openPorts: [80, 443, 22, 21, 3389, 8080].filter(() => Math.random() > 0.3),
          services: [
            { port: 80, service: 'http', version: 'nginx 1.18.0' },
            { port: 443, service: 'https', version: 'nginx 1.18.0' },
            { port: 22, service: 'ssh', version: 'OpenSSH 7.6p1' },
          ],
          vulnerabilities: scanVulnerabilities
        };
        break;
        
      case 4: // Vulnerability Analysis
        updatedStages[activeStage - 1].results = {
          criticalVulns: vulnerabilities.filter(v => v.severity === 'Critical'),
          highVulns: vulnerabilities.filter(v => v.severity === 'High'),
          mediumVulns: vulnerabilities.filter(v => v.severity === 'Medium'),
          lowVulns: vulnerabilities.filter(v => v.severity === 'Low'),
          infoVulns: vulnerabilities.filter(v => v.severity === 'Info')
        };
        break;
        
      case 5: // Exploitation
        const exploitableVulns = vulnerabilities.filter(v => 
          v.severity === 'Critical' || v.severity === 'High'
        );
        
        updatedStages[activeStage - 1].results = {
          exploited: exploitableVulns.map(v => ({
            vulnerability: v,
            exploitResult: Math.random() > 0.3 ? 'Success' : 'Failed',
            details: `Attempted to exploit ${v.name} using common techniques.`
          }))
        };
        break;
        
      case 6: // Post Exploitation
        updatedStages[activeStage - 1].results = {
          accessMaintained: Math.random() > 0.5,
          dataAccessed: ['Configuration files', 'User credentials', 'Database connection strings'],
          persistenceMechanisms: ['Scheduled task', 'Modified startup items']
        };
        break;
        
      case 7: // Analysis
        updatedStages[activeStage - 1].results = {
          riskAssessment: {
            businessImpact: 'High',
            dataCompromiseRisk: 'Medium',
            operationalImpact: 'Medium'
          },
          attackVectors: ['Remote exploit', 'Credential compromise'],
          rootCauses: ['Outdated software', 'Weak authentication', 'Misconfiguration']
        };
        break;
        
      case 8: // Reporting
        const resultsObj: VAPTScanResults = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toISOString(),
          target: targetSystem,
          stages: updatedStages,
          vulnerabilities,
          summary: {
            criticalCount: vulnerabilities.filter(v => v.severity === 'Critical').length,
            highCount: vulnerabilities.filter(v => v.severity === 'High').length,
            mediumCount: vulnerabilities.filter(v => v.severity === 'Medium').length,
            lowCount: vulnerabilities.filter(v => v.severity === 'Low').length,
            infoCount: vulnerabilities.filter(v => v.severity === 'Info').length
          }
        };
        
        setScanResults(resultsObj);
        updatedStages[activeStage - 1].results = {
          reportGenerated: true,
          reportTimestamp: new Date().toISOString()
        };
        break;
        
      case 9: // Remediation Planning
        updatedStages[activeStage - 1].results = {
          remediationItems: vulnerabilities.map(v => ({
            vulnerability: v,
            priority: v.severity === 'Critical' ? 'Immediate' : 
                      v.severity === 'High' ? 'High' :
                      v.severity === 'Medium' ? 'Medium' : 'Low',
            suggestedFix: v.remediation,
            timeEstimate: v.severity === 'Critical' ? '1-2 days' : 
                          v.severity === 'High' ? '1 week' :
                          v.severity === 'Medium' ? '2 weeks' : '1 month'
          }))
        };
        break;
        
      case 10: // Remediation Verification
        updatedStages[activeStage - 1].results = {
          verificationResults: vulnerabilities.map(v => ({
            vulnerability: v,
            verified: Math.random() > 0.3,
            notes: Math.random() > 0.3 ? 'Successfully remediated' : 'Still vulnerable, needs further attention'
          }))
        };
        
        if (scanResults) {
          try {
            await saveVAPTResults({
              ...scanResults,
              stages: updatedStages
            });
          } catch (error) {
            console.error('Error saving results:', error);
          }
        }
        break;
    }
    
    setStages(updatedStages);
    setActiveStage(activeStage + 1);
    setLoading(false);
    
    if (isAutomating && activeStage < stages.length) {
      setTimeout(() => nextStage(), 2000);
    }
  };
  
  const prevStage = () => {
    if (activeStage <= 1) return;
    setActiveStage(activeStage - 1);
  };
  
  const resetScan = () => {
    setIsAutomating(false);
    setActiveStage(1);
    setStages(initialStages);
    setScanResults(null);
    setVulnerabilities([]);
    setTargetSystem("");
    setScopeDetails("");
    setTestingMethod("black-box");
  };
  
  const startAutomatedScan = () => {
    if (!targetSystem) return;
    setIsAutomating(true);
    nextStage();
  };
  
  const downloadReport = () => {
    if (!scanResults) return;
    
    const doc = generateVAPTReport(scanResults);
    doc.save(`VAPT_Report_${scanResults.target}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">VAPT Module</h1>
          <p className="text-gray-600 mb-6">
            Vulnerability Assessment and Penetration Testing workflow with 10 stages from planning to remediation verification.
          </p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(activeStage - 1) * 10}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => stage.completed ? setActiveStage(stage.id) : null}
              className={`p-2 rounded-md text-xs md:text-sm text-center transition-colors ${
                stage.id === activeStage
                  ? "bg-blue-600 text-white"
                  : stage.completed
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!stage.completed && stage.id !== activeStage}
            >
              {stage.name}
            </button>
          ))}
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Stage {activeStage}: {stages[activeStage - 1]?.name}
          </h2>
          <p className="text-gray-600 mb-6">{stages[activeStage - 1]?.description}</p>
          
          {activeStage === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target System/Domain/IP
                </label>
                <Input
                  value={targetSystem}
                  onChange={(e) => setTargetSystem(e.target.value)}
                  placeholder="e.g., example.com or 192.168.1.1"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope Details
                </label>
                <Textarea
                  value={scopeDetails}
                  onChange={(e) => setScopeDetails(e.target.value)}
                  placeholder="Define the scope of the penetration test..."
                  className="w-full h-32"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testing Method
                </label>
                <select
                  value={testingMethod}
                  onChange={(e) => setTestingMethod(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="black-box">Black Box Testing</option>
                  <option value="white-box">White Box Testing</option>
                  <option value="gray-box">Gray Box Testing</option>
                </select>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={startAutomatedScan}
                  disabled={!targetSystem}
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Automated Scan"
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {activeStage > 1 && activeStage <= stages.length && (
            <div className="space-y-4">
              <Tabs defaultValue="shodan">
                <TabsList className="mb-4">
                  <TabsTrigger value="shodan">Shodan</TabsTrigger>
                  <TabsTrigger value="ipinfo">IP Info</TabsTrigger>
                  <TabsTrigger value="whois">WHOIS</TabsTrigger>
                  <TabsTrigger value="dns">DNS Records</TabsTrigger>
                </TabsList>
                
                <TabsContent value="shodan">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Shodan Reconnaissance Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">IP Address</p>
                        <p>{stages[1].results?.shodan?.ip || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">OS</p>
                        <p>{stages[1].results?.shodan?.os || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Open Ports</p>
                        <p>{stages[1].results?.shodan?.ports?.join(", ") || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hostnames</p>
                        <p>{stages[1].results?.shodan?.hostnames?.join(", ") || "N/A"}</p>
                      </div>
                    </div>
                    
                    <h4 className="text-md font-medium mt-4 mb-2">Services</h4>
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stages[1].results?.shodan?.services?.map((service: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap">{service.port}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{service.service}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{service.version}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ipinfo">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">IP Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">IP Address</p>
                        <p>{stages[1].results?.ipInfo?.ip || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hostname</p>
                        <p>{stages[1].results?.ipInfo?.hostname || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p>{`${stages[1].results?.ipInfo?.city || ""}, ${stages[1].results?.ipInfo?.region || ""}, ${stages[1].results?.ipInfo?.country || ""}`}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization</p>
                        <p>{stages[1].results?.ipInfo?.org || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Postal Code</p>
                        <p>{stages[1].results?.ipInfo?.postal || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Timezone</p>
                        <p>{stages[1].results?.ipInfo?.timezone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="whois">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">WHOIS Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Domain Name</p>
                        <p>{stages[1].results?.whois?.domain_name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Registrar</p>
                        <p>{stages[1].results?.whois?.registrar || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Creation Date</p>
                        <p>{stages[1].results?.whois?.creation_date || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                        <p>{stages[1].results?.whois?.expiration_date || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name Servers</p>
                        <p>{stages[1].results?.whois?.name_servers?.join(", ") || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Registrant Organization</p>
                        <p>{stages[1].results?.whois?.registrant?.organization || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="dns">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">DNS Records</h3>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">A Records</h4>
                      <p>{stages[1].results?.dnsRecords?.A?.join(", ") || "None found"}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">AAAA Records</h4>
                      <p>{stages[1].results?.dnsRecords?.AAAA?.join(", ") || "None found"}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">MX Records</h4>
                      <ul className="list-disc pl-6">
                        {stages[1].results?.dnsRecords?.MX?.map((mx: any, index: number) => (
                          <li key={index}>
                            {mx.preference} {mx.exchange}
                          </li>
                        )) || <li>None found</li>}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">NS Records</h4>
                      <p>{stages[1].results?.dnsRecords?.NS?.join(", ") || "None found"}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">TXT Records</h4>
                      <p>{stages[1].results?.dnsRecords?.TXT?.join(", ") || "None found"}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {activeStage === 3 && stages[2].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Scan Results</h3>
                
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Open Ports</h4>
                  <p className="text-sm">
                    {stages[2].results?.openPorts?.join(", ") || "No open ports detected"}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Services</h4>
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stages[2].results?.services?.map((service: any, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">{service.port}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{service.service}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{service.version}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Vulnerabilities Detected</h4>
                  <div className="space-y-4">
                    {vulnerabilities.length > 0 ? (
                      vulnerabilities.map((vuln, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-md overflow-hidden ${
                            vuln.severity === 'Critical' ? 'border-red-300 bg-red-50' :
                            vuln.severity === 'High' ? 'border-orange-300 bg-orange-50' :
                            vuln.severity === 'Medium' ? 'border-yellow-300 bg-yellow-50' :
                            vuln.severity === 'Low' ? 'border-blue-300 bg-blue-50' :
                            'border-gray-300 bg-gray-50'
                          }`}
                        >
                          <div className={`px-4 py-2 flex items-center justify-between ${
                            vuln.severity === 'Critical' ? 'bg-red-100' :
                            vuln.severity === 'High' ? 'bg-orange-100' :
                            vuln.severity === 'Medium' ? 'bg-yellow-100' :
                            vuln.severity === 'Low' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            <h5 className="font-medium">{vuln.name}</h5>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              vuln.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                              vuln.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                              vuln.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              vuln.severity === 'Low' ? 'bg-blue-200 text-blue-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {vuln.severity}
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="text-sm">{vuln.description}</p>
                            {vuln.cveId && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-gray-500">CVE ID:</span>
                                <span className="text-xs ml-1">{vuln.cveId}</span>
                              </div>
                            )}
                            {vuln.cvssScore !== undefined && (
                              <div className="mt-1">
                                <span className="text-xs font-medium text-gray-500">CVSS Score:</span>
                                <span className="text-xs ml-1">{vuln.cvssScore}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No vulnerabilities detected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStage === 4 && stages[3].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Vulnerability Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-red-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-red-800">
                      {stages[3].results?.criticalVulns?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-red-600">Critical</div>
                  </div>
                  
                  <div className="bg-orange-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-orange-800">
                      {stages[3].results?.highVulns?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-orange-600">High</div>
                  </div>
                  
                  <div className="bg-yellow-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-yellow-800">
                      {stages[3].results?.mediumVulns?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-yellow-600">Medium</div>
                  </div>
                  
                  <div className="bg-blue-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-blue-800">
                      {stages[3].results?.lowVulns?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-blue-600">Low</div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {stages[3].results?.infoVulns?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-gray-600">Info</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-4">Critical & High Vulnerabilities</h4>
                  {[...(stages[3].results?.criticalVulns || []), ...(stages[3].results?.highVulns || [])].length > 0 ? (
                    <div className="space-y-4">
                      {[...(stages[3].results?.criticalVulns || []), ...(stages[3].results?.highVulns || [])].map((vuln, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-md overflow-hidden ${
                            vuln.severity === 'Critical' ? 'border-red-300' : 'border-orange-300'
                          }`}
                        >
                          <div className={`px-4 py-2 ${
                            vuln.severity === 'Critical' ? 'bg-red-100' : 'bg-orange-100'
                          }`}>
                            <h5 className="font-medium">{vuln.name}</h5>
                          </div>
                          <div className="p-4">
                            <p className="text-sm mb-2">{vuln.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {vuln.cveId && (
                                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                                  {vuln.cveId}
                                </span>
                              )}
                              {vuln.cvssScore !== undefined && (
                                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                                  CVSS: {vuln.cvssScore}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No critical or high vulnerabilities detected</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeStage === 5 && stages[4].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Exploitation Results</h3>
                
                {stages[4].results?.exploited?.length > 0 ? (
                  <div className="space-y-4">
                    {stages[4].results.exploited.map((exploit: any, index: number) => (
                      <div 
                        key={index} 
                        className={`border rounded-md overflow-hidden ${
                          exploit.exploitResult === 'Success' ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <div className={`px-4 py-2 flex items-center justify-between ${
                          exploit.exploitResult === 'Success' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <h5 className="font-medium">{exploit.vulnerability.name}</h5>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            exploit.exploitResult === 'Success' 
                              ? 'bg-red-200 text-red-800' 
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {exploit.exploitResult}
                          </span>
                        </div>
                        <div className="p-4">
                          <p className="text-sm">{exploit.details}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-500">Vulnerability:</span>
                            <span className="text-xs ml-1">{exploit.vulnerability.description}</span>
                          </div>
                          {exploit.vulnerability.cveId && (
                            <div className="mt-1">
                              <span className="text-xs font-medium text-gray-500">CVE:</span>
                              <span className="text-xs ml-1">{exploit.vulnerability.cveId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No vulnerabilities were successfully exploited</p>
                )}
              </div>
            </div>
          )}
          
          {activeStage === 6 && stages[5].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Post Exploitation Analysis</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium mb-2">Access Status</h4>
                    <div className="flex items-center">
                      {stages[5].results?.accessMaintained ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-red-800 font-medium">Persistent access established</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-800 font-medium">No persistent access established</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Data Access</h4>
                    {stages[5].results?.dataAccessed?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {stages[5].results.dataAccessed.map((data: string, index: number) => (
                          <li key={index} className="text-sm">{data}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No data was accessed</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Persistence Mechanisms</h4>
                    {stages[5].results?.persistenceMechanisms?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {stages[5].results.persistenceMechanisms.map((mechanism: string, index: number) => (
                          <li key={index} className="text-sm">{mechanism}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No persistence mechanisms were identified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStage === 7 && stages[6].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Risk Analysis</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium mb-2">Risk Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-red-200 rounded-md overflow-hidden">
                        <div className="bg-red-100 px-3 py-1 text-sm font-medium">Business Impact</div>
                        <div className="p-3 text-center font-bold">
                          {stages[6].results?.riskAssessment?.businessImpact || "Low"}
                        </div>
                      </div>
                      
                      <div className="border border-orange-200 rounded-md overflow-hidden">
                        <div className="bg-orange-100 px-3 py-1 text-sm font-medium">Data Compromise Risk</div>
                        <div className="p-3 text-center font-bold">
                          {stages[6].results?.riskAssessment?.dataCompromiseRisk || "Low"}
                        </div>
                      </div>
                      
                      <div className="border border-blue-200 rounded-md overflow-hidden">
                        <div className="bg-blue-100 px-3 py-1 text-sm font-medium">Operational Impact</div>
                        <div className="p-3 text-center font-bold">
                          {stages[6].results?.riskAssessment?.operationalImpact || "Low"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Attack Vectors</h4>
                    {stages[6].results?.attackVectors?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {stages[6].results.attackVectors.map((vector: string, index: number) => (
                          <li key={index} className="text-sm">{vector}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No attack vectors were identified</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Root Causes</h4>
                    {stages[6].results?.rootCauses?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {stages[6].results.rootCauses.map((cause: string, index: number) => (
                          <li key={index} className="text-sm">{cause}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No root causes were identified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStage === 8 && stages[7].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Report Generation</h3>
                
                <div className="text-center p-6 bg-white border border-gray-200 rounded-md">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-medium mb-2">Report Generated</h4>
                  <p className="text-gray-600 mb-4">
                    Your VAPT report has been generated successfully.
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={downloadReport}
                  >
                    Download PDF Report
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-2">Report Summary</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                    <div className="bg-red-100 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-red-800">
                        {scanResults?.summary.criticalCount || 0}
                      </div>
                      <div className="text-xs font-medium text-red-600">Critical</div>
                    </div>
                    
                    <div className="bg-orange-100 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-orange-800">
                        {scanResults?.summary.highCount || 0}
                      </div>
                      <div className="text-xs font-medium text-orange-600">High</div>
                    </div>
                    
                    <div className="bg-yellow-100 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-yellow-800">
                        {scanResults?.summary.mediumCount || 0}
                      </div>
                      <div className="text-xs font-medium text-yellow-600">Medium</div>
                    </div>
                    
                    <div className="bg-blue-100 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-blue-800">
                        {scanResults?.summary.lowCount || 0}
                      </div>
                      <div className="text-xs font-medium text-blue-600">Low</div>
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {scanResults?.summary.infoCount || 0}
                      </div>
                      <div className="text-xs font-medium text-gray-600">Info</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStage === 9 && stages[8].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Remediation Plan</h3>
                
                <div className="space-y-4">
                  {stages[8].results?.remediationItems?.length > 0 ? (
                    stages[8].results.remediationItems.map((item: any, index: number) => (
                      <div 
                        key={index} 
                        className={`border rounded-md overflow-hidden ${
                          item.priority === 'Immediate' ? 'border-red-300' :
                          item.priority === 'High' ? 'border-orange-300' :
                          item.priority === 'Medium' ? 'border-yellow-300' :
                          'border-blue-300'
                        }`}
                      >
                        <div className={`px-4 py-2 flex items-center justify-between ${
                          item.priority === 'Immediate' ? 'bg-red-100' :
                          item.priority === 'High' ? 'bg-orange-100' :
                          item.priority === 'Medium' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <h5 className="font-medium">{item.vulnerability.name}</h5>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              item.priority === 'Immediate' ? 'bg-red-200 text-red-800' :
                              item.priority === 'High' ? 'bg-orange-200 text-orange-800' :
                              item.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {item.priority}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">
                              {item.timeEstimate}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm mb-3">{item.vulnerability.description}</p>
                          <div className="bg-white border border-gray-200 rounded-md p-3">
                            <h6 className="text-sm font-medium mb-1">Suggested Fix:</h6>
                            <p className="text-sm">{item.suggestedFix}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No remediation items were identified</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeStage === 10 && stages[9].completed && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Remediation Verification</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-100 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold text-green-800">
                        {stages[9].results?.verificationResults?.filter((r: any) => r.verified).length || 0}
                      </div>
                      <div className="text-sm font-medium text-green-600">Successfully Remediated</div>
                    </div>
                    
                    <div className="bg-red-100 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold text-red-800">
                        {stages[9].results?.verificationResults?.filter((r: any) => !r.verified).length || 0}
                      </div>
                      <div className="text-sm font-medium text-red-600">Still Vulnerable</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-2">Verification Details</h4>
                    
                    <div className="space-y-4">
                      {stages[9].results?.verificationResults?.map((result: any, index: number) => (
                        <div 
                          key={index} 
                          className={`border rounded-md overflow-hidden ${
                            result.verified ? 'border-green-300' : 'border-red-300'
                          }`}
                        >
                          <div className={`px-4 py-2 flex items-center justify-between ${
                            result.verified ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <h5 className="font-medium">{result.vulnerability.name}</h5>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              result.verified 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {result.verified ? 'Remediated' : 'Still Vulnerable'}
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="text-sm mb-2">{result.notes}</p>
                            <div className="text-xs text-gray-500">
                              Original severity: {result.vulnerability.severity}
                              {result.vulnerability.cveId && ` | CVE: ${result.vulnerability.cveId}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="text-md font-medium mb-1">Final Notes</h4>
                        <p className="text-sm">
                          The VAPT process has been completed. A final report has been generated that includes all findings, 
                          remediation recommendations, and verification results. You can download the report using the button below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeStage > stages.length && (
            <div className="space-y-4">
              <div className="bg-green-50 p-6 rounded-md border border-green-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">VAPT Process Complete</h3>
                <p className="text-gray-600 mb-6">
                  All stages of the vulnerability assessment and penetration testing have been completed successfully.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={downloadReport}
                  >
                    Download Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetScan}
                  >
                    Start New Scan
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Vulnerabilities</h4>
                  <div className="text-2xl font-bold">
                    {vulnerabilities.length}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Critical/High</h4>
                  <div className="text-2xl font-bold">
                    {
                      vulnerabilities.filter(v => 
                        v.severity === 'Critical' || v.severity === 'High'
                      ).length
                    }
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Remediated</h4>
                  <div className="text-2xl font-bold">
                    {stages[9].results?.verificationResults?.filter((r: any) => r.verified).length || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!isAutomating && activeStage > 1 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStage}
                disabled={activeStage <= 1 || loading}
              >
                Previous Stage
              </Button>
              
              {activeStage <= stages.length ? (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={nextStage}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Next Stage: ${
                      activeStage < stages.length 
                        ? stages[activeStage].name 
                        : "Complete"
                    }`
                  )}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={resetScan}
                >
                  Start New Scan
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default VAPTModule;

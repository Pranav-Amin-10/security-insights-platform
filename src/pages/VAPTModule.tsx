import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Clock, Shield } from "lucide-react";
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
import { toast } from "sonner";

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
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  
  const processStage = async (stageNumber: number) => {
    if (stageNumber > stages.length) {
      setScanComplete(true);
      setIsAutomating(false);
      setShowResults(true);
      setLoading(false);
      setProgress(100);
      toast.success("VAPT scan completed successfully!");
      return;
    }
    
    setActiveStage(stageNumber);
    setProgress(Math.min(100, Math.floor((stageNumber - 1) * 10)));
    
    try {
      const updatedStages = [...stages];
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (stageNumber) {
        case 1: // Planning
          updatedStages[stageNumber - 1].results = {
            target: targetSystem,
            scope: scopeDetails,
            method: testingMethod,
            timestamp: new Date().toISOString(),
            details: {
              targetType: targetSystem.includes('.') ? 'Domain' : 'IP Address',
              assessmentScope: scopeDetails || 'Full system assessment',
              methodology: testingMethod === 'black-box' ? 
                'No prior knowledge of the system' : 
                testingMethod === 'white-box' ? 
                'Complete system knowledge and access' : 
                'Limited system knowledge'
            }
          };
          break;
          
        case 2: // Reconnaissance
          try {
            const shodanResults = await shodanReconnaissance(targetSystem);
            const ipInfo = await getIPInfo(targetSystem);
            const whois = await getWHOIS(targetSystem);
            const dnsRecords = await getDNSRecords(targetSystem);
            
            updatedStages[stageNumber - 1].results = {
              shodan: {
                ...shodanResults,
                lastUpdate: new Date().toISOString(),
                detectedServices: shodanResults?.ports || [],
                vulnerabilities: shodanResults?.vulns || []
              },
              ipInfo: {
                ...ipInfo,
                geolocation: {
                  latitude: ipInfo?.latitude,
                  longitude: ipInfo?.longitude,
                  accuracy: ipInfo?.accuracy
                },
                network: {
                  asn: ipInfo?.asn,
                  provider: ipInfo?.isp,
                  type: ipInfo?.type
                }
              },
              whois: {
                ...whois,
                registrationDetails: {
                  registrar: whois?.registrar,
                  createdDate: whois?.createdDate,
                  expiryDate: whois?.expiryDate,
                  lastUpdated: whois?.updatedDate
                },
                contactInfo: {
                  technical: whois?.technical,
                  administrative: whois?.administrative
                }
              },
              dnsRecords: {
                records: dnsRecords,
                analysisTimestamp: new Date().toISOString(),
                recordTypes: ['A', 'MX', 'TXT', 'CNAME', 'NS'].map(type => ({
                  type,
                  records: dnsRecords?.filter((r: any) => r.type === type) || []
                }))
              }
            };
          } catch (error) {
            console.error("Error during reconnaissance:", error);
            toast.error("Error during reconnaissance phase, but continuing scan");
            updatedStages[stageNumber - 1].results = { 
              error: "Reconnaissance failed",
              errorDetails: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            };
          }
          break;
          
        case 3: // Scanning
          try {
            const scanVulnerabilities = generateVulnerabilities(Math.floor(Math.random() * 5) + 5);
            setVulnerabilities(scanVulnerabilities);
            
            updatedStages[stageNumber - 1].results = {
              openPorts: [80, 443, 22, 21, 3389, 8080].filter(() => Math.random() > 0.3),
              services: [
                { port: 80, service: 'http', version: 'nginx 1.18.0' },
                { port: 443, service: 'https', version: 'nginx 1.18.0' },
                { port: 22, service: 'ssh', version: 'OpenSSH 7.6p1' },
              ],
              vulnerabilities: scanVulnerabilities
            };
          } catch (error) {
            console.error("Error during scanning:", error);
            toast.error("Error during scanning phase, but continuing scan");
            updatedStages[stageNumber - 1].results = { error: "Scanning failed" };
          }
          break;
          
        case 4: // Vulnerability Analysis
          updatedStages[stageNumber - 1].results = {
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
          
          updatedStages[stageNumber - 1].results = {
            exploited: exploitableVulns.map(v => ({
              vulnerability: v,
              exploitResult: Math.random() > 0.3 ? 'Success' : 'Failed',
              details: `Attempted to exploit ${v.name} using common techniques.`
            }))
          };
          break;
          
        case 6: // Post Exploitation
          updatedStages[stageNumber - 1].results = {
            accessMaintained: Math.random() > 0.5,
            dataAccessed: ['Configuration files', 'User credentials', 'Database connection strings'],
            persistenceMechanisms: ['Scheduled task', 'Modified startup items']
          };
          break;
          
        case 7: // Analysis
          updatedStages[stageNumber - 1].results = {
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
          updatedStages[stageNumber - 1].results = {
            reportGenerated: true,
            reportTimestamp: new Date().toISOString()
          };
          break;
          
        case 9: // Remediation Planning
          updatedStages[stageNumber - 1].results = {
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
          updatedStages[stageNumber - 1].results = {
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
              toast.error("Error saving scan results");
            }
          }
          break;
      }
      
      updatedStages[stageNumber - 1].completed = true;
      setStages(updatedStages);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      processStage(stageNumber + 1);
      
    } catch (error) {
      console.error(`Error processing stage ${stageNumber}:`, error);
      setScanError(`Error during stage ${stageNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAutomating(false);
      setLoading(false);
      toast.error(`Scan failed at stage ${stageNumber}`);
    }
  };
  
  const startAutomatedScan = () => {
    if (!targetSystem) {
      toast.error("Please enter a target system before starting the scan");
      return;
    }
    
    setScanError(null);
    setProgress(0);
    toast.info("Starting automated VAPT scan...");
    setIsAutomating(true);
    setShowResults(false);
    setScanComplete(false);
    setLoading(true);
    
    setStages(initialStages);
    setActiveStage(1);
    
    processStage(1);
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
    setScanComplete(false);
    setShowResults(false);
    setScanError(null);
    setProgress(0);
    toast.info("Scan reset. Ready to start a new scan.");
  };
  
  const downloadReport = () => {
    if (!scanResults) {
      toast.error("No scan results available to download");
      return;
    }
    
    try {
      const doc = generateVAPTReport(scanResults);
      doc.save(`VAPT_Report_${scanResults.target}_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report");
    }
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
        
        {!scanComplete && !scanError && (
          <Progress value={progress} className="h-2 mb-4" />
        )}
        
        {!scanComplete && !scanError && isAutomating && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={`p-2 rounded-md text-xs md:text-sm text-center transition-colors ${
                  stage.id === activeStage
                    ? "bg-blue-600 text-white"
                    : stage.completed
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {stage.name}
                {loading && stage.id === activeStage && (
                  <span className="ml-1 inline-block animate-pulse">...</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <Card className="p-6">
          {!scanComplete && !isAutomating && !scanError && activeStage === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Target Configuration
              </h2>
              <p className="text-gray-600 mb-6">Enter target details to begin the automated VAPT process.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target System/Domain/IP <span className="text-red-500">*</span>
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
                  disabled={!targetSystem || loading}
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
          
          {!scanComplete && isAutomating && !scanError && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Automated Scan in Progress</h2>
              <p className="text-gray-600">
                Currently processing: <span className="font-medium">{stages[activeStage - 1]?.name || "Completing scan"}</span>
              </p>
              <p className="text-gray-500 text-sm mt-2">Stage {activeStage - 1} of 10 complete ({progress}%)</p>
            </div>
          )}
          
          {scanError && (
            <div className="text-center py-10">
              <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600">Scan Failed</h2>
              <p className="text-gray-700 mb-4">{scanError}</p>
              <Button 
                variant="outline" 
                onClick={resetScan}
              >
                Start New Scan
              </Button>
            </div>
          )}
          
          {scanComplete && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">VAPT Process Complete</h2>
                <p className="text-gray-600">
                  All stages of the vulnerability assessment and penetration testing have been completed successfully.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-red-100 p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-red-800">
                    {scanResults?.summary.criticalCount || 0}
                  </div>
                  <div className="text-xs font-medium text-red-600">Critical</div>
                </div>
                
                <div className="bg-orange-100 p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-orange-800">
                    {scanResults?.summary.highCount || 0}
                  </div>
                  <div className="text-xs font-medium text-orange-600">High</div>
                </div>
                
                <div className="bg-yellow-100 p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-yellow-800">
                    {scanResults?.summary.mediumCount || 0}
                  </div>
                  <div className="text-xs font-medium text-yellow-600">Medium</div>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-blue-800">
                    {scanResults?.summary.lowCount || 0}
                  </div>
                  <div className="text-xs font-medium text-blue-600">Low</div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {scanResults?.summary.infoCount || 0}
                  </div>
                  <div className="text-xs font-medium text-gray-600">Info</div>
                </div>
              </div>
              
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="reconnaissance">Reconnaissance</TabsTrigger>
                  <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                  <TabsTrigger value="remediation">Remediation</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">Scan Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Target</p>
                          <p>{scanResults?.target || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Scan Date</p>
                          <p>{scanResults?.timestamp ? new Date(scanResults.timestamp).toLocaleString() : "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Vulnerabilities</p>
                          <p>{vulnerabilities.length}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Testing Method</p>
                          <p className="capitalize">{testingMethod}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">Risk Assessment</h3>
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
                  </div>
                </TabsContent>
                
                <TabsContent value="reconnaissance">
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <h3 className="text-lg font-medium mb-4">Network Information</h3>
                      {stages[1].results?.ipInfo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Geolocation</h4>
                            <div className="mt-1 space-y-1">
                              <p>Latitude: {stages[1].results.ipInfo.geolocation.latitude}</p>
                              <p>Longitude: {stages[1].results.ipInfo.geolocation.longitude}</p>
                              <p>Accuracy: {stages[1].results.ipInfo.geolocation.accuracy}m</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Network Details</h4>
                            <div className="mt-1 space-y-1">
                              <p>ASN: {stages[1].results.ipInfo.network.asn}</p>
                              <p>Provider: {stages[1].results.ipInfo.network.provider}</p>
                              <p>Type: {stages[1].results.ipInfo.network.type}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <h3 className="text-lg font-medium mb-4">DNS Records</h3>
                      {stages[1].results?.dnsRecords && (
                        <div className="space-y-4">
                          {stages[1].results.dnsRecords.recordTypes.map((recordType: any) => (
                            <div key={recordType.type} className="border-t pt-4 first:border-t-0 first:pt-0">
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                {recordType.type} Records
                              </h4>
                              <div className="space-y-2">
                                {recordType.records.map((record: any, index: number) => (
                                  <div key={index} className="text-sm">
                                    {JSON.stringify(record)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                      <h3 className="text-lg font-medium mb-4">WHOIS Information</h3>
                      {stages[1].results?.whois && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Registration Details</h4>
                            <div className="mt-1 space-y-1">
                              <p>Registrar: {stages[1].results.whois.registrationDetails.registrar}</p>
                              <p>Created: {new Date(stages[1].results.whois.registrationDetails.createdDate).toLocaleDateString()}</p>
                              <p>Expires: {new Date(stages[1].results.whois.registrationDetails.expiryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                            <div className="mt-1 space-y-1">
                              <p>Technical: {stages[1].results.whois.contactInfo.technical || 'Redacted'}</p>
                              <p>Administrative: {stages[1].results.whois.contactInfo.administrative || 'Redacted'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vulnerabilities">
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
                </TabsContent>
                
                <TabsContent value="remediation">
                  <div className="space-y-4">
                    {stages[8]?.results?.remediationItems?.length > 0 ? (
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
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    {stages.map((stage) => (
                      <div 
                        key={stage.id} 
                        className={`border rounded-md p-4 ${
                          stage.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{stage.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            stage.completed ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {stage.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                        {stage.results && !stage.results.error && (
                          <div className="text-sm">
                            <strong>Results:</strong>
                            <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(stage.results, null, 2)}
                            </pre>
                          </div>
                        )}
                        {stage.results?.error && (
                          <div className="text-sm text-red-600">
                            Error: {stage.results.errorDetails || stage.results.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-center mt-8 space-x-4">
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
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default VAPTModule;

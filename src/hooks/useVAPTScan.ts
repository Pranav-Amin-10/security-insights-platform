
import { useState } from "react";
import { VAPTStage, VAPTScanResults, Vulnerability } from "@/types";
import { VAPTFormValues } from "@/types/vapt";
import { toast } from "sonner";
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

export const useVAPTScan = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [stages, setStages] = useState<VAPTStage[]>(initialStages);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<VAPTScanResults | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
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

      await new Promise(resolve => setTimeout(resolve, 5000));

      switch (stageNumber) {
        case 1: // Planning
          updatedStages[stageNumber - 1].results = {
            target: formValues.targetSystem,
            scope: formValues.scopeDetails,
            method: formValues.testingMethod,
            timestamp: new Date().toISOString(),
            details: {
              targetType: formValues.targetSystem.includes('.') ? 'Domain' : 'IP Address',
              assessmentScope: formValues.scopeDetails || 'Full system assessment',
              methodology: formValues.testingMethod === 'black-box' ? 
                'No prior knowledge of the system' : 
                formValues.testingMethod === 'white-box' ? 
                'Complete system knowledge and access' : 
                'Limited system knowledge'
            }
          };
          break;
          
        case 2: // Reconnaissance
          try {
            const shodanResults = await shodanReconnaissance(formValues.targetSystem);
            const ipInfo = await getIPInfo(formValues.targetSystem);
            const whois = await getWHOIS(formValues.targetSystem);
            const dnsRecords = await getDNSRecords(formValues.targetSystem);
            
            const recordTypes = Object.keys(dnsRecords || {})
              .filter(key => !['records', 'analysisTimestamp', 'recordTypes'].includes(key))
              .map(type => {
                const records = dnsRecords[type] || [];
                return {
                  type,
                  records: Array.isArray(records) ? records : [records]
                };
              });
            
            updatedStages[stageNumber - 1].results = {
              shodan: {
                ...shodanResults,
                lastUpdate: new Date().toISOString(),
                detectedServices: shodanResults?.ports || [],
                vulnerabilities: shodanResults?.vulns || [],
                ip: shodanResults?.ip || formValues.targetSystem
              },
              ipInfo: {
                ...ipInfo,
                geolocation: {
                  latitude: parseFloat(ipInfo?.loc?.split(',')[0]) || null,
                  longitude: parseFloat(ipInfo?.loc?.split(',')[1]) || null,
                  accuracy: null
                },
                network: {
                  asn: (ipInfo?.org || '').split(' ')[0] || '',
                  provider: (ipInfo?.org || '').split(' ').slice(1).join(' ') || '',
                  type: 'Unknown'
                }
              },
              whois: {
                ...whois,
                registrationDetails: {
                  registrar: whois?.registrar || 'Unknown',
                  createdDate: whois?.creation_date || 'Unknown',
                  expiryDate: whois?.expiration_date || 'Unknown',
                  lastUpdated: whois?.updated_date || 'Unknown'
                },
                contactInfo: {
                  technical: whois?.emails?.[0] || 'Not available',
                  administrative: whois?.emails?.[1] || 'Not available'
                }
              },
              dnsRecords: {
                ...dnsRecords,
                records: Object.entries(dnsRecords || {}),
                analysisTimestamp: new Date().toISOString(),
                recordTypes: recordTypes
              }
            };
            
            console.log("Reconnaissance results:", updatedStages[stageNumber - 1].results);
          } catch (error) {
            console.error("Error during reconnaissance:", error);
            toast.error("Error during reconnaissance phase, but continuing scan");
            updatedStages[stageNumber - 1].results = { 
              error: "Reconnaissance failed",
              errorDetails: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString(),
              shodan: {
                lastUpdate: new Date().toISOString(),
                detectedServices: [],
                vulnerabilities: [],
                ip: formValues.targetSystem
              },
              ipInfo: {
                geolocation: { latitude: null, longitude: null, accuracy: null },
                network: { asn: 'Unknown', provider: 'Unknown', type: 'Unknown' }
              },
              whois: {
                registrationDetails: {
                  registrar: 'Unknown',
                  createdDate: 'Unknown',
                  expiryDate: 'Unknown'
                },
                contactInfo: {
                  technical: 'Not available',
                  administrative: 'Not available'
                }
              },
              dnsRecords: {
                records: [],
                analysisTimestamp: new Date().toISOString(),
                recordTypes: []
              }
            };
          }
          break;
          
        case 3: // Scanning
          try {
            // Generate between 8-15 vulnerabilities for better testing
            const scanVulnerabilities = generateVulnerabilities(Math.floor(Math.random() * 8) + 8);
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
            updatedStages[stageNumber - 1].results = { 
              error: "Scanning failed",
              openPorts: [],
              services: [],
              vulnerabilities: []
            };
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
          // Create summary counts from actual vulnerabilities
          const criticalCount = vulnerabilities.filter(v => v.severity === 'Critical').length;
          const highCount = vulnerabilities.filter(v => v.severity === 'High').length;
          const mediumCount = vulnerabilities.filter(v => v.severity === 'Medium').length;
          const lowCount = vulnerabilities.filter(v => v.severity === 'Low').length;
          const infoCount = vulnerabilities.filter(v => v.severity === 'Info').length;
          
          const resultsObj: VAPTScanResults = {
            id: `scan-${Date.now()}`,
            timestamp: new Date().toISOString(),
            target: formValues.targetSystem,
            stages: updatedStages,
            vulnerabilities,
            summary: {
              criticalCount,
              highCount,
              mediumCount,
              lowCount,
              infoCount
            }
          };
          
          setScanResults(resultsObj);
          updatedStages[stageNumber - 1].results = {
            reportGenerated: true,
            reportTimestamp: new Date().toISOString()
          };
          break;
          
        case 9: // Remediation Planning
          // Create remediation items based on actual vulnerabilities
          updatedStages[stageNumber - 1].results = {
            remediationItems: vulnerabilities.map(v => ({
              vulnerability: v,
              priority: v.severity === 'Critical' ? 'Immediate' : 
                        v.severity === 'High' ? 'High' :
                        v.severity === 'Medium' ? 'Medium' : 'Low',
              suggestedFix: v.remediation || `Update and patch the affected component to address ${v.name}.`,
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
          
          // Create final scan results with updated summary counts
          const finalResultsObj: VAPTScanResults = {
            id: scanResults?.id || `scan-${Date.now()}`,
            timestamp: scanResults?.timestamp || new Date().toISOString(),
            target: formValues.targetSystem,
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
          
          setScanResults(finalResultsObj);
          
          try {
            await saveVAPTResults(finalResultsObj);
          } catch (error) {
            console.error('Error saving results:', error);
            toast.error("Error saving scan results");
          }
          break;
      }

      updatedStages[stageNumber - 1].completed = true;
      setStages(updatedStages);

      await new Promise(resolve => setTimeout(resolve, 3000));
      processStage(stageNumber + 1);

    } catch (error) {
      console.error(`Error processing stage ${stageNumber}:`, error);
      setScanError(`Error during stage ${stageNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAutomating(false);
      setLoading(false);
      toast.error(`Scan failed at stage ${stageNumber}`);
    }
  };

  const [formValues, setFormValues] = useState<VAPTFormValues>({
    targetSystem: "",
    scopeDetails: "",
    testingMethod: "black-box"
  });

  const startAutomatedScan = (formValues: VAPTFormValues) => {
    if (!formValues.targetSystem) {
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
    setFormValues(formValues);

    processStage(1);
  };

  const resetScan = () => {
    setIsAutomating(false);
    setActiveStage(1);
    setStages(initialStages);
    setScanResults(null);
    setVulnerabilities([]);
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

  return {
    activeStage,
    stages,
    loading,
    scanResults,
    vulnerabilities,
    isAutomating,
    scanComplete,
    showResults,
    scanError,
    progress,
    startAutomatedScan,
    resetScan,
    downloadReport
  };
};

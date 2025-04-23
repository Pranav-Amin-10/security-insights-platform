
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { VAPTScanResults, VAPTStage, Vulnerability } from "@/types";
import { ReconnaissanceResults } from "@/types/vapt";

interface ScanResultsProps {
  scanResults: VAPTScanResults;
  vulnerabilities: Vulnerability[];
  stages: VAPTStage[];
  onDownloadReport: () => void;
  onResetScan: () => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  scanResults,
  vulnerabilities,
  stages,
  onDownloadReport,
  onResetScan,
}) => {
  const renderSummaryTab = () => (
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
            <p>
              {scanResults?.timestamp
                ? new Date(scanResults.timestamp).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Vulnerabilities
            </p>
            <p>{vulnerabilities.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h3 className="text-lg font-medium mb-2">Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stages[5]?.results?.riskAssessment || {}).map(
            ([key, value]) => (
              <div
                key={key}
                className="border border-blue-200 rounded-md overflow-hidden"
              >
                <div className="bg-blue-100 px-3 py-1 text-sm font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </div>
                <div className="p-3 text-center font-bold">{value as string}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h3 className="text-lg font-medium mb-2">Vulnerability Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
            <p className="text-lg font-bold text-red-700">{scanResults?.summary?.criticalCount || 0}</p>
            <p className="text-xs text-red-600">Critical</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-center">
            <p className="text-lg font-bold text-orange-700">{scanResults?.summary?.highCount || 0}</p>
            <p className="text-xs text-orange-600">High</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-center">
            <p className="text-lg font-bold text-yellow-700">{scanResults?.summary?.mediumCount || 0}</p>
            <p className="text-xs text-yellow-600">Medium</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{scanResults?.summary?.lowCount || 0}</p>
            <p className="text-xs text-blue-600">Low</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
            <p className="text-lg font-bold text-gray-700">{scanResults?.summary?.infoCount || 0}</p>
            <p className="text-xs text-gray-600">Info</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReconnaissanceTab = () => {
    const reconResults = stages[0]?.results as ReconnaissanceResults;
    if (!reconResults || reconResults.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-600 font-medium">Reconnaissance Error</h3>
          <p>{reconResults?.errorDetails || "An error occurred during the reconnaissance phase"}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Shodan Info */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">Shodan Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Host Information</h4>
              <div className="mt-1 space-y-1">
                <p>IP: {reconResults.shodan?.ip || "N/A"}</p>
                <p>OS: {reconResults.shodan?.os || "Unknown"}</p>
                <p>Hostnames: {reconResults.shodan?.hostnames?.join(", ") || "None detected"}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Open Ports</h4>
              <div className="mt-1">
                <p>{reconResults.shodan?.ports?.join(", ") || "No ports detected"}</p>
              </div>
            </div>
          </div>
          
          {reconResults.shodan?.services && reconResults.shodan.services.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Detected Services</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reconResults.shodan.services.map((service, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{service.port}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{service.service}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{service.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* IP Info */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">Network Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Geolocation</h4>
              <div className="mt-1 space-y-1">
                <p>City: {reconResults.ipInfo?.city || "N/A"}</p>
                <p>Region: {reconResults.ipInfo?.region || "N/A"}</p>
                <p>Country: {reconResults.ipInfo?.country || "N/A"}</p>
                <p>
                  Coordinates: {reconResults.ipInfo?.geolocation?.latitude !== null && 
                  reconResults.ipInfo?.geolocation?.longitude !== null ? 
                  `${reconResults.ipInfo.geolocation.latitude}, ${reconResults.ipInfo.geolocation.longitude}` : 
                  "N/A"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Network Details
              </h4>
              <div className="mt-1 space-y-1">
                <p>ASN: {reconResults.ipInfo?.network?.asn || "N/A"}</p>
                <p>
                  Provider: {reconResults.ipInfo?.network?.provider || "N/A"}
                </p>
                <p>Type: {reconResults.ipInfo?.network?.type || "N/A"}</p>
                <p>Hostname: {reconResults.ipInfo?.hostname || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* WHOIS Information */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">WHOIS Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Registration</h4>
              <div className="mt-1 space-y-1">
                <p>Domain: {reconResults.whois?.domain_name || scanResults.target}</p>
                <p>Registrar: {reconResults.whois?.registrationDetails?.registrar || "N/A"}</p>
                <p>Created: {reconResults.whois?.registrationDetails?.createdDate || "N/A"}</p>
                <p>Expires: {reconResults.whois?.registrationDetails?.expiryDate || "N/A"}</p>
                <p>Last Updated: {reconResults.whois?.registrationDetails?.lastUpdated || "N/A"}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
              <div className="mt-1 space-y-1">
                <p>Technical: {reconResults.whois?.contactInfo?.technical || "N/A"}</p>
                <p>Administrative: {reconResults.whois?.contactInfo?.administrative || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* DNS Records */}
        {reconResults.dnsRecords?.recordTypes && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">DNS Records</h3>
            <div className="space-y-4">
              {reconResults.dnsRecords.recordTypes.length > 0 ? (
                reconResults.dnsRecords.recordTypes.map((recordType) => (
                  <div
                    key={recordType.type}
                    className="border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {recordType.type} Records
                    </h4>
                    <div className="space-y-1">
                      {recordType.records.length > 0 ? (
                        recordType.records.map((record, index) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                            {typeof record === 'object' ? JSON.stringify(record) : record}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No records found</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No DNS records found</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVulnerabilitiesTab = () => (
    <div className="space-y-4">
      {vulnerabilities.length > 0 ? (
        vulnerabilities.map((vuln, index) => (
          <div
            key={index}
            className={`border rounded-md overflow-hidden ${
              vuln.severity === "Critical"
                ? "border-red-300 bg-red-50"
                : vuln.severity === "High"
                ? "border-orange-300 bg-orange-50"
                : vuln.severity === "Medium"
                ? "border-yellow-300 bg-yellow-50"
                : vuln.severity === "Low"
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div
              className={`px-4 py-2 flex items-center justify-between ${
                vuln.severity === "Critical"
                  ? "bg-red-100"
                  : vuln.severity === "High"
                  ? "bg-orange-100"
                  : vuln.severity === "Medium"
                  ? "bg-yellow-100"
                  : vuln.severity === "Low"
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              <h5 className="font-medium">{vuln.name}</h5>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  vuln.severity === "Critical"
                    ? "bg-red-200 text-red-800"
                    : vuln.severity === "High"
                    ? "bg-orange-200 text-orange-800"
                    : vuln.severity === "Medium"
                    ? "bg-yellow-200 text-yellow-800"
                    : vuln.severity === "Low"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {vuln.severity}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm">{vuln.description}</p>
              {vuln.cveId && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">
                    CVE ID:
                  </span>
                  <span className="text-xs ml-1">{vuln.cveId}</span>
                </div>
              )}
              {vuln.cvssScore !== undefined && (
                <div className="mt-1">
                  <span className="text-xs font-medium text-gray-500">
                    CVSS Score:
                  </span>
                  <span className="text-xs ml-1">{vuln.cvssScore}</span>
                </div>
              )}
              {vuln.remediation && (
                <div className="mt-3 bg-white border border-gray-200 rounded p-2">
                  <span className="text-xs font-medium text-gray-500 block mb-1">
                    Remediation:
                  </span>
                  <span className="text-xs">{vuln.remediation}</span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No vulnerabilities detected</p>
      )}
    </div>
  );

  const renderRemediationTab = () => {
    // Make sure we're using the correct stage (8) and accessing remediationItems
    const remediationItems = stages[7]?.results?.remediationItems || [];
    
    return (
      <div className="space-y-4">
        {remediationItems && remediationItems.length > 0 ? (
          <>
            <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Remediation Summary</h3>
                <div className="text-sm text-gray-600">
                  Estimated completion time: {stages[7]?.results?.estimatedTimeToRemediate || "Unknown"}
                </div>
              </div>
              <div className="text-sm mt-2">Overall risk level: <span className="font-medium">{stages[7]?.results?.overallRisk || "Medium"}</span></div>
            </div>
            
            {remediationItems.map((item: any, index: number) => (
              <div
                key={index}
                className={`border rounded-md overflow-hidden ${
                  item.priority === "Immediate"
                    ? "border-red-300"
                    : item.priority === "High"
                    ? "border-orange-300"
                    : item.priority === "Medium"
                    ? "border-yellow-300"
                    : "border-blue-300"
                }`}
              >
                <div
                  className={`px-4 py-2 flex items-center justify-between ${
                    item.priority === "Immediate"
                      ? "bg-red-100"
                      : item.priority === "High"
                      ? "bg-orange-100"
                      : item.priority === "Medium"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                  }`}
                >
                  <h5 className="font-medium">{item.vulnerability.name}</h5>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.priority === "Immediate"
                          ? "bg-red-200 text-red-800"
                          : item.priority === "High"
                          ? "bg-orange-200 text-orange-800"
                          : item.priority === "Medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">
                      {item.timeEstimate}
                    </span>
                    {item.status && (
                      <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {item.status}
                      </span>
                    )}
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
            ))}
          </>
        ) : (
          <p className="text-gray-500">No remediation items were identified</p>
        )}
      </div>
    );
  };

  const renderTimelineTab = () => (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`border rounded-md p-4 ${
            stage.completed ? "border-green-300 bg-green-50" : "border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{stage.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                stage.completed
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {stage.completed ? "Completed" : "Pending"}
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
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="h-8 w-8 text-green-600">✓</div>
        </div>
        <h2 className="text-2xl font-bold mb-2">VAPT Process Complete</h2>
        <p className="text-gray-600">
          All stages of the vulnerability assessment and penetration testing have
          been completed successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Critical",
            count: scanResults?.summary?.criticalCount || 0,
            bg: "bg-red-100",
            text: "text-red-800",
          },
          {
            label: "High",
            count: scanResults?.summary?.highCount || 0,
            bg: "bg-orange-100",
            text: "text-orange-800",
          },
          {
            label: "Medium",
            count: scanResults?.summary?.mediumCount || 0,
            bg: "bg-yellow-100",
            text: "text-yellow-800",
          },
          {
            label: "Low",
            count: scanResults?.summary?.lowCount || 0,
            bg: "bg-blue-100",
            text: "text-blue-800",
          },
          {
            label: "Info",
            count: scanResults?.summary?.infoCount || 0,
            bg: "bg-gray-100",
            text: "text-gray-800",
          },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} p-4 rounded-md text-center`}>
            <div className={`text-2xl font-bold ${item.text}`}>
              {item.count}
            </div>
            <div className={`text-xs font-medium ${item.text}`}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="reconnaissance">Reconnaissance</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">{renderSummaryTab()}</TabsContent>
        <TabsContent value="reconnaissance">{renderReconnaissanceTab()}</TabsContent>
        <TabsContent value="vulnerabilities">{renderVulnerabilitiesTab()}</TabsContent>
        <TabsContent value="remediation">{renderRemediationTab()}</TabsContent>
        <TabsContent value="timeline">{renderTimelineTab()}</TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8 space-x-4">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onDownloadReport}>
          Download Report
        </Button>
        <Button variant="outline" onClick={onResetScan}>
          Start New Scan
        </Button>
      </div>
    </div>
  );
};

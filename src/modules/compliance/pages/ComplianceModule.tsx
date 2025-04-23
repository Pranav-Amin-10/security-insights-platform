
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateComplianceReport } from "@/lib/pdf-utils";
import { toast } from "sonner";

// Mock compliance frameworks
const frameworks = [
  { id: "iso27001", name: "ISO 27001" },
  { id: "pci", name: "PCI DSS" },
  { id: "gdpr", name: "GDPR" },
  { id: "hipaa", name: "HIPAA" },
  { id: "soc2", name: "SOC 2" },
];

// Mock compliance audit data
const mockComplianceData = {
  standard: "ISO 27001",
  timestamp: new Date().toISOString(),
  summary: {
    overallScore: 78,
    compliantCount: 64,
    partialCount: 12,
    nonCompliantCount: 6,
    naCount: 3,
  },
  controls: [
    { section: "A.5", control: "Information Security Policies", status: "Yes", comments: "Policies are in place and reviewed annually" },
    { section: "A.6", control: "Organization of Information Security", status: "Partial", comments: "Roles defined but not all responsibilities are assigned" },
    { section: "A.7", control: "Human Resources Security", status: "Yes", comments: "Background checks and security training implemented" },
    { section: "A.8", control: "Asset Management", status: "No", comments: "Asset inventory incomplete and not regularly updated" },
    { section: "A.9", control: "Access Control", status: "Yes", comments: "Access control policy implemented and enforced" },
    { section: "A.10", control: "Cryptography", status: "Partial", comments: "Encryption in transit but not at rest" },
    { section: "A.11", control: "Physical and Environmental Security", status: "Yes", comments: "Secured facilities with access controls" },
    { section: "A.12", control: "Operations Security", status: "No", comments: "Change management process not followed consistently" },
    { section: "A.13", control: "Communications Security", status: "Yes", comments: "Network security controls in place" },
  ]
};

const ComplianceModule = () => {
  const [selectedFramework, setSelectedFramework] = useState("iso27001");
  
  const handleDownloadReport = () => {
    try {
      const doc = generateComplianceReport(mockComplianceData);
      doc.save(`Compliance_Report_${mockComplianceData.standard}_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Compliance report downloaded successfully");
    } catch (error) {
      console.error("Error generating compliance report:", error);
      toast.error("Error generating compliance report");
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Module</h1>
          <p className="text-gray-600 mb-6">
            Manage compliance audits and standards for your organization.
          </p>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="audits">Audits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Compliance Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">Overall Compliance</h3>
                    <div className="text-3xl font-bold text-green-600">78%</div>
                    <p className="text-sm text-gray-500 mt-2">Based on active frameworks</p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">Controls</h3>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-600">64</div>
                        <p className="text-sm text-gray-500">Compliant</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-yellow-500">12</div>
                        <p className="text-sm text-gray-500">Partial</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-red-500">6</div>
                        <p className="text-sm text-gray-500">Non-Compliant</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">Active Frameworks</h3>
                    <div className="text-3xl font-bold">5</div>
                    <p className="text-sm text-gray-500 mt-2">ISO 27001, GDPR, PCI DSS, HIPAA, SOC 2</p>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleDownloadReport}>Download Latest Report</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="frameworks">
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Compliance Frameworks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks.map((framework) => (
                    <Card 
                      key={framework.id} 
                      className={`p-4 cursor-pointer ${selectedFramework === framework.id ? 'border-2 border-blue-500' : ''}`}
                      onClick={() => setSelectedFramework(framework.id)}
                    >
                      <h3 className="text-lg font-medium">{framework.name}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xl font-bold text-green-600">
                          {framework.id === 'iso27001' ? '78%' : 
                           framework.id === 'pci' ? '92%' : 
                           framework.id === 'gdpr' ? '65%' : 
                           framework.id === 'hipaa' ? '81%' : '75%'}
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="audits">
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Audit History</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Framework</th>
                      <th className="p-2 text-left">Score</th>
                      <th className="p-2 text-left">Auditor</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">2025-04-15</td>
                      <td className="p-2">ISO 27001</td>
                      <td className="p-2">78%</td>
                      <td className="p-2">Internal Team</td>
                      <td className="p-2">
                        <Button size="sm" variant="outline" onClick={handleDownloadReport}>Download</Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">2025-03-10</td>
                      <td className="p-2">PCI DSS</td>
                      <td className="p-2">92%</td>
                      <td className="p-2">External Auditor</td>
                      <td className="p-2">
                        <Button size="sm" variant="outline">Download</Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2">2025-02-22</td>
                      <td className="p-2">GDPR</td>
                      <td className="p-2">65%</td>
                      <td className="p-2">Legal Department</td>
                      <td className="p-2">
                        <Button size="sm" variant="outline">Download</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default ComplianceModule;

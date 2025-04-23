
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComplianceAudit, ComplianceStandard, ComplianceControl } from '@/types';
import { generateComplianceReport } from '@/lib/pdf-utils';

const ComplianceModule: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(null);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [loading, setLoading] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [auditResults, setAuditResults] = useState<ComplianceAudit | null>(null);

  // Mock data for controls based on the selected standard
  const loadControls = (standard: ComplianceStandard) => {
    setSelectedStandard(standard);
    
    // Generate mock controls based on the standard
    const mockControls: ComplianceControl[] = [];
    const controlCount = standard === 'GDPR' ? 10 : 15;
    
    for (let i = 1; i <= controlCount; i++) {
      mockControls.push({
        id: `control-${i}`,
        section: `${standard} ${Math.ceil(i / 3)}.${i % 3 || 3}`,
        control: `${standard} Control ${i}`,
        description: `This is a description for ${standard} control #${i}`,
        status: 'N/A',
      });
    }
    
    setControls(mockControls);
  };

  const updateControlStatus = (id: string, status: 'Yes' | 'No' | 'Partial' | 'N/A') => {
    setControls(prevControls => 
      prevControls.map(control => 
        control.id === id ? { ...control, status } : control
      )
    );
  };

  const updateControlComment = (id: string, comments: string) => {
    setControls(prevControls => 
      prevControls.map(control => 
        control.id === id ? { ...control, comments } : control
      )
    );
  };

  const completeAudit = async () => {
    if (!selectedStandard) return;
    
    setLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Count how many controls have each status
    const compliantCount = controls.filter(c => c.status === 'Yes').length;
    const partialCount = controls.filter(c => c.status === 'Partial').length;
    const nonCompliantCount = controls.filter(c => c.status === 'No').length;
    const naCount = controls.filter(c => c.status === 'N/A').length;
    
    // Calculate overall score (only for controls that are not N/A)
    const applicableCount = controls.length - naCount;
    const overallScore = Math.round(
      ((compliantCount + (partialCount * 0.5)) / (applicableCount || 1)) * 100
    );
    
    // Generate the audit results with the required id field
    const results: ComplianceAudit = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      standard: selectedStandard,
      controls,
      summary: {
        compliantCount,
        partialCount,
        nonCompliantCount,
        naCount,
        overallScore
      }
    };
    
    setAuditResults(results);
    setAuditComplete(true);
    
    setLoading(false);
  };

  const downloadReport = () => {
    if (!auditResults) return;
    
    const doc = generateComplianceReport(auditResults);
    doc.save(`${auditResults.standard}_Compliance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const resetAudit = () => {
    setSelectedStandard(null);
    setControls([]);
    setAuditComplete(false);
    setAuditResults(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Audit Module</h1>
          <p className="text-gray-600 mb-6">
            Conduct GDPR or ISO 27001 compliance audits and generate detailed reports with improvement recommendations.
          </p>
        </div>
        
        {!selectedStandard ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Select Compliance Standard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                className="h-auto py-6 flex flex-col items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800"
                onClick={() => loadControls('GDPR')}
              >
                <span className="text-xl">GDPR</span>
                <span className="text-sm font-normal">General Data Protection Regulation</span>
              </Button>
              
              <Button
                className="h-auto py-6 flex flex-col items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800"
                onClick={() => loadControls('ISO27001')}
              >
                <span className="text-xl">ISO 27001</span>
                <span className="text-sm font-normal">Information Security Management</span>
              </Button>
            </div>
          </Card>
        ) : auditComplete ? (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {selectedStandard} Compliance Audit Complete
                </h2>
                <p className="text-gray-600 mb-6">
                  Your compliance score is {auditResults?.summary.overallScore}%.
                </p>
                <div className="flex justify-center gap-3 mb-8">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={downloadReport}
                  >
                    Download Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetAudit}
                  >
                    Start New Audit
                  </Button>
                </div>
              </div>
              
              {/* Audit Summary */}
              <div>
                <h3 className="text-lg font-medium mb-4">Compliance Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-green-800">
                      {auditResults?.summary.compliantCount || 0}
                    </div>
                    <div className="text-sm font-medium text-green-600">Compliant</div>
                  </div>
                  
                  <div className="bg-yellow-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-yellow-800">
                      {auditResults?.summary.partialCount || 0}
                    </div>
                    <div className="text-sm font-medium text-yellow-600">Partial</div>
                  </div>
                  
                  <div className="bg-red-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-red-800">
                      {auditResults?.summary.nonCompliantCount || 0}
                    </div>
                    <div className="text-sm font-medium text-red-600">Non-Compliant</div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {auditResults?.summary.naCount || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-600">N/A</div>
                  </div>
                </div>
              </div>
              
              {/* Control Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Control Details</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditResults?.controls.map((control, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{control.section}</td>
                          <td className="px-4 py-3 text-sm">{control.control}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              control.status === 'Yes' ? 'bg-green-100 text-green-800' :
                              control.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                              control.status === 'No' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {control.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Remediation Recommendations */}
              <div>
                <h3 className="text-lg font-medium mb-4">Remediation Recommendations</h3>
                <div className="space-y-3">
                  {(auditResults?.controls.filter(c => c.status === 'No' || c.status === 'Partial') || []).length === 0 ? (
                    <div className="bg-green-50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="text-green-800">
                            All controls are compliant. No remediation needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    auditResults?.controls.filter(c => c.status === 'No' || c.status === 'Partial').map((control, index) => (
                      <div key={index} className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{control.section}: {control.control}</h4>
                            <p className="text-sm text-gray-600 mt-1">{control.description}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium h-fit ${
                            control.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {control.status}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h5 className="text-sm font-medium text-gray-700">Recommendation:</h5>
                          <p className="text-sm mt-1">
                            Implement measures to address {control.control.toLowerCase()} requirements.
                            {control.comments && ` Note: ${control.comments}`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedStandard} Compliance Assessment
              </h2>
              <Button 
                variant="outline" 
                onClick={resetAudit}
              >
                Change Standard
              </Button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Assess your compliance with each control. Use the comments field to add evidence or notes.
            </p>
            
            <div className="space-y-6">
              {controls.map((control, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3">
                    <h3 className="font-medium">{control.section}: {control.control}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">{control.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compliance Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(['Yes', 'Partial', 'No', 'N/A'] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              className={`px-3 py-1 rounded-md text-sm ${
                                control.status === status
                                  ? status === 'Yes'
                                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                    : status === 'Partial'
                                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                                    : status === 'No'
                                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                    : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => updateControlStatus(control.id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comments/Evidence
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows={2}
                          placeholder="Add comments or evidence..."
                          value={control.comments || ''}
                          onChange={(e) => updateControlComment(control.id, e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={completeAudit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Processing...
                  </>
                ) : (
                  "Complete Audit & Generate Report"
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ComplianceModule;

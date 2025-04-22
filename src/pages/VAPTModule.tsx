
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { ConfigurationForm } from "@/components/vapt/ConfigurationForm";
import { ScanProgress } from "@/components/vapt/ScanProgress";
import { ScanResults } from "@/components/vapt/ScanResults";
import { useVAPTScan } from "@/hooks/useVAPTScan";
import { VAPTFormValues } from "@/types/vapt";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VAPTModule = () => {
  const {
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
  } = useVAPTScan();

  const [formValues, setFormValues] = useState<VAPTFormValues>({
    targetSystem: "",
    scopeDetails: "",
    testingMethod: "black-box" // Keep this for data structure compatibility
  });

  const handleFormChange = (values: Partial<VAPTFormValues>) => {
    setFormValues((prev) => ({ ...prev, ...values }));
  };

  // Determine whether to show the results component
  const shouldShowResults = Boolean(scanComplete && showResults && scanResults);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">VAPT Module</h1>
          <p className="text-gray-600 mb-6">
            Vulnerability Assessment and Penetration Testing workflow with 9 stages
            from reconnaissance to remediation verification.
          </p>
        </div>

        {!scanComplete && !scanError && isAutomating && stages && stages.length > 0 && (
          <ScanProgress
            stages={stages}
            activeStage={activeStage}
            progress={progress}
          />
        )}

        <Card className="p-6">
          {!scanComplete && !isAutomating && !scanError && activeStage === 1 && (
            <ConfigurationForm
              values={formValues}
              onValuesChange={handleFormChange}
              onStartScan={() => startAutomatedScan(formValues)}
              loading={loading}
            />
          )}

          {!scanComplete && isAutomating && !scanError && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">
                Automated Scan in Progress
              </h2>
              <p className="text-gray-600">
                Currently processing:{" "}
                <span className="font-medium">
                  {stages && activeStage > 0 && activeStage <= stages.length 
                    ? stages[activeStage - 1]?.name || "Completing scan"
                    : "Initializing scan"}
                </span>
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Stage {activeStage} of {stages ? stages.length : 9} complete ({progress}%)
              </p>
            </div>
          )}

          {scanError && (
            <div className="text-center py-10">
              <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600">
                Scan Failed
              </h2>
              <p className="text-gray-700 mb-4">{scanError}</p>
              <Button variant="outline" onClick={resetScan}>
                Start New Scan
              </Button>
            </div>
          )}

          {shouldShowResults && scanResults && (
            <ScanResults
              scanResults={scanResults}
              vulnerabilities={vulnerabilities || []}
              stages={stages || []}
              testingMethod={formValues.testingMethod}
              onDownloadReport={downloadReport}
              onResetScan={resetScan}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default VAPTModule;

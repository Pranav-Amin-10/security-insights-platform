
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { VAPTFormValues } from "../types";

interface ConfigurationFormProps {
  values: VAPTFormValues;
  onValuesChange: (values: Partial<VAPTFormValues>) => void;
  onStartScan: () => void;
  loading: boolean;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  values,
  onValuesChange,
  onStartScan,
  loading
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Target Configuration</h2>
      <p className="text-gray-600 mb-6">
        Enter target details to begin the automated VAPT process.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target System/Domain/IP <span className="text-red-500">*</span>
        </label>
        <Input
          value={values.targetSystem}
          onChange={(e) => onValuesChange({ targetSystem: e.target.value })}
          placeholder="e.g., example.com or 192.168.1.1"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scope Details
        </label>
        <Textarea
          value={values.scopeDetails}
          onChange={(e) => onValuesChange({ scopeDetails: e.target.value })}
          placeholder="Define the scope of the penetration test..."
          className="w-full h-32"
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onStartScan}
          disabled={!values.targetSystem || loading}
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
  );
};

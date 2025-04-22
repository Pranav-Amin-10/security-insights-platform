
import React from "react";
import { Progress } from "@/components/ui/progress";
import { VAPTStage } from "@/types";

interface ScanProgressProps {
  stages: VAPTStage[];
  activeStage: number;
  progress: number;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  stages,
  activeStage,
  progress
}) => {
  return (
    <div>
      <Progress value={progress} className="h-2 mb-4" />
      <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`p-2 rounded-md text-xs text-center transition-colors ${
              stage.id === activeStage
                ? "bg-blue-600 text-white"
                : stage.completed
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {stage.name}
            {stage.id === activeStage && (
              <span className="ml-1 inline-block animate-pulse">...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

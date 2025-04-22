
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
  // Ensure we have valid stages and activeStage before rendering
  if (!stages || stages.length === 0) {
    return null;
  }

  // Ensure valid progress value
  const safeProgress = isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  
  // Ensure active stage is within bounds
  const safeActiveStage = Math.min(
    Math.max(1, activeStage), 
    stages.length
  );

  return (
    <div>
      <Progress value={safeProgress} className="h-2 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`p-2 rounded-md text-xs md:text-sm text-center transition-colors ${
              stage.id === safeActiveStage
                ? "bg-blue-600 text-white"
                : stage.completed
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {stage.name || `Stage ${stage.id}`}
            {stage.id === safeActiveStage && (
              <span className="ml-1 inline-block animate-pulse">...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

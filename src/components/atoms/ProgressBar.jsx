import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = ({ progress = 0, className, showPercentage = true, animated = false }) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-slate-700">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 ease-out",
            animated && "progress-shimmer"
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
      <p className="text-slate-600 mb-6 max-w-md">
        {message || "We encountered an error while loading your files. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={20} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
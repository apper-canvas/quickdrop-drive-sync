import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ onUploadClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="CloudUpload" size={48} className="text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">No files uploaded yet</h3>
      <p className="text-slate-600 mb-8 max-w-md">
        Start by uploading your first file. Drag and drop files above or click the upload button to get started.
      </p>
      {onUploadClick && (
        <button
          onClick={onUploadClick}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="Upload" size={20} />
          Upload Files
        </button>
      )}
    </div>
  );
};

export default Empty;
import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const UploadZone = ({ onFileSelect, isUploading = false, className }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect(files);
    }
    // Reset input value so same file can be selected again
    e.target.value = "";
  };

  const handleClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "upload-zone cursor-pointer",
        isDragOver && "upload-zone dragover",
        isUploading && "pointer-events-none opacity-75",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center">
        <div className={cn(
          "w-20 h-20 mb-6 rounded-full flex items-center justify-center transition-all duration-200",
          isDragOver 
            ? "bg-primary-100 scale-110" 
            : "bg-gradient-to-br from-primary-100 to-accent-100"
        )}>
          <ApperIcon 
            name={isUploading ? "Loader2" : "CloudUpload"} 
            size={40} 
            className={cn(
              "text-primary-600",
              isUploading && "animate-spin"
            )}
          />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">
          {isUploading ? "Uploading..." : isDragOver ? "Drop files here" : "Upload your files"}
        </h3>

        <p className="text-slate-600 mb-6 max-w-md">
          {isUploading 
            ? "Please wait while your files are being uploaded"
            : "Drag and drop your files here, or click to browse and select files from your device"
          }
        </p>

        {!isUploading && (
          <Button variant="primary" size="lg">
            <ApperIcon name="Upload" size={20} />
            Choose Files
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
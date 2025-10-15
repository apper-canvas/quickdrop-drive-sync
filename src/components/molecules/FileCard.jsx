import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import FileIcon from "@/components/atoms/FileIcon";
import ProgressBar from "@/components/atoms/ProgressBar";
import Button from "@/components/atoms/Button";
import { formatDistanceToNow } from "date-fns";

const FileCard = ({ file, onDelete, onPreview }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "uploading":
        return "text-primary-600";
      case "error":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle";
      case "uploading":
        return "Loader2";
      case "error":
        return "XCircle";
      default:
        return "File";
    }
  };

const isImage = file.type_c?.startsWith("image/");
  const isUploading = file.upload_status_c === "uploading";
  const isCompleted = file.upload_status_c === "completed";
  return (
    <div className={cn(
      "card p-6 relative",
      isCompleted && "animate-bounce-in"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
{isImage && file.thumbnail_url_c ? (
            <div 
              className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => onPreview && onPreview(file)}
            >
              <img 
                src={file.thumbnail_url_c} 
                alt={file.name_c}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
<div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileIcon fileType={file.type_c} size={24} className="text-slate-600" />
            </div>
          )}

          <div className="min-w-0 flex-1">
<h4 className="font-semibold text-slate-900 truncate mb-1">{file.name_c}</h4>
            <div className="flex items-center gap-4 text-sm text-slate-600">
<span>{formatFileSize(file.size_c)}</span>
              <span>{formatDistanceToNow(new Date(file.timestamp_c || file.CreatedOn), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
<div className={cn("flex items-center gap-1", getStatusColor(file.upload_status_c))}>
            <ApperIcon
              name={getStatusIcon(file.uploadStatus)} 
              size={16} 
              className={cn(isUploading && "animate-spin")}
            />
          </div>
          
          {isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(file)}
              className="text-slate-400 hover:text-red-600 p-2"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          )}
        </div>
      </div>

{isUploading && (
        <ProgressBar 
          progress={file.upload_progress_c} 
          animated={true}
          className="mb-2"
        />
      )}
    </div>
  );
};

export default FileCard;
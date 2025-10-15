import React from "react";
import ApperIcon from "@/components/ApperIcon";

const FileIcon = ({ fileType, size = 24, className }) => {
  const getIconName = (type) => {
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Music";
    if (type.includes("pdf")) return "FileText";
    if (type.includes("word") || type.includes("doc")) return "FileText";
    if (type.includes("excel") || type.includes("sheet")) return "FileSpreadsheet";
    if (type.includes("powerpoint") || type.includes("presentation")) return "Presentation";
    if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "Archive";
    if (type.includes("json") || type.includes("xml") || type.includes("html")) return "Code";
    return "File";
  };

  return (
    <ApperIcon 
      name={getIconName(fileType)} 
      size={size} 
      className={className}
    />
  );
};

export default FileIcon;
import React, { useState } from "react";
import { toast } from "react-toastify";
import UploadZone from "@/components/molecules/UploadZone";
import FileCard from "@/components/molecules/FileCard";
import ImagePreviewModal from "@/components/molecules/ImagePreviewModal";
import DeleteConfirmModal from "@/components/molecules/DeleteConfirmModal";
import { fileService } from "@/services/api/fileService";

const FileUploader = ({ files, setFiles, loading }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const validateFile = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf", "text/plain", "application/json",
      "video/mp4", "video/webm", "audio/mp3", "audio/wav",
      "application/zip", "application/x-rar-compressed"
    ];

    if (file.size > maxSize) {
      return "File size must be less than 50MB";
    }

    if (!allowedTypes.includes(file.type) && !file.type.startsWith("image/")) {
      return "File type not supported";
    }

    return null;
  };

  const handleFileSelect = async (selectedFiles) => {
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length === 0) return;

    // Start uploading valid files
    const uploadPromises = validFiles.map(async (file) => {
      try {
        const uploadedFile = await fileService.uploadFile(file, (updatedFile) => {
          setUploadingFiles(current => 
            current.map(f => f.Id === updatedFile.Id ? updatedFile : f)
          );
        });

        // Remove from uploading and add to main files list
        setUploadingFiles(current => current.filter(f => f.Id !== uploadedFile.Id));
        setFiles(current => [...current, uploadedFile]);
        
        toast.success(`${uploadedFile.name} uploaded successfully!`);
        return uploadedFile;
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        setUploadingFiles(current => current.filter(f => f.name !== file.name));
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleDelete = (file) => {
    setDeleteFile(file);
  };

  const confirmDelete = async () => {
    if (!deleteFile) return;

    setIsDeleting(true);
    try {
      await fileService.delete(deleteFile.Id);
      setFiles(current => current.filter(f => f.Id !== deleteFile.Id));
      toast.success(`${deleteFile.name} deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      setDeleteFile(null);
    }
  };

  const handlePreview = (file) => {
    if (file.type.startsWith("image/")) {
      setPreviewFile(file);
    }
  };

  const allFiles = [...uploadingFiles, ...files];
  const hasUploading = uploadingFiles.length > 0;

  return (
    <>
      <div className="space-y-8">
        <UploadZone
          onFileSelect={handleFileSelect}
          isUploading={hasUploading}
          className="mb-12"
        />

        {allFiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {hasUploading ? "Uploading Files" : "Your Files"}
            </h2>
            <div className="grid gap-4">
              {allFiles.map((file) => (
                <FileCard
                  key={file.Id || file.name}
                  file={file}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ImagePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <DeleteConfirmModal
        file={deleteFile}
        isOpen={!!deleteFile}
        onClose={() => setDeleteFile(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default FileUploader;
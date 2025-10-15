import React, { useState, useEffect } from "react";
import FileUploader from "@/components/organisms/FileUploader";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { fileService } from "@/services/api/fileService";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fileService.getAll();
      setFiles(data);
    } catch (err) {
      setError(err.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFiles} />;

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Upload & Manage Your Files
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Drag and drop your files or click to browse. QuickDrop makes file uploading fast, secure, and effortless.
        </p>
      </div>

      <FileUploader files={files} setFiles={setFiles} loading={loading} />

      {files.length === 0 && (
        <Empty onUploadClick={() => document.querySelector("input[type='file']")?.click()} />
      )}
    </div>
  );
};

export default Home;
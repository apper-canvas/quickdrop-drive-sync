import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-8">
        <ApperIcon name="FileQuestion" size={48} className="text-slate-600" />
      </div>

      <h1 className="text-6xl font-bold text-slate-900 mb-4 font-display">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">Page Not Found</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        The page you're looking for doesn't exist. Let's get you back to uploading files.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => navigate("/")}>
          <ApperIcon name="Home" size={20} />
          Go Home
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ApperIcon name="ArrowLeft" size={20} />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
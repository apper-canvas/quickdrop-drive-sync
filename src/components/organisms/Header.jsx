import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="CloudUpload" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-display">QuickDrop</h1>
              <p className="text-sm text-slate-600">File Upload Utility</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ApperIcon name="Shield" size={16} className="text-primary-500" />
            <span>Secure & Fast</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
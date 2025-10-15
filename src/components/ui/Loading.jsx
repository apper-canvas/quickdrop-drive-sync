import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-slate-600 font-medium">Loading files...</p>
    </div>
  );
};

export default Loading;
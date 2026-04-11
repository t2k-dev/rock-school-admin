import React from "react";

interface LoadingProps {
  message?: string;
  className?: string;
  centered?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Загрузка...",
  className = "",
  centered = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${centered ? "py-20" : ""} ${className}`}
    >
      <div className="w-6 h-6 rounded-full bg-accent animate-pulse"></div>

      {message && (
        <span className="text-text-muted font-medium">{message}</span>
      )}
    </div>
  );
};

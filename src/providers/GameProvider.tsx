import React from "react";

// Simple provider component for React context
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

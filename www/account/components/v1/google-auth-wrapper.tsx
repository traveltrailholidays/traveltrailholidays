"use client";

import { ReactNode } from "react";
import { useGoogleAuth } from "@/hooks/use-google-auth.hook";

type GoogleAuthWrapperProps = {
  children: ReactNode;
};

const GoogleAuthWrapper = ({ children }: GoogleAuthWrapperProps) => {
  const handleGoogleAuth = useGoogleAuth();

  return (
    <div onClick={handleGoogleAuth}>{children}</div>
  );
};

export default GoogleAuthWrapper;
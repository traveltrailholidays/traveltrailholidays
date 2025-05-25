import VerifyEmail from "@/components/v1/signup/steps/verify-email";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Verify email'
};

const page = () => {
  return (
    <VerifyEmail />
  )
}

export default page;
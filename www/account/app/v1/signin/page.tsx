import type { Metadata } from "next";
import Signin from "@/components/v1/signin";

export const metadata: Metadata = {
  title: 'Sign in'
};

const page = () => {
  return <Signin />;
};

export default page;

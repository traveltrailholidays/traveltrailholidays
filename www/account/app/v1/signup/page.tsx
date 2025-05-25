import type { Metadata } from "next";
import Signup from "@/components/v1/signup";

export const metadata: Metadata = {
  title: 'Sign up'
};

const page = () => {
  return <Signup />;
};

export default page;

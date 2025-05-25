import type { Metadata } from "next";
import SigninPasswordStep from "@/components/v1/signin/steps/password"

export const metadata: Metadata = {
  title: 'Verify password'
};


const page = () => {
    return (
        <SigninPasswordStep />
    )
}

export default page
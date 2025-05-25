import API from "@/lib/axios";
import toast from "react-hot-toast";
import { encryptKey } from "@/lib/bcrypt";
import { useRouterPush } from '@/hooks/use-router-push.hook';
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";

export const useGoogleAuth = () => {
    const router = useRouterPush();
    return useGoogleLogin({
        onSuccess: async (authResult: CodeResponse) => {
            try {
                if (authResult.code) {
                    const response = await API.post("/auth/google", { code: authResult.code });

                    if (response.data.code !== 200) {
                        toast.error(response.data.message);
                        return;
                    }

                    const tokenKey = response.data.payload.token;
                    const hashedToken = await encryptKey(tokenKey);
                    localStorage.setItem('_tth-auth-token', hashedToken);
                    toast.success('Signed in successfully');
                    router.push('/');
                }
            } catch (error) {
                console.error("Error while requesting Google code", error);
                toast.error("Please try again.");
            }
        },
        onError: (error) => {
            console.error("Google sign-up error:", error);
            toast.error("Google login failed.");
        },
        flow: "auth-code",
    });
};

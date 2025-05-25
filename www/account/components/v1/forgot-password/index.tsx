'use client';

import MainTitle from "../main-title";
import AuthLayout from "../auth-layout";
import InputBox from "../input-box";
import UrlNavigation from "../url-navigation";
import { useRouterPush } from "@/hooks/use-router-push.hook";
import { useState } from "react";
import toast from "react-hot-toast";
import API from "@/lib/axios";
import { LoadingOverlay, LoadingSpinner } from "../loading";

const ForgotPassword = () => {
    const router = useRouterPush();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleEmailCheck = async () => {
        if (!email) {
            setError(true);
            toast.error('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const response = await API.post('/auth/check-email-exists', { email });
            if (response.data.code !== 200) {
                toast.error(response.data.message);
                return;
            };
            const sendMailResposne = await API.post('/auth/generate-forgot-password-otp', { email });
            if (sendMailResposne.data.code !== 200) {
                toast.error(response.data.message);
                return;
            };
            localStorage.setItem('_tthAuthForgotPasswordEmail', email);
            router.push('/v1/forgot-password/verify-email')
        } catch (error) {
            toast.error('Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            {isLoading && <LoadingOverlay />}
            <MainTitle heading="Forgot password" subHeading="Securely recover your password in a few steps" />
            <form onSubmit={(e) => { e.preventDefault(); handleEmailCheck(); }}>
                <InputBox
                    label='Email id'
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    error={error}
                />
                <div className='pt-12 flex justify-end gap-5 items-center'>
                    <UrlNavigation
                        href='/v1/signin/steps/password'
                        className='bg-border hover:bg-border/90 px-5 py-2 rounded-xs cursor-pointer font-medium text-theme-text'
                    >
                        Back
                    </UrlNavigation>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className='bg-gradient-to-r from-indigo-500 hover:from-indigo-500/90 via-purple-500 hover:via-purple-500/90 to-pink-500 hover:to-pink-500/90 px-5 py-2 rounded-xs cursor-pointer font-medium text-white flex items-center justify-center gap-2'
                    >
                        {isLoading && <LoadingSpinner />}
                        {isLoading ? 'Checking...' : 'Next'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}

export default ForgotPassword;
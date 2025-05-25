'use client';

import { useRouterPush } from "@/hooks/use-router-push.hook";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import API from "@/lib/axios";
import AuthLayout from "../../auth-layout";
import MainTitle from "../../main-title";
import InputBox from "../../input-box";
import UrlNavigation from "../../url-navigation";

interface OTPInputProps {
    label?: string
    onChange?: (value: string) => void
    maxLength?: number
    className?: string
}

const VerifyEmailForgotPassword: React.FC<OTPInputProps> = ({ label = "Enter OTP", onChange, maxLength = 6, className }) => {
    const router = useRouterPush();
    const [value, setValue] = useState("")
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(15);

    const hasHandledSession = useRef(false);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (hasHandledSession.current) return;
        const savedEmail = localStorage.getItem('_tthAuthSiginEmail');
        if (!savedEmail) {
            hasHandledSession.current = true;
            toast.error('Session expired.');
            router.push('/v1/signup');
            return;
        }
        setEmail(savedEmail);
    }, [router]);

    useEffect(() => {
        if (countdown > 0) {
            countdownIntervalRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        if (countdownIntervalRef.current) {
                            clearInterval(countdownIntervalRef.current);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [countdown]);

    const handleBack = () => {
        localStorage.removeItem('_tthAuthForgotPasswordEmail')
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, "")
        const limitedValue = newValue.slice(0, maxLength)
        setValue(limitedValue)
        if (onChange) {
            onChange(limitedValue)
        }
    }

    const handleResendOTP = async () => {
        if (countdown > 0 || isResending) return;

        setIsResending(true);
        try {
            const response = await API.post('/auth/generate-signup-otp', { email });
            if (response.data.code !== 200) {
                toast.error(response.data.message);
                return;
            }
            toast.success('OTP sent successfully');
            setCountdown(15);
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again');
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!value) {
            setError(true)
            toast.error('OTP is required');
            return;
        }
        setIsLoading(true);
        try {
            const otp = value;
            const response = await API.post('/auth/verify-otp', { email, otp });
            if (response.data.code !== 200) {
                toast.error(response.data.message);
                return;
            };
            localStorage.setItem('_tthAuthSigupEmail', email)
            toast.success(response.data.message);
            router.push('/v1/forgot-password/set-password');
        } catch (error) {
            toast.error('Please try again');
        } finally {
            setIsLoading(false);
            localStorage.removeItem('_tthAuthSiginEmail');
            hasHandledSession.current = true;
        }
    };

    const isResendDisabled = countdown > 0 || isResending;

    return (
        <AuthLayout>
            <MainTitle heading="Verify email" subHeading={email} isPill />
            <form onSubmit={handleSubmit}>
                <InputBox
                    label={label}
                    value={value}
                    onChange={handleChange}
                    className={className}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={maxLength}
                    autoComplete="one-time-code"
                    error={error}
                />
                <div className='mt-3 flex items-center gap-2'>
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isResendDisabled}
                        className={`text-sm font-medium transition-colors ${isResendDisabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-indigo-400 hover:text-indigo-500 dark:text-indigo-200 hover:dark:text-indigo-300 cursor-pointer'
                            }`}
                    >
                        {isResending ? 'Sending...' : 'Resend OTP'}
                    </button>
                    {countdown > 0 && (
                        <span className="text-sm text-gray-500">
                            ({countdown}s)
                        </span>
                    )}
                </div>
                <div className='pt-12 flex justify-end gap-5 items-center'>
                    <UrlNavigation
                        href='/v1/forgot-password'
                        onClick={handleBack}
                        className='bg-border hover:bg-border/90 px-5 py-2 rounded-xs cursor-pointer font-medium text-theme-text'
                    >
                        Back
                    </UrlNavigation>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className='bg-gradient-to-r from-indigo-500 hover:from-indigo-500/90 via-purple-500 hover:via-purple-500/90 to-pink-500 hover:to-pink-500/90 px-5 py-2 rounded-xs cursor-pointer font-medium text-white'
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}

export default VerifyEmailForgotPassword;
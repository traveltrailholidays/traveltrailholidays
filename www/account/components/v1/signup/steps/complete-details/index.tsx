'use client';

import API from '@/lib/axios';
import AuthLayout from '@/components/v1/auth-layout'
import InputBox from '@/components/v1/input-box'
import MainTitle from '@/components/v1/main-title'
import UrlNavigation from '@/components/v1/url-navigation';
import { useRouterPush } from '@/hooks/use-router-push.hook';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { encryptKey } from '@/lib/bcrypt';

const SignupCompleteDetailsStep = () => {
    const router = useRouterPush();
    const [name, setName] = useState("")
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nameError, setNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const hasHandledSession = useRef(false);
    useEffect(() => {
        if (hasHandledSession.current) return;
        const savedEmail = localStorage.getItem('_tthAuthSigupEmail');
        if (!savedEmail) {
            hasHandledSession.current = true;
            toast.error('Session expired.');
            router.push('/v1/signup');
            return;
        }
        setEmail(savedEmail);
        hasHandledSession.current = true;
    }, [router]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (nameError) setNameError(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (passwordError) setPasswordError(false);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (confirmPasswordError) setConfirmPasswordError(false);
    };

    const handleBack = () => {
        localStorage.removeItem('_tthAuthSigupEmail');
        router.push('/v1/signup');
    };

    const validateForm = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError(true);
            toast.error('Full name is required');
            isValid = false;
        }

        if (!password) {
            setPasswordError(true);
            toast.error('Password is required');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError(true);
            toast.error('Password must be at least 8 characters');
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError(true);
            toast.error('Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            toast.error('Passwords do not match');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await API.post('/auth/signup', {
                email,
                name: name.trim(),
                password
            });

            if (response.data.code !== 201) {
                toast.error(response.data.message);
                return;
            }

            const tokenKey = response.data.payload.token;
            console.log(tokenKey);
            const hashedToken = await encryptKey(tokenKey);
            localStorage.setItem('_tth-auth-token', hashedToken);
            localStorage.removeItem('_tthAuthSigupEmail');

            toast.success('Account created successfully!');
            router.push('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <MainTitle heading='Enter details' subHeading='Just a few more details to complete your signup' />
            <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
                <InputBox
                    label='Full name'
                    type='text'
                    value={name}
                    onChange={handleNameChange}
                    error={nameError}
                />
                <InputBox
                    label='Create password'
                    type='password'
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError}
                />
                <InputBox
                    label='Confirm password'
                    type='password'
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={confirmPasswordError}
                />
                <div className='pt-5 flex justify-end gap-5 items-center'>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className='bg-gradient-to-r from-indigo-500 hover:from-indigo-500/90 via-purple-500 hover:via-purple-500/90 to-pink-500 hover:to-pink-500/90 px-5 py-2 rounded-xs cursor-pointer font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading ? 'Creating...' : 'Signup'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}

export default SignupCompleteDetailsStep;
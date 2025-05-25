'use client';

import { useRouterPush } from "@/hooks/use-router-push.hook";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import API from "@/lib/axios";
import AuthLayout from "../../auth-layout";
import MainTitle from "../../main-title";
import InputBox from "../../input-box";
import UrlNavigation from "../../url-navigation";

const SetPassword = () => {
  const router = useRouterPush();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasHandledSession = useRef(false);
  useEffect(() => {
    if (hasHandledSession.current) return;
    const savedEmail = localStorage.getItem('_tthAuthForgotPasswordEmail');
    if (!savedEmail) {
      hasHandledSession.current = true;
      toast.error('Session expired.');
      router.push('/v1/forgot-password');
      return;
    }
    setEmail(savedEmail);
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(false);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) setConfirmPasswordError(false);
  };

  const validateForm = () => {
    let isValid = true;

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
      const response = await API.post('/auth/create-password', {
        email,
        password
      });

      if (response.data.code !== 200) {
        toast.error(response.data.message);
        return;
      }
      localStorage.removeItem('_tthAuthForgotPasswordEmail');
      toast.success(response.data.message);
      router.push('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <MainTitle heading="Set password" subHeading="Enter your new password to reset your account access" />
      <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
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

export default SetPassword;
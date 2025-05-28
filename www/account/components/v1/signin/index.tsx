'use client';

import API from '@/lib/axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import InputBox from '../input-box';
import MainTitle from '../main-title';
import AuthLayout from '../auth-layout';
import { FcGoogle } from "react-icons/fc"
import UrlNavigation from '../url-navigation';
import { useRouterPush } from '@/hooks/use-router-push.hook';
import GoogleAuthWrapper from '../google-auth-wrapper';
import { LoadingOverlay, LoadingSpinner } from '../loading';

const Signin = () => {
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
      localStorage.setItem('_tthAuthSiginEmail', email);
      router.push('/v1/signin/steps/password')
    } catch (error) {
      toast.error('Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {isLoading && <LoadingOverlay />}
      <MainTitle heading="Sign in" subHeading="Sign in to your Tourillo account" />
      <form onSubmit={(e) => { e.preventDefault(); handleEmailCheck(); }}>
        <InputBox
          label='Email id'
          type='email'
          value={email}
          onChange={handleEmailChange}
          error={error}
        />
        <div className="flex justify-center w-full items-center gap-3 text-border my-7">
          <div className="border-b w-full"></div>
          <div>OR</div>
          <div className="border-b w-full"></div>
        </div>
        <GoogleAuthWrapper>
          <div
            className="w-full border border-border flex items-center justify-center gap-3 px-3 py-[14px] text-lg transition-all duration-200 hover:bg-border/50 hover:border-border/50 cursor-pointer"
          >
            <FcGoogle className="text-2xl" />
            <span>Sign in with Google</span>
          </div>
        </GoogleAuthWrapper>
        <div className='pt-12 flex justify-between items-center'>
          <UrlNavigation href={'/v1/signup'} className='text-indigo-400 hover:text-indigo-500 dark:text-indigo-200 hover:dark:text-indigo-300 font-medium'>
            Create account
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
  );
};

export default Signin;

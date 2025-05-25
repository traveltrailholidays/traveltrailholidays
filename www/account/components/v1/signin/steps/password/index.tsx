'use client';

import API from '@/lib/axios';
import toast from 'react-hot-toast';
import InputBox from '@/components/v1/input-box';
import { useRouterPush } from '@/hooks/use-router-push.hook';
import MainTitle from '@/components/v1/main-title';
import { useState, useEffect, useRef } from 'react';
import AuthLayout from '@/components/v1/auth-layout';
import UrlNavigation from '@/components/v1/url-navigation';
import { encryptKey } from '@/lib/bcrypt';

const SigninPasswordStep = () => {
  const router = useRouterPush();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasHandledSession = useRef(false);
  useEffect(() => {
    if (hasHandledSession.current) return;
    const savedEmail = localStorage.getItem('_tthAuthSiginEmail');
    if (!savedEmail) {
      hasHandledSession.current = true;
      toast.error('Session expired.');
      router.push('/v1/signin');
      return;
    }
    setEmail(savedEmail);
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleBack = () => {
    localStorage.removeItem('_tthAuthSiginEmail')
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError(true);
      toast.error('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post('/auth/signin', { email, password });
      if (response.data.code !== 200) {
        toast.error(response.data.message);
        return;
      };
      const tokenKey = response.data.payload.token;
      const hashedToken = await encryptKey(tokenKey);
      localStorage.setItem('_tth-auth-token', hashedToken);
      toast.success('Signed in successfully');
      router.push('/');
    } catch (error) {
      toast.error('Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
      localStorage.removeItem('_tthAuthSiginEmail');
      hasHandledSession.current = true;
    }
  };

  return (
    <AuthLayout>
      <MainTitle heading='Enter password' subHeading={email} isPill />
      <form onSubmit={handleSubmit}>
        <InputBox
          label='Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          error={error}
        />
        <div className='mt-3'>
          <UrlNavigation href={'/v1/forgot-password'} className='text-indigo-400 hover:text-indigo-500 dark:text-indigo-200 hover:dark:text-indigo-300 text-sm mt-10'>
            Forgot password?
          </UrlNavigation>
        </div>
        <div className='pt-12 flex justify-end gap-5 items-center'>
          <UrlNavigation
            href='/v1/signin'
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default SigninPasswordStep;
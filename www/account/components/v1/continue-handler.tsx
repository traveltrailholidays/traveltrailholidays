'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";

import API from '@/lib/axios';
import { decryptKey } from '@/lib/bcrypt';
import { useContinueStore } from '@/store/continue-url.store';

const ContinueHandler = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { continueUrl, setContinueUrl } = useContinueStore();

    const authenticateToken = async (token: string): Promise<boolean> => {
        try {
            if (!token) return false;

            const decryptedToken = await decryptKey(token);
            const decoded = jwtDecode<{ sub: string }>(decryptedToken);
            const userId = decoded?.sub;

            if (!userId) throw new Error('Invalid token');

            const response = await API.post('/auth/authenticate-token', { userId });

            if (response.data.code !== 200) {
                localStorage.removeItem('_tth-auth-token');
                toast.error(response.data.message || 'Authentication failed');
                return false;
            }

            return true;
        } catch (error) {
            localStorage.removeItem('_tth-auth-token');
            toast.error('Invalid authentication token');
            return false;
        }
    };

    useEffect(() => {
        const handleAuthAndRedirect = async () => {
            const token = localStorage.getItem('_tth-auth-token');
            const continueParam = searchParams.get('continue');

            // Update continueUrl from query param if available
            if (continueParam) {
                setContinueUrl(continueParam);
            }

            const finalContinueUrl = continueParam || continueUrl;

            if (token) {
                const isValid = await authenticateToken(token);

                if (!isValid) return;

                // Redirect to continue URL with token
                if (finalContinueUrl) {
                    const isFullUrl = /^https?:\/\//i.test(finalContinueUrl);
                    const destination = isFullUrl
                        ? finalContinueUrl
                        : `https://${finalContinueUrl}`;

                    const urlWithToken = new URL(destination);
                    urlWithToken.searchParams.set('token', token);

                    setContinueUrl(null); // Clear store
                    router.push(urlWithToken.toString());
                    return;
                }

                // Redirect to home if on auth-related routes
                const isAuthRoute = ['/signin', '/signup', '/v1/forgot-password'].some(route =>
                    pathname.includes(route)
                );

                if (isAuthRoute) {
                    router.push('/');
                }
            }
        };

        handleAuthAndRedirect();
    }, [searchParams, continueUrl, pathname, router, setContinueUrl]);

    return null;
};

export default ContinueHandler;

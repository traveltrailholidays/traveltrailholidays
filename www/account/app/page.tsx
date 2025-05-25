'use client';

import { useEffect } from "react";
import { useRouterPush } from '@/hooks/use-router-push.hook';

const page = () => {
  const router = useRouterPush();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('_tth-auth-token');
    if (!isAuthenticated) {
      router.push('/v1/signin');
    }
  });
  return (
    <div>page</div>
  )
}

export default page
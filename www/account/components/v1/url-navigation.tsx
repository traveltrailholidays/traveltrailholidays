'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useContinueStore } from '@/store/continue-url.store';

interface UrlNavigationProps extends LinkProps {
    className?: string;
    children: React.ReactNode;
}

const UrlNavigation: React.FC<UrlNavigationProps> = ({ href, className, children, ...rest }) => {
    const continueUrl = useContinueStore((state) => state.continueUrl);

    // Append the continue query parameter to the href
    const hrefWithQuery = continueUrl ? `${href}?continue=${continueUrl}` : href;

    return (
        <Link href={hrefWithQuery} className={className} {...rest}>
            {children}
        </Link>
    );
};

export default UrlNavigation;

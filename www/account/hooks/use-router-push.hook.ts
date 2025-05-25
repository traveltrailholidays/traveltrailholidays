import { useRouter } from 'nextjs-toploader/app';
import { useContinueStore } from "@/store/continue-url.store";

export const useRouterPush = () => {
    const router = useRouter();
    const continueUrl = useContinueStore((state) => state.continueUrl);

    const getContinueUrl = () => {
        if (continueUrl) {
            return continueUrl;
        }else {
            return null;
        }
    };

    const addContinueUrl = (href: string) => {
        return continueUrl ? `${href}?continue=${continueUrl}` : href;
    };

    const push = (href: string, options?: any) => {
        const hrefWithQuery = addContinueUrl(href);
        router.push(hrefWithQuery, options);
    };

    const replace = (href: string, options?: any) => {
        const hrefWithQuery = addContinueUrl(href);
        router.replace(hrefWithQuery, options);
    };

    const prefetch = (href: string, options?: any) => {
        const hrefWithQuery = addContinueUrl(href);
        router.prefetch(hrefWithQuery, options);
    };

    return {
        push,
        replace,
        prefetch,
        back: router.back,
        forward: router.forward,
        refresh: router.refresh,
        router,
        getContinueUrl
    };
};
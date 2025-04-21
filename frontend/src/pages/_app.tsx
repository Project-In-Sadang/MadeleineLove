import '@/styles/globals.css';
import '@/styles/swiper.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token && pathname !== '/' && pathname !== '/allHeart') {
            window.location.href = '/';
        } else if (token && pathname === '/') {
            window.location.href = '/main';
        }
    }, [pathname]);

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main>
                <Component {...pageProps} />
            </main>
        </QueryClientProvider>
    );
}

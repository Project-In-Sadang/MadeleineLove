import '@/styles/globals.css';
import '@/styles/swiper.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();

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

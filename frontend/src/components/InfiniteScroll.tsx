import SsulBox from '@/components/SsulBox';
import FlexBox from '@/components/FlexBox';
import { useGetAllBlack, useGetAllWhite } from '@/apis/allHeart/queries';
import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
    type: 'white' | 'black';
    sort: string;
}

export default function InfiniteScroll({ type, sort }: InfiniteScrollProps) {
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
        type === 'white' ? useGetAllWhite(sort) : useGetAllBlack(sort);

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <FlexBox direction="col" className="gap-3 w-full">
            {data?.pages.map((page) =>
                page.data.map((item) => <SsulBox key={item.postId} type={type} data={item} apiType={'all'} />)
            )}
            <div ref={observerRef} className="h-10" />
            {isFetchingNextPage && <div>Loading more...</div>}
            {!hasNextPage && <div>No more data</div>}
        </FlexBox>
    );
}

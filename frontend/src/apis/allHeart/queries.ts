import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    postWhiteLike,
    deleteWhiteLike,
    postBlackLike,
    deleteBlackLike,
    getAllWhite,
    getBestWhite,
    getAllBlack,
    getBestBlack,
} from '@/apis/allHeart/requests';

function usePostWhiteLike(id: string, type: 'my' | 'all' | 'best') {
    const queryClient = useQueryClient();

    const { mutate: whiteLike } = useMutation({
        mutationKey: ['postWhiteLike', id],
        mutationFn: () => postWhiteLike(id),
        onSuccess: () => {
            if (type === 'my') {
                queryClient.invalidateQueries({ queryKey: ['getMyWhite'] });
            } else if (type === 'all') {
                queryClient.invalidateQueries({ queryKey: ['getAllWhite'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['getBestWhite'] });
            }
        },
    });

    return { whiteLike };
}

function useDeleteWhiteLike(id: string, type: 'my' | 'all' | 'best') {
    const queryClient = useQueryClient();

    const { mutate: whiteUnLike } = useMutation({
        mutationKey: ['deleteWhiteLike', id],
        mutationFn: () => deleteWhiteLike(id),
        onSuccess: () => {
            if (type === 'my') {
                queryClient.invalidateQueries({ queryKey: ['getMyWhite'] });
            } else if (type === 'all') {
                queryClient.invalidateQueries({ queryKey: ['getAllWhite'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['getBestWhite'] });
            }
        },
    });

    return { whiteUnLike };
}

function usePostBlackLike(id: string, type: 'my' | 'all' | 'best') {
    const queryClient = useQueryClient();

    const { mutate: blackLike } = useMutation({
        mutationKey: ['postBlackLike', id],
        mutationFn: () => postBlackLike(id),
        onSuccess: () => {
            if (type === 'my') {
                queryClient.invalidateQueries({ queryKey: ['getMyBlack'] });
            } else if (type === 'all') {
                queryClient.invalidateQueries({ queryKey: ['getAllBlack'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['getBestBlack'] });
            }
        },
    });

    return { blackLike };
}

function useDeleteBlackLike(id: string, type: 'my' | 'all' | 'best') {
    const queryClient = useQueryClient();

    const { mutate: blackUnLike } = useMutation({
        mutationKey: ['deleteBlackLike', id],
        mutationFn: () => deleteBlackLike(id),
        onSuccess: () => {
            if (type === 'my') {
                queryClient.invalidateQueries({ queryKey: ['getMyBlack'] });
            } else if (type === 'all') {
                queryClient.invalidateQueries({ queryKey: ['getAllBlack'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['getBestBlack'] });
            }
        },
    });

    return { blackUnLike };
}

function useGetBestWhite() {
    const { data: bestWhite } = useQuery({
        queryKey: ['getBestWhite'],
        queryFn: () => getBestWhite(),
    });
    return { bestWhite };
}

function useGetBestBlack() {
    const { data: bestBlack } = useQuery({
        queryKey: ['getBestBlack'],
        queryFn: () => getBestBlack(),
    });
    return { bestBlack };
}

function useGetAllBlack(sort: string) {
    const fetchAllBlack = ({ pageParam = '' }) => getAllBlack(sort, pageParam);

    return useInfiniteQuery({
        queryKey: ['getAllBlack', sort],
        queryFn: fetchAllBlack,
        initialPageParam: '',
        getNextPageParam: (lastPage) => {
            return lastPage.data.length === 0 ? undefined : lastPage.nextCursor;
        },
    });
}

function useGetAllWhite(sort: string) {
    const fetchAllWhite = ({ pageParam = '' }) => getAllWhite(sort, pageParam);

    return useInfiniteQuery({
        queryKey: ['getAllWhite', sort],
        queryFn: fetchAllWhite,
        initialPageParam: '',
        getNextPageParam: (lastPage) => {
            return lastPage.data.length === 0 ? undefined : lastPage.nextCursor;
        },
    });
}

export {
    usePostWhiteLike,
    useDeleteWhiteLike,
    useGetAllWhite,
    useGetBestWhite,
    usePostBlackLike,
    useDeleteBlackLike,
    useGetAllBlack,
    useGetBestBlack,
};

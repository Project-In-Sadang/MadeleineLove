import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyWhite, deleteMyWhite, getMyBlack, deleteMyBlack } from '@/apis/myHeart/requests';

function useGetMyWhite() {
    const { data: myWhite } = useQuery({
        queryKey: ['getMyWhite'],
        queryFn: () => getMyWhite(),
    });
    return { myWhite };
}

function useGetMyBlack() {
    const { data: myBlack } = useQuery({
        queryKey: ['getMyBlack'],
        queryFn: () => getMyBlack(),
    });
    return { myBlack };
}

function useDeleteMyWhite(id: string) {
    const queryClient = useQueryClient();

    const { mutate: deleteWhite } = useMutation({
        mutationKey: ['deleteMyWhite', id],
        mutationFn: () => deleteMyWhite(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getMyWhite'] });
        },
    });

    return { deleteWhite };
}

function useDeleteMyBlack(id: string) {
    const queryClient = useQueryClient();

    const { mutate: deleteBlack } = useMutation({
        mutationKey: ['deleteMyBlack', id],
        mutationFn: () => deleteMyBlack(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getMyBlack'] });
        },
    });

    return { deleteBlack };
}

export { useGetMyWhite, useDeleteMyWhite, useGetMyBlack, useDeleteMyBlack };

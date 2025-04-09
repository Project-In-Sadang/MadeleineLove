interface HeartBody {
    postId: string;
    nickName: string;
    content: string;
    methodNumber: number;
    likeCount: number;
    likedByUser: boolean;
    createdAt?: string;
}

interface PostBody {
    nickName: string;
    content: string;
    methodNumber: number;
}

type ModalType = 'cancelWrite' | 'emptyContent' | 'emptyMethod' | 'confirmWrite';

export type { HeartBody, PostBody, ModalType };

interface HeartBody {
    postId: string;
    nickName: string;
    content: string;
    methodNumber: number;
    likeCount: number;
    likedByUser: boolean;
    createdAt?: string;
    hotScore?: number;
}

interface PostBody {
    nickName: string;
    content: string;
    methodNumber: number;
}

interface AllBody {
    data: HeartBody[];
    nextCursor: string;
}

type ModalType = 'cancelWrite' | 'emptyContent' | 'emptyMethod' | 'confirmWrite';

type SwitchType = 'latest' | 'recommended';

export type { HeartBody, PostBody, ModalType, SwitchType, AllBody };

import api from '../basic';
import { HeartBody } from '@/utils/type';
import { AllBody } from '@/utils/type';

async function postWhiteLike(id: string) {
    try {
        await api.post(`/like/${id}/white`);
    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error('로그인 필요 기능');
        } else {
            console.error('화이트 좋아요 오류', error);
        }
    }
}

async function postBlackLike(id: string) {
    try {
        await api.post(`/like/${id}/black`);
    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error('로그인 필요 기능');
        } else {
            console.error('블랙 좋아요 오류', error);
        }
    }
}

async function deleteBlackLike(id: string) {
    try {
        await api.delete(`/like/${id}/black`);
    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error('로그인 필요 기능');
        } else {
            console.error('블랙 좋아요 취소 오류', error);
        }
    }
}

async function deleteWhiteLike(id: string) {
    try {
        await api.delete(`/like/${id}/white`);
    } catch (error: any) {
        if (error.response.status === 401) {
            throw new Error('로그인 필요 기능');
        } else {
            console.error('화이트 좋아요 취소 오류', error);
        }
    }
}

async function getBestWhite(): Promise<HeartBody[]> {
    try {
        const { data } = await api.get(`/white/post/best`);
        return data.data;
    } catch (error) {
        console.error('베스트 블랙 가져오기 오류', error);
        return [];
    }
}

async function getBestBlack(): Promise<HeartBody[]> {
    try {
        const { data } = await api.get(`/black/post/best`);
        return data.data;
    } catch (error) {
        console.error('베스트 화이트 가져오기 오류', error);
        return [];
    }
}

async function getAllWhite(sort: string, cursor: string): Promise<AllBody> {
    try {
        const { data } = await api.get(`/white/post`, {
            params: {
                sort: sort,
                cursor: cursor,
            },
        });
        return data;
    } catch (error) {
        console.error('모든 화이트 가져오기 오류', error);
        return {} as AllBody;
    }
}

async function getAllBlack(sort: string, cursor: string): Promise<AllBody> {
    try {
        const { data } = await api.get(`/black/post`, {
            params: {
                sort: sort,
                cursor: cursor,
            },
        });
        return data;
    } catch (error) {
        console.error('모든 블랙 가져오기 오류', error);
        return {} as AllBody;
    }
}

export {
    postWhiteLike,
    deleteWhiteLike,
    getAllWhite,
    postBlackLike,
    deleteBlackLike,
    getBestWhite,
    getAllBlack,
    getBestBlack,
};

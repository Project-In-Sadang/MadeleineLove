import { HeartBody } from '@/utils/type';
import api from '../basic';

async function getMyWhite(): Promise<HeartBody[]> {
    try {
        const { data } = await api.get(`/myheart/white`);
        return data.payload;
    } catch (error) {
        console.error('내 화이트 가져오기 오류', error);
        return [];
    }
}

async function getMyBlack(): Promise<HeartBody[]> {
    try {
        const { data } = await api.get(`/myheart/black`);
        return data.payload;
    } catch (error) {
        console.error('내 블랙 가져오기 오류', error);
        return [];
    }
}

async function deleteMyBlack(id: string) {
    try {
        await api.delete(`/black/${id}`);
    } catch (error) {
        console.error('내 블랙 삭제 오류', error);
    }
}

async function deleteMyWhite(id: string) {
    try {
        await api.delete(`/white/${id}`);
    } catch (error) {
        console.error('내 화이트 삭제 오류', error);
    }
}

export { getMyWhite, deleteMyWhite, getMyBlack, deleteMyBlack };

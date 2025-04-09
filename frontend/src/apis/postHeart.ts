import api from './basic';
import { PostBody } from '@/utils/type';

async function postBlack(body: PostBody) {
    try {
        await api.post('/black', body);
    } catch (error) {
        throw new Error('블랙 작성 오류');
    }
}

async function postWhite(body: PostBody) {
    try {
        await api.post('/white', body);
    } catch (error) {
        throw new Error('화이트 작성 오류');
    }
}

export { postBlack, postWhite };

import api from './basic';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function redirectToSocial(platform: string) {
    const redirectUrl = `${serverUrl}/oauth2/authorization/${platform}`;
    window.location.href = redirectUrl;
}

async function withdrawSocial() {
    try {
        await api.post(`/users/withdraw`);
        localStorage.removeItem('access_token');
    } catch (error) {
        console.error('탈퇴 오류', error);
    }
}

async function logoutSocial() {
    try {
        await api.post(`/users/logout`);
        localStorage.removeItem('access_token');
    } catch (error) {
        console.error('로그아웃 오류', error);
    }
}

function saveTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        window.location.href = window.location.origin + window.location.pathname;
    }
}

export { redirectToSocial, saveTokenFromUrl, withdrawSocial, logoutSocial };

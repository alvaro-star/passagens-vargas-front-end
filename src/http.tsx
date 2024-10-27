import axios from 'axios'
const COOKIE_TOKEN_NAME = "token"
const COOKIE_REFRESH_TOKEN_NAME = "refreshToken"
const http = axios.create({
    //baseURL: 'http://85.209.95.183:8080/',
    baseURL: 'http://127.0.0.1:8080/',
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})

http.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem(COOKIE_TOKEN_NAME)

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

//Incompleto
http.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const originalRequest = error.config;

    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = sessionStorage.getItem(COOKIE_REFRESH_TOKEN_NAME);
            const response = await axios.post('auth/refresh', { refreshToken });
            const newAccessToken = response.data.accessToken;
            sessionStorage.setItem(COOKIE_TOKEN_NAME, newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return http(originalRequest);
        } catch (refreshError) {
            console.error('Inicia Session Nuevamente', refreshError);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default http
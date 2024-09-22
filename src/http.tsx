import axios from 'axios'

const http = axios.create({
    //baseURL: 'http://85.209.95.183:8080/',
    baseURL: 'http://127.0.0.1:8080/',
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})

http.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('token')

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
        originalRequest._retry = true;  // Marcar a requisição como sendo repetida
        try {
            // Obter o refresh token (geralmente armazenado em localStorage ou cookies)
            const refreshToken = sessionStorage.getItem('refreshToken');

            // Fazer uma requisição para obter um novo access token
            const response = await axios.post('auth/refresh', { refreshToken });

            // Atualizar o access token
            const newAccessToken = response.data.accessToken;
            sessionStorage.setItem('accessToken', newAccessToken);

            // Adicionar o novo token no cabeçalho Authorization da requisição original
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // Repetir a requisição original com o novo token
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
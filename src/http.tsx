import axios from 'axios'
import { CookieRefreshToken, CookieToken } from './Helpers/CookieGenerate/CookiesAuth'

const http = axios.create({
    //baseURL: 'http://85.209.95.183:8080/',
    baseURL: 'http://127.0.0.1:8080/',
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})

http.interceptors.request.use(function (config) {
    const token = CookieToken.get()

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
    console.log("error");
    console.log(error);
    console.log("error");
    const originalRequest = error.config;
    
    if ((error.response?.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        console.log("Entrei no if");
        
        originalRequest._retry = true;
        try {
            const refreshToken = CookieRefreshToken.get()
            const response = await http.post('auth/refresh', { refreshToken: refreshToken });
            
            const newAccessToken = response.data.token;
            
            if (newAccessToken) CookieToken.set(newAccessToken)
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            return http(originalRequest);
        } catch (refreshError) {
            console.log("erroDaSolicitacao");
            
            console.log(error);

            console.error('Inicia Session Nuevamente', refreshError);
            //window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default http
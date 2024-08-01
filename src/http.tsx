import axios from 'axios'

const http = axios.create({
    //baseURL: 'http://85.209.95.183:8080/',
    baseURL: 'http://192.168.100.100:8080/',
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
/*
http.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const navigate = useNavigate()
    if (error.response && error.response.status === 403) {
        sessionStorage.removeItem('token')
        navigate('/login')
        return Promise.resolve();
    }
    return Promise.reject(error);
});*/

export default http
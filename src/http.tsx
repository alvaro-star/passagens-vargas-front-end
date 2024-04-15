import axios from 'axios'

const http = axios.create({
    baseURL: 'http://192.168.88.80:8080/',
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
    console.log("Erro ao interceptador");
    return Promise.reject(error)
})

export default http
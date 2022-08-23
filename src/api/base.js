import axios from 'axios';
import Cookies from 'js-cookie';


const token = Cookies.get('avion_access_token');

const API = axios.create({
    baseURL: process.env.REACT_APP_API,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        Authorization: token && `Bearer ${token}`
    }
})

export default API;

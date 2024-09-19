import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})
const useAxiosSecure = () => {
    const { logOut, setLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axiosSecure.interceptors.response.use(res => {
            return res;
        }, async error => {
            if (error.response.status === 401 || error.response.status === 403){
                await logOut();
                navigate('/login', { replace: true });
                setLoading(false);
            }
            return Promise.reject(error)
        })
    }, [logOut, navigate, setLoading])

    return axiosSecure;
};

export default useAxiosSecure;
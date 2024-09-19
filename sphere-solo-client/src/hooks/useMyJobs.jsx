import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useMyJobs = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: jobs = [], refetch } = useQuery({
        queryKey: ['jobs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/jobs/${user?.email}`)
            return res.data;
        }
    })

    return [jobs, refetch]
};

export default useMyJobs;
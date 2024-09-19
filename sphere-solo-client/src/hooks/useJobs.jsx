import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const useJobs = () => {
    const axiosPublic = useAxiosPublic();

    const { data: jobs = [], refetch } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const res = await axiosPublic.get('/jobs')
            return res.data;
        }
    })

    return [jobs, refetch]
};

export default useJobs;
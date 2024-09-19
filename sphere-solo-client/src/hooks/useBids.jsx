import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useBids = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();

    const { data: myBids = [], refetch, isLoading } = useQuery({
        queryKey: ['myBids', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-bids/${user?.email}`)
            return res.data;
        }
    })

    return [myBids, refetch, isLoading]
};

export default useBids;
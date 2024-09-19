import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useBidRequest = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: BidsRequest = [], refetch, isLoading} = useQuery({
        queryKey: ['BidsRequest', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bidRequests/${user?.email}`)
            return res.data;
        }
    })

    return [BidsRequest, refetch, isLoading]
};

export default useBidRequest;
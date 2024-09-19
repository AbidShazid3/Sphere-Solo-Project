import { Puff } from "react-loader-spinner";


const LoadingSpinner = () => {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <Puff
                visible={true}
                height="150"
                width="150"
                color="#4fa94d"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default LoadingSpinner;
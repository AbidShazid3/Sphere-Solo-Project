import { Link, useLoaderData, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const JobCardDetails = () => {
    const singleJob = useLoaderData();
    const { _id, job_title, category, deadline, description, min_price, max_price, buyer } = singleJob || {};
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [startDate, setStartDate] = useState(new Date());
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        const jobId = _id;
        const email = user?.email;
        const price = parseFloat(data.price);
        const comment = data.comment;
        const date = startDate;
        const status = "Pending"

        if (user?.email === buyer?.email) {
            toast.error("Action Not Permitted.");
            return;
        }

        if (new Date(date) > new Date(deadline)) {
            toast.error("Job deadline has passed. You can't apply.");
            return;
        }

        if (min_price > price) {
            toast.error("The minimum price is too low.");
            return;
        } else if (max_price < price) {
            toast.error("The maximum price is too high.");
            return;
        }

        const bidData = { jobId, job_title, category, min_price, max_price, email, price, comment, date, status, buyer }

        try {
            const res = await axiosSecure.post('/bid', bidData)
            console.log();
            if (res.data.insertedId) {
                toast.success("Bid Placed Successfully");
                reset();
                setStartDate(new Date());
                navigate('/myBids')

            }


        } catch (err) {
            toast.success(err.response.data);
            reset();
        }
    }

    return (
        <div>
            <div className='flex items-center justify-end my-6 gap-x-3'>
                <button onClick={() => navigate(-1)} className='flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100 '>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='w-5 h-5 rtl:rotate-180'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18'
                        />
                    </svg>

                    <span>Go back</span>
                </button>

                <Link to="/" className='w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-gray-500 rounded-lg shrink-0 sm:w-auto hover:bg-gray-600'>
                    Take me home
                </Link>
            </div>
            <div className='flex flex-col md:flex-row justify-around gap-5  items-center md:max-w-screen-xl xl:py-6 mx-auto'>
                {/* Job Details */}
                <div className='flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm font-light text-gray-800 '>
                            Deadline: {new Date(deadline).toLocaleDateString()}
                        </span>
                        <span className='px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full '>
                            {category}
                        </span>
                    </div>

                    <div>
                        <h1 className='mt-2 text-3xl font-semibold text-gray-800 '>
                            {job_title}
                        </h1>

                        <p className='mt-2 text-lg text-gray-600 '>
                            {description}
                        </p>
                        <p className='mt-6 text-sm font-bold text-gray-600 '>
                            Buyer Details:
                        </p>
                        <div className='flex items-center justify-around'>
                            <div>
                                <p className='mt-2 text-sm  text-gray-600 '>Name: {buyer?.name}</p>
                                <p className='mt-2 text-sm  text-gray-600 '>
                                    Email: {buyer.email}
                                </p>
                            </div>
                            <div className='rounded-full object-cover overflow-hidden size-16'>
                                <img src={buyer.photo} alt='' />
                            </div>
                        </div>
                        <p className='mt-6 text-lg font-bold text-gray-600 '>
                            Range: ${min_price} - ${max_price}
                        </p>
                    </div>
                </div>
                {/* Place A Bid Form */}
                <section className='p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]'>
                    <h2 className='text-lg font-semibold text-gray-700 capitalize '>
                        Place A Bid
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
                            <div>
                                <label className='text-gray-700 ' htmlFor='price'>
                                    Price
                                </label>
                                <input
                                    id='price'
                                    type='text'
                                    name='price'
                                    className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                                    {...register("price", { required: true })}
                                />
                                {errors.price && <span className="text-red-500">Price is required</span>}
                            </div>

                            <div>
                                <label className='text-gray-700 ' htmlFor='emailAddress'>
                                    Email Address
                                </label>
                                <input
                                    id='emailAddress'
                                    type='email'
                                    name='email'
                                    readOnly
                                    defaultValue={user?.email}
                                    className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                                    {...register("email", { required: true })}
                                />
                            </div>

                            <div>
                                <label className='text-gray-700 ' htmlFor='comment'>
                                    Comment
                                </label>
                                <input
                                    id='comment'
                                    name='comment'
                                    type='text'
                                    className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
                                    {...register("comment", { required: true })}
                                />
                                {errors.comment && <span className="text-red-500">Comment is required</span>}
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label className='text-gray-700'>Deadline: {new Date(deadline).toLocaleDateString()} </label>
                                {/* Date Picker Input Field */}
                                <DatePicker
                                    className="border p-2 rounded-md w-full"
                                    selected={startDate} onChange={(date) => setStartDate(date)} />
                            </div>
                        </div>

                        <div className='flex justify-end mt-6'>
                            {user && user?.email ?
                                (<button disabled={loading}
                                    type='submit'
                                    className='btn btn-sm btn-neutral text-white  hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>Place Bid
                                </button>) :
                                (<button
                                    type='submit'
                                    disabled
                                    className='btn btn-sm'>Place Bid
                                </button>)}
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default JobCardDetails;
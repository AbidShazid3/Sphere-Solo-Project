import { Link, useLocation, useNavigate } from "react-router-dom";
import img2 from "../../assets/images/register.jpg"
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { ImSpinner } from "react-icons/im";

const Register = () => {
    const { user, setUser, createUser, signInWithGoogle, updateUserProfile, loading, setLoading } = useAuth();
    const { showPass, setShowPass } = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state || '/'

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [navigate, user])

    // google login
    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
            toast.success('Logged In Successfully');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err?.message);
            setLoading(false);
        }
    }

    // email password login
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {

        try {
            const result = await createUser(data.email, data.password)
            await updateUserProfile(data.name, data.photo)
            setUser({ ...result.user, displayName: data.name, photoURL: data.photo })
            reset();
            toast.success('Logged In Successfully');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err?.message);
            setLoading(false);
        }
    }

    if (user || loading) return

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl'>
                <div className='w-full px-4 md:px-8 lg:w-1/2'>

                    <button disabled={loading} onClick={handleGoogleLogin} className='flex w-full cursor-pointer items-center justify-center text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-50 '>
                        <div>
                            <FcGoogle className="text-2xl" />
                        </div>

                        <span className='w-5/6 px-4 py-3 font-bold text-center hover:text-green-500'>
                            Sign in with Google
                        </span>
                    </button>

                    <div className='flex items-center justify-between mt-4'>
                        <span className='w-1/5 border-b  lg:w-1/4'></span>

                        <div className='text-xs text-center text-gray-500 uppercase  hover:underline'>
                            or Registration with email
                        </div>

                        <span className='w-1/5 border-b dark:border-gray-400 lg:w-1/4'></span>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mt-4'>
                            <label
                                className='block mb-2 text-sm font-medium text-gray-600 '
                                htmlFor='name'
                            >
                                Username
                            </label>
                            <input
                                id='name'
                                autoComplete='name'
                                name='name'
                                className='block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300'
                                type='text'
                                {...register("name", { required: true })}
                            />
                            {errors.name && <span className="text-red-500">Name is required</span>}
                        </div>
                        <div className='mt-2'>
                            <label
                                className='block mb-2 text-sm font-medium text-gray-600 '
                                htmlFor='photo'
                            >
                                Photo URL
                            </label>
                            <input
                                id='photo'
                                autoComplete='photo'
                                name='photo'
                                className='block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300'
                                type='text'
                                {...register("photo", { required: true })}
                            />
                            {errors.photo && <span className="text-red-500">Photo is required</span>}
                        </div>
                        <div className='mt-2'>
                            <label
                                className='block mb-2 text-sm font-medium text-gray-600 '
                                htmlFor='LoggingEmailAddress'
                            >
                                Email Address
                            </label>
                            <input
                                id='LoggingEmailAddress'
                                autoComplete='email'
                                name='email'
                                className='block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300'
                                type='email'
                                {...register("email", { required: true })}
                            />
                            {errors.email && <span className="text-red-500">Email is required</span>}
                        </div>

                        <div className='mt-2'>
                            <label
                                className='block mb-2 text-sm font-medium text-gray-600 '
                                htmlFor='loggingPassword'
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id='loggingPassword'
                                    autoComplete='current-password'
                                    name='password'
                                    className='block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300'
                                    type={showPass ? 'text' : 'password'}
                                    {...register("password", { required: true, minLength: 6, maxLength: 20, pattern: /(?=.*[A-Z])(?=.*[a-z])/ })}
                                />
                                <span className="absolute right-4 top-3" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash></FaEyeSlash> : <FaRegEye></FaRegEye>}
                                </span>
                                {errors.password?.type === "required" && (<p className="text-red-500">Password is required</p>)}
                                {errors.password?.type === "minLength" && (<p className="text-red-500">Must be 6</p>)}
                                {errors.password?.type === "maxLength" && (<p className="text-red-500">Must be less than 20</p>)}
                                {errors.password?.type === "pattern" && (<p className="text-red-500">Must be 1 uppercase and lowercase</p>)}
                            </div>
                        </div>
                        <div className='mt-4'>
                            <button
                                disabled={loading}
                                type='submit'
                                className='w-full px-6 py-3 text-base font-medium tracking-wide text-white btn btn-neutral hover:btn-accent'
                            >
                                {loading ? <ImSpinner className='animate-spin mx-auto' /> : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className='flex items-center justify-between mt-4'>
                        <span className='w-1/5 border-b  md:w-1/4'></span>

                        <Link
                            to='/login'
                            className=' text-red-500 font-bold hover:underline hover:text-green-500 mb-4'
                        >
                            or Login Now
                        </Link>

                        <span className='w-1/5 border-b md:w-1/4'></span>
                    </div>
                </div>
                <div
                    className='hidden bg-cover bg-center lg:block lg:w-1/2'
                    style={{
                        backgroundImage: `url(${img2})`,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Register;
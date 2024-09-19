import { Link, NavLink } from "react-router-dom";
import logo1 from "../../assets/images/logo.png"
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const NavBar = () => {
    const { user, logOut, loading } = useAuth();

    const handleSignOut = async () => {
        try {
            await logOut()
            toast.success("Logout Successfully");
        } catch (err) {
            toast.error(err?.message);
        }
    }

    const handleClick = () => {
        const elem = document.activeElement;
        if (elem) {
            elem?.blur();
        }
    };

    const links =
        <>
            <li><NavLink to="/addJob" onClick={handleClick}>Add Job</NavLink></li>
            <li><NavLink to="/myPostedJobs" onClick={handleClick}>My Posted Jobs</NavLink></li>
            <li><NavLink to="/myBids" onClick={handleClick}>My Bids</NavLink></li>
            <li><NavLink to="/bidRequests" onClick={handleClick}>Bid Requests</NavLink></li>
        </>

    return (
        <div className='navbar bg-base-100  container mx-auto'>
            <div className='flex-1'>
                <Link to="/" className='flex gap-2 items-center'>
                    <img className='w-auto h-5 md:h-7 lg:h-7' src={logo1} alt='' />
                    <span className='text-xs md:text-base lg:text-base 2xl:text-base font-bold '>SphereSolo</span>
                </Link>
            </div>
            <div className='flex-none'>
                <ul className='menu menu-horizontal gap-2'>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="allJobs">All Jobs</NavLink></li>

                    {!user &&
                        <li><NavLink to="/login">{loading ? "loading..." : "LogIn"}</NavLink></li>
                    }
                </ul>

                {user && 
                    (<div className='dropdown dropdown-end z-50'>
                        <div
                            tabIndex={0}
                            role='button'
                            className='btn btn-ghost btn-circle avatar'
                        >
                            <div title={user?.displayName} className='w-9 rounded-full'>
                                <img
                                    referrerPolicy='no-referrer'
                                    alt='User Profile Photo'
                                    src={user?.photoURL}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            {links}
                            <li className='mt-2'>
                                <button onClick={handleSignOut} className='bg-gray-200 block text-center hover:bg-slate-600 hover:text-white'>Logout</button>
                            </li>
                        </ul>
                    </div>)}
            </div>
        </div>

    );
};

export default NavBar;
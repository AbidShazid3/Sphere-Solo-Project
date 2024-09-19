import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard/JobCard";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useSearchParams } from "react-router-dom";


const AllJobs = () => {
    // const [jobs] = useJobs();
    const { loading } = useAuth();
    const [allJobs, setAllJobs] = useState([]);
    const axiosPublic = useAxiosPublic();

    const [searchParams, setSearchParams] = useSearchParams();

    const initialPage = Number(searchParams.get("page")) || 1;

    // pagination setup
    const [itemPerPage, setItemPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [count, setCount] = useState(0);
    // pagination setup state end

    // filter
    const [filter, setFilter] = useState('');

    // search
    const [search, setSearch] = useState('');
    const [searchText, setSearchText] = useState('');

    // sort
    const [sort, setSort] = useState('')

    useEffect(() => {
        const getData = async () => {
            const result = await axiosPublic.get(`/all-jobs?page=${currentPage}&size=${itemPerPage}&filter=${filter}&sort=${sort}&search=${search}`)
            setAllJobs(result.data);
        }
        getData();

    }, [axiosPublic, currentPage, itemPerPage, filter, sort, search])

    // total data count for pagination
    useEffect(() => {
        const getCount = async () => {
            const result = await axiosPublic.get(`/jobs-count?&filter=${filter}&search=${search}`)
            setCount(result.data.count)
        }
        getCount();

    }, [axiosPublic, filter, search])

    const numberOfPage = Math.ceil(count / itemPerPage)
    const pages = [...Array(numberOfPage).keys()].map(element => element + 1)
    // console.log(numberOfPage);

    // [...Array(5).keys()].map(element => element +1) main method for pagination.

    // handle pagination button function
    const handlePaginationButton = (value) => {
        setCurrentPage(value);
        setSearchParams({page: value})
    }

    // search function
    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchText);
    }

    // reset all function
    const handleReset = () => {
        setFilter('');
        setSearchText('');
        setSearch('')
        setSort('');
    }

    return (
        <div className='container px-6 py-2 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between'>
            <div>
                <div className='flex flex-col md:flex-row justify-center items-center gap-2 '>

                    {/* filter */}
                    <div>
                        <select
                            onChange={e => {setFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            name='category'
                            id='category'
                            value={filter}
                            className='border p-2 md:p-2 rounded-lg'
                        >
                            <option value='' disabled>Filter By Category</option>
                            <option value='Web Development'>Web Development</option>
                            <option value='Graphics Design'>Graphics Design</option>
                            <option value='Digital Marketing'>Digital Marketing</option>
                        </select>
                    </div>

                    {/* search field */}
                    <form onSubmit={handleSearch}>
                        <div className='flex p-1 overflow-hidden border rounded-lg focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300'>
                            <input
                                className='py-1 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent'
                                id="search"
                                type='text'
                                name='search'
                                placeholder='Enter Job Title'
                                aria-label='Enter Job Title'
                                onChange={e => setSearchText(e.target.value)}
                                value={searchText}
                            />

                            <button className='px-1 md:px-4 py-2 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none'>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* sort */}
                    <div>
                        <select
                            onChange={e => {
                                setSort(e.target.value)
                                setCurrentPage(1);
                            }}
                            name='sort'
                            id='sort'
                            value={sort}
                            className='border p-2 rounded-md'
                        >
                            <option value='' disabled>Sort By Deadline</option>
                            <option value='dsc'>Descending Order</option>
                            <option value='asc'>Ascending Order</option>
                        </select>
                    </div>

                    <button onClick={handleReset} className='btn btn-sm'>Reset All</button>
                </div>
                <div>
                    {
                        loading ? (<div><LoadingSpinner></LoadingSpinner></div>) : (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
                            {
                                allJobs.map(job => <JobCard key={job._id} job={job}></JobCard>)
                            }
                        </div>)
                    }
                </div>
            </div>

            {/* pagination */}
            <div className='flex justify-center mt-10'>
                {/* previous button */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePaginationButton(currentPage - 1)}
                    className='px-4 py-2 mx-1 text-gray-700 disabled:text-gray-500 capitalize bg-gray-200 rounded-md disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:bg-blue-500  hover:text-white'>
                    <div className='flex items-center -mx-1'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-6 h-6 mx-1 rtl:-scale-x-100'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M7 16l-4-4m0 0l4-4m-4 4h18'
                            />
                        </svg>

                        <span className='mx-1'>previous</span>
                    </div>
                </button>

                {/* number of page */}
                {pages.map(btnNum => (
                    <button
                        onClick={() => handlePaginationButton(btnNum)}
                        key={btnNum}
                        className={`hidden ${currentPage === btnNum ? 'bg-blue-500 text-white' : ''} px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-blue-500  hover:text-white`}
                    >
                        {btnNum}
                    </button>
                ))}

                {/* next button */}
                <button
                    disabled={currentPage === numberOfPage}
                    onClick={() => handlePaginationButton(currentPage + 1)}
                    className='px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-gray-200 rounded-md hover:bg-blue-500 disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500'>
                    <div className='flex items-center -mx-1'>
                        <span className='mx-1'>Next</span>

                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-6 h-6 mx-1 rtl:-scale-x-100'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M17 8l4 4m0 0l-4 4m4-4H3'
                            />
                        </svg>
                    </div>
                </button>
                <div className="flex items-center ml-5 gap-1">
                    <span className="font-medium">1 - {numberOfPage}</span> of {allJobs.length} records
                </div>
            </div>
        </div>
    );
};

export default AllJobs;
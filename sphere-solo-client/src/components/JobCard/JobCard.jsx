import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    const { _id, job_title, category, deadline, description, min_price, max_price, bid_count } = job || {}

    return (
        <Link to={`/job/${_id}`} className='w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all'>
            <div className='flex items-center justify-between'>
                <span className='text-xs font-light text-gray-800 '>
                    Deadline: {new Date(deadline).toLocaleDateString()}
                </span>
                <span className='px-3 py-1 text-[8px] text-blue-800 uppercase bg-blue-200 rounded-full '>
                    {category}
                </span>
            </div>

            <div>
                <h1 className='mt-2 text-lg font-semibold text-gray-800 '>
                    {job_title}
                </h1>

                <p title={description} className='mt-2 text-sm text-gray-600 '>
                    {description}
                    {/* {description.substring(0,50)}... */}
                </p>
                <div className='flex mt-2 items-center justify-between text-sm font-bold text-gray-600'>
                    <p>
                        Range: ${min_price} - ${max_price}
                    </p>
                    <p>Total Bids: {bid_count}</p>
                </div>
            </div>
        </Link>
    )
}

JobCard.propTypes = {
    job: PropTypes.object
}

export default JobCard
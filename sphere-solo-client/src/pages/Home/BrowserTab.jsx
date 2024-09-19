import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useJobs from '../../hooks/useJobs';
import JobCard from '../../components/JobCard/JobCard';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const BrowserTab = () => {
    const [jobs] = useJobs();
    const [activeTab, setActiveTab] = useState(0);
    const { loading } = useAuth();

    const handleTabSelect = index => {
        setActiveTab(index);
    }

    return (
        <Tabs selectedIndex={activeTab} onSelect={handleTabSelect}>
            <div className='container py-20 mx-auto'>
                <h1 className='text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl '>
                    Browse Jobs By Categories
                </h1>

                <p className='max-w-2xl mx-auto my-6 text-center text-gray-500 '>
                    Three categories available for the time being. They are Web
                    Development, Graphics Design and Digital Marketing. Browse them by
                    clicking on the tabs below.
                </p>
                <div className='flex justify-center items-center font-medium'>
                    <TabList>
                        <Tab>Web Development</Tab>
                        <Tab>Graphics Design</Tab>
                        <Tab>Digital Marketing</Tab>

                    </TabList>
                </div>

                <TabPanel>
                    {loading ? ((<div><LoadingSpinner></LoadingSpinner></div>)) : (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 items-center justify-center'>
                        {
                            jobs.filter(jb => jb.category === 'Web Development').slice(0, 9).map(job => (<JobCard key={job._id} job={job}></JobCard>))
                        }
                    </div>)}
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {
                            jobs.filter(jb => jb.category === 'Graphics Design').slice(0, 9).map(job => (<JobCard key={job._id} job={job}></JobCard>))
                        }
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                        {
                            jobs.filter(jb => jb.category === 'Digital Marketing').slice(0, 9).map(job => (<JobCard key={job._id} job={job}></JobCard>))
                        }
                    </div>
                </TabPanel>
            </div>
            <div className='flex justify-center'>
                <Link to="/allJobs" className='btn btn-outline btn-accent btn-sm font-bold'>View More Jobs</Link>
            </div>
        </Tabs>
    );
};

export default BrowserTab;
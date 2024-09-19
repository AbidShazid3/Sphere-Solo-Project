import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../layouts/Main";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AllJobs from "../pages/AllJobs/AllJobs";
import JobCardDetails from "../pages/JobCardDetails/JobCardDetails";
import AddJob from "../pages/AddJob/AddJob";
import MyPostedJob from "../pages/MyPostedJob/MyPostedJob";
import UpdateJob from "../pages/UpdateJob/UpdateJob";
import MyBids from "../pages/MyBids/MyBids";
import BidsRequest from "../pages/BidsRequest/BidsRequest";
import PrivetRoute from "./PrivetRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/allJobs",
                element: <AllJobs></AllJobs>,
            },
            {
                path: "/job/:id",
                element: <JobCardDetails></JobCardDetails>,
                loader: ({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)
            },
            {
                path: "/addJob",
                element: <PrivetRoute><AddJob></AddJob></PrivetRoute>
            },
            {
                path: "/myPostedJobs",
                element: <PrivetRoute><MyPostedJob></MyPostedJob></PrivetRoute>
            },
            {
                path: "/update/:id",
                element: <PrivetRoute><UpdateJob></UpdateJob></PrivetRoute>,
                loader: ({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)
            },
            {
                path: "/myBids",
                element: <PrivetRoute><MyBids></MyBids></PrivetRoute>
            },
            {
                path: "/bidRequests",
                element: <PrivetRoute><BidsRequest></BidsRequest></PrivetRoute>
            },
        ]
    },
    {
        path: "/login",
        element: <Login></Login>,
    },
    {
        path: "/register",
        element: <Register></Register>
    },
]);
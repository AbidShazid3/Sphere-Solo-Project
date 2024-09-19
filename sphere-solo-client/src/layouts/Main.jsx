import { Outlet } from "react-router-dom";
import NavBar from "../pages/common/NavBar";
import Footer from "../pages/common/Footer";

const Main = () => {
    return (
        <div>
            <div className="container mx-auto p-1 md:p-2 lg:p-2">
                <NavBar></NavBar>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;
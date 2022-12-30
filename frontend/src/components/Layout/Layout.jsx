import React from "react";
import { Outlet } from "react-router-dom";

// import Header from "./Header";
// import Footer from "./Footer";

import "../../componentStyles/Layout.css";

function Layout() {
    return (
        <div className="Layout">
            {/* <Header /> */}
            <Outlet />
            {/* <Footer /> */}
        </div>
    );
}

export default Layout;

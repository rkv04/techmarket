import React from "react";
import './Home.css';
import Userinfo from "../components/userinfo";

const User = () => {
    return(
        <div className="Main">
            <div className="mainBlock">
                <Userinfo />
            </div>
            <div className="sideBar">
            </div>
        </div>
    );
}

export default User;
import React from "react";

const Navbar = () =>{
    return(
        <nav className="ui raised very padded segment">
            <div className="ui right floated header">
                <button className="ui button"><a href="/teachers">Преподаватели</a></button>
                <button className="ui button"><a href="/about">About</a></button>
                <button className="ui button"><a href="/contact">Contact</a></button>
            </div>

        </nav>
    )
}

export default Navbar;
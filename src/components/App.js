import React from "react";

import Teachers from "./Teachers";
import TeachersForm from "./TeachersForm";

import About from "./About";
import Contact from "./Contact";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";


function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <Navbar/>
                <Routes>
                    <Route path='/teachers' element={<Teachers/>} />
                    <Route path='/teachers/add' element={<TeachersForm/>} />
                    
                    <Route path='/about' element={<About/>} />
                    <Route path='/contact' element={<Contact/>} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
export default App;
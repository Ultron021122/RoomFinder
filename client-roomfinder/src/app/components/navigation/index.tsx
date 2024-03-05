"use client";

import { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Navigate = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            {/* <Sidebar isOpen={isOpen} toggle={toggle} /> */}
            <Navbar isOpen={isOpen} toggle={toggle} />
        </>
    );
}

export default Navigate;
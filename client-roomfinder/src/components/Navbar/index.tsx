'use client';
import { useState } from "react";
import Navbar from "./navbar";

function Navigate() {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <Navbar isOpen={isOpen} toggle={toggle} />
        </>
    );
}

export default Navigate;
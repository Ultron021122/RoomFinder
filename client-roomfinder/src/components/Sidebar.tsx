import { useState } from "react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    };

    return (
        <>
            <h1>Hola mundo</h1>
        </>
    );
};

export default Sidebar;
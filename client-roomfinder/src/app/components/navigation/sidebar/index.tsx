import React from "react";
import Link from "next/link";

const Sidebar = ({
    isOpen,
    toggle,
}: {
    isOpen: boolean,
    toggle: () => void;
}): JSX.Element => {
    return (
        <>
            <div className="fixed w-full h-full overflow-hidden justify-center bg-white grid pt-[78px] left-0 z-10" style={{ opacity: `${isOpen ? "1" : "0"}`, top: ` ${isOpen ? "0" : "-100%"}` }}>
                <button className="absolute right-0 p-5" onClick={toggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                        />
                    </svg>
                </button>

                <ul className="text-center leading-relaxed">
                    <li>
                        <Link href="/propiedades" onClick={toggle}><p>Propiedades</p></Link>
                    </li>
                    <li>
                        <Link href="/" onClick={toggle}><p>Servicios</p></Link>
                    </li>
                    <li>
                        <Link href="/" onClick={toggle}><p>Contactos</p></Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
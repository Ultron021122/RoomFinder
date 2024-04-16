'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
    <PerfectScrollbar>
        {children}
    </PerfectScrollbar>
);

export default Layout;
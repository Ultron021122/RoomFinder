'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
    <PerfectScrollbar>
        <div className='mx-2'>
            {children}
        </div>
    </PerfectScrollbar>
);

export default Layout;
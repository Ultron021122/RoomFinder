import { ScrollArea } from './ui/scroll-area';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
    <ScrollArea>
        <div>
            {children}
        </div>
    </ScrollArea>
);

export default Layout;
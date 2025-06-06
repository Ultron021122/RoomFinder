import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react";
import Link from 'next/link';
import { PlusIcon } from "./icon";
import { useSession, signOut } from "next-auth/react";
import { shortName } from "@/utils/functions";

interface DropdownUserProps {
    vchname: string;
    vchpaternalsurname: string;
    vchmaternalsurname: string;
    vchemail: string;
    vchimage: string;
    usuarioid: number;
    sessionid: number;
    dtbirthdate: string;
    bnverified: boolean;
    bnstatus: boolean;
    roleid: number;
}

const DropdownUser = () => {
    const { data: session } = useSession();
    const user = session?.user as DropdownUserProps;

    return (
        <Dropdown placement="bottom-start" classNames={{
            content: "dark:bg-gray-900 border dark:border-gray-800 rounded-md"
        }}>
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    src={user.vchimage}
                    color="primary"
                    classNames={{
                        base: "ring-offset-gray-900 mr-1"
                    }}
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User Actions"
            >
                <DropdownSection
                    aria-label="Profile & actions"
                    showDivider
                    classNames={{
                        divider: "dark:bg-gray-800"
                    }}
                >
                    <DropdownItem isReadOnly key="profile" className="h-14 gap-2" textValue="Pérfil">
                        <p className="font-semibold text-sm capitalize">
                            {
                                shortName({
                                    vchname: user.vchname,
                                    vchpaternalsurname: user.vchpaternalsurname,
                                    vchmaternalsurname: user.vchmaternalsurname
                                })
                            }
                        </p>
                        <p className="text-small">{user.vchemail}</p>
                    </DropdownItem>
                    <DropdownItem as={Link} href="/dashboard" key="dashboard" textValue="Panel de administración">
                        Panel
                    </DropdownItem>
                    <DropdownItem as={Link} href="/dashboard/settings" key="settings" textValue="Configuraciones">Configuración</DropdownItem>
                    <DropdownItem
                        as={Link} 
                        href="/dashboard/publish"
                        key="new_project"
                        textValue="Create a new project"
                        endContent={<PlusIcon className="text-large"></PlusIcon>}
                    >
                        Nueva Propiedad
                    </DropdownItem>
                </DropdownSection>
                {/* <DropdownItem key="settings" textValue="Configuraciones">
                    Mis Configuraciones
                </DropdownItem> */}
                {/* <DropdownItem key="team_settings" textValue="Configuraciones de equipo">
                    Team Settings
                </DropdownItem> */}
                <DropdownSection aria-label="Help & Feedback">
                    <DropdownItem as={Link} href="/dashboard/help" key="help_and_feedback" textValue="Ayuda">
                        Ayuda
                    </DropdownItem>
                    <DropdownItem key="logout" textValue="Cerrar sesión" color="danger" onClick={() => { signOut(); }}>
                        Cerrar Sesión
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
};

export default DropdownUser;
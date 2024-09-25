"use client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@nextui-org/react";
import Link from 'next/link';
import { PlusIcon } from "./icon";
import { useSession, signOut } from "next-auth/react";
import { rolesMapping } from "@/utils/constants";
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
    const roleName = rolesMapping[user?.roleid] || 'Desconocido';

    return (
        <>
            <Dropdown placement="bottom-start" classNames={{
                content: "dark:bg-gray-900 border dark:border-gray-800 rounded-md"
            }}>
                <DropdownTrigger>
                    <User
                        as="button"
                        avatarProps={{
                            isBordered: true,
                            color: "primary",
                            classNames: {
                                base: "ring-offset-gray-900 mr-1"
                            },
                            src: `${user.vchimage}`
                        }}
                        className="transition-transform"
                        description={roleName}
                        name={user.vchname}
                        classNames={{
                            wrapper: "hidden sm:inline-flex flex-col items-start",
                            name: "dark:text-gray-200",
                            description: "capitalize"
                        }}
                    />
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="User Actions"
                    classNames={{
                        base: "dark:bg-gray-900"
                    }}
                    itemClasses={{
                        base: [
                            "rounded-md",
                            "text-default-700 dark:text-default-300",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground dark:data-[hover=true]:text-default-50",
                            "data-[hover=true]:bg-default-300",
                            "dark:data-[hover=true]:bg-default-700",
                            "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[focus-visible=true]:ring-default-500",
                        ],
                    }}
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
                            Dashboard
                        </DropdownItem>
                        <DropdownItem key="settings" textValue="Configuraciones">Settings</DropdownItem>
                        <DropdownItem
                            key="new_project"
                            textValue="Create a new project"
                            endContent={<PlusIcon className="text-large"></PlusIcon>}
                        >
                            Nueva Propiedad
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownItem key="settings" textValue="Configuraciones">
                        Mis Configuraciones
                    </DropdownItem>
                    <DropdownItem key="team_settings" textValue="Configuraciones de equipo">Team Settings</DropdownItem>
                    <DropdownSection aria-label="Help & Feedback">
                        <DropdownItem key="help_and_feedback" textValue="Ayuda">
                            Ayuda y Retroalimentación
                        </DropdownItem>
                        <DropdownItem key="logout" textValue="Cerrar sesión" onClick={() => { signOut(); }}>
                            Cerrar Sesión
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default DropdownUser;
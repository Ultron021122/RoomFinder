"use client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@nextui-org/react";
import { PlusIcon } from "./icon";
import { useSession, signOut } from "next-auth/react";

const DropdownUser = () => {
    const { data: session, status } = useSession();
    console.log(session, status);
    const user = session?.user;

    return (
        <>
            <Dropdown placement="bottom-start" classNames={{
                content: "dark:bg-gray-800 border dark:border-gray-700 rounded-md"
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
                            src: "https://upload.wikimedia.org/wikipedia/en/9/90/The_DuckDuckGo_Duck.png",
                        }}
                        className="transition-transform"
                        description={(user as any)?.type_user}
                        name={user?.name}
                        classNames={{
                            name: "dark:text-gray-200",
                            description: "capitalize"
                        }}
                    />
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="User Actions"
                    classNames={{
                        base: "dark:bg-gray-800"
                    }}
                    itemClasses={{
                        base: [
                            "rounded-md",
                            "text-default-700 dark:text-default-300",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[hover=true]:bg-default-300",
                            "dark:data-[hover=true]:bg-default-400",
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
                            divider: "dark:bg-gray-700"
                        }}
                    >
                        <DropdownItem isReadOnly key="profile" className="h-14 gap-2" textValue="Pérfil">
                            <p className="font-semibold text-sm capitalize">{user?.name + " " + (user as any)?.last_name}</p>
                            <p className="text-small">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="dashboard" textValue="Panel de administración">
                            Dashboard
                        </DropdownItem>
                        <DropdownItem key="settings" textValue="Configuraciones">Settings</DropdownItem>
                        <DropdownItem
                            key="new_project"
                            textValue="Create a new project"
                            endContent={<PlusIcon className="text-large"></PlusIcon>}
                        >
                            New Project
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownItem key="settings" textValue="Configuraciones">
                        My Settings
                    </DropdownItem>
                    <DropdownItem key="team_settings" textValue="Configuraciones de equipo">Team Settings</DropdownItem>
                    <DropdownSection aria-label="Help & Feedback">
                        <DropdownItem key="help_and_feedback" textValue="Ayuda">
                            Help & Feedback
                        </DropdownItem>
                        <DropdownItem key="logout" textValue="Cerrar sesión" onClick={() => { signOut(); }}>
                            Log Out
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default DropdownUser;
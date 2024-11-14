'use client';

import { useSession } from "next-auth/react";
import { rolesMapping } from "@/utils/constants";
import { UserProfile } from "@/utils/interfaces";
import { Spinner, useDisclosure } from "@nextui-org/react";
import ImageModal from "./ImageModal";
import dynamic from "next/dynamic";

const Profile = () => {
    const { data: session } = useSession();
    const user = session?.user as UserProfile;
    // Data Structure
    const defaultUserData = {
        vchname: '',
        vchpaternalsurname: '',
        vchmaternalsurname: '',
        vchemail: '',
        vchphone: '',
        vchstreet: '',
        vchimage: '',
        vchcoverimage: '',
    };

    // Sobrescribir los valores predeterminados con los del usuario (si existen)
    const userData = {
        ...defaultUserData,
        ...(user ?? {}),
    };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const DynamicMap = dynamic(() => import("./profile"), { ssr: false, loading: () => <Spinner /> });

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <DynamicMap userData={user as UserProfile} />
            <ImageModal isOpen={isOpen} onClose={onOpenChange} />
        </div>
    );
}

export default Profile;
'use client';

import { useSession } from "next-auth/react";
import { UserProfile } from "@/utils/interfaces";
import { Spinner, useDisclosure } from "@nextui-org/react";
import ImageModal from "./ImageModal";
import dynamic from "next/dynamic";

const Profile = () => {
    const { data: session } = useSession();
    const userProfileData = session?.user as UserProfile;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const DynamicProfile = dynamic(() => import("./profile"), { ssr: false, loading: () => <Spinner /> });

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <DynamicProfile userData={userProfileData} />
            <ImageModal isOpen={isOpen} onClose={onOpenChange} />
        </div>
    );
}

export default Profile;
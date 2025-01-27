'use client';

import { useSession } from "next-auth/react";
import { LessorInfo, StudentInfo, UserProfile } from "@/utils/interfaces";
import { Spinner, useDisclosure } from "@nextui-org/react";
import ImageModal from "./ImageModal";
import dynamic from "next/dynamic";

const Profile = () => {
    const { data: session } = useSession();
    const userProfileData = session?.user as UserProfile;
    const user = userProfileData.roleid === 1 ? session?.user as StudentInfo : session?.user as LessorInfo;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const DynamicMap = dynamic(() => import("./profile"), { ssr: false, loading: () => <Spinner /> });

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <DynamicMap userData={user} />
            <ImageModal isOpen={isOpen} onClose={onOpenChange} />
        </div>
    );
}

export default Profile;
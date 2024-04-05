"use client";
import { Image } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";

function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="container mx-auto min-h-[calc(100vh-73px)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        <Image
          src={`${(user as any)?.image}`}
          alt="User avatar"
          className="min-w-full rounded-md"
        />
        <div>
          <h1 className="font-bold text-3xl dark:text-gray-200">Perfil</h1>
          <p className="dark:text-gray-400">
            <strong>Nombre:</strong> {user?.name}
          </p>
          <p className="dark:text-gray-400">
            <strong>Apellidos:</strong> {(user as any)?.last_name}
          </p>
          <p className="dark:text-gray-400">
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

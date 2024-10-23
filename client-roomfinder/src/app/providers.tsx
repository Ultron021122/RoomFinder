"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
    children: React.ReactNode;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}

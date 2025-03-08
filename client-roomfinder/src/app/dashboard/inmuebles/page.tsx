"use client";

import Inmuebles from "@/components/Dashboard/Inmuebles";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CardOwner from "@/components/Main/Card";

export default function DashboardHome() {

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Inmuebles" />
            <div className="mx-auto">
                <Inmuebles />
            </div>
        </div>
    );
}

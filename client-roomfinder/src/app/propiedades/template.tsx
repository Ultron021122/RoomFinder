"use client";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Template() {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");

  return (
    <>
      <Sidebar onUniversityChange={setSelectedUniversity} />
      <div className="sm:ml-56 md:ml-60 lg:ml-64">
        <DynamicMap
          position={[20.65508, -103.325448]}
          zoom={18}
          name={selectedUniversity}
        />
      </div>
    </>
  );
}

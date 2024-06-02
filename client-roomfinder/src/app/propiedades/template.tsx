"use client";
import FloatingBox from "@/components/Map/Square";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Template() {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [isBoxVisible, setIsBoxVisible] = useState(true);

  const handleClose = () => {
    setIsBoxVisible(false);
  };
  return (
    <>
      {/* <Sidebar onUniversityChange={setSelectedUniversity} /> */}
      {isBoxVisible && (
        <FloatingBox onClose={handleClose} onUniversityChange={setSelectedUniversity} />
      )}
      <div>
        <DynamicMap
          position={[20.65508, -103.325448]}
          zoom={16}
          name={selectedUniversity}
        />
      </div>
    </>
  );
}

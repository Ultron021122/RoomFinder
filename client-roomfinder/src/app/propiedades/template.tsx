"use client";
import FloatingBox from "@/components/Map/Square";
import { Fab } from "@mui/material";
import { Camera, GraduationCapIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Template() {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedTypeProperty, setSelectedTypeProperty] = useState<string>("");
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {
    setIsBoxVisible(false);
  };

  const handleOpen = () => {
    setIsBoxVisible(true);
  };

  return (
    <>
      {isBoxVisible && (
        <FloatingBox
          onClose={handleClose}
          onUniversityChange={setSelectedUniversity}
          onTypePropertyChange={setSelectedTypeProperty}
          open={isBoxVisible}
          toggleDrawer={(newOpen) => () => setIsBoxVisible(newOpen)}
        />
      )}

      <div>
        <DynamicMap
          position={[20.65508, -103.325448]}
          zoom={16}
          name={selectedUniversity}
          typeProperty={selectedTypeProperty}
        />
      </div>

      {/* Botón flotante para abrir el FloatingBox */}
      {!isBoxVisible && (
        <div className="fixed bottom-5 right-5">
          <Fab onClick={handleOpen} color="primary" araria-label="show">
            <GraduationCapIcon size={32}/>
          </Fab>
        </div>
      )}
    </>
  );
}

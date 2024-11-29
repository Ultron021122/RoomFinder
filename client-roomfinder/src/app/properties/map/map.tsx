'use client';
import FloatingBox from "@/components/Map/Square";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Spinner } from "@nextui-org/react";
import { Menu, Search, Undo2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false, loading: () => <Spinner /> });

export default function Map() {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedTypeProperty, setSelectedTypeProperty] = useState<string>("");
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

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
    <div>
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
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 20,
            }}
            icon={
              <SpeedDialIcon
                icon={<Menu />}
                openIcon={<X />}
              />
            }
          >
            <SpeedDialAction
              key={1}
              icon={<Search />}
              tooltipTitle={'Buscar'}
              onClick={handleOpen}
            />
            <SpeedDialAction
              key={2}
              icon={<Undo2 />}
              tooltipTitle={'Regresar'}
              onClick={handleBack}
            />
          </SpeedDial>
        </div>
      )}
    </div>
  );
}

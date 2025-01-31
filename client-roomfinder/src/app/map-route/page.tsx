import dynamic from "next/dynamic";
import { Metadata } from 'next';
import { Spinner } from '@nextui-org/react';

export const metadata: Metadata = {
  title: 'Prueba | RoomFinder',
}

const DynamicMap = dynamic(() => import("@/components/Map/route"), { ssr: false, loading: () => <Spinner /> });

export default function Home() {
  return (
    <>
      <div>
        <DynamicMap
          center={[20.65508, -103.325448]}
          zoom={16}
        />
      </div>
    </>
  );
}
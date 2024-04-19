import { Metadata } from 'next';
import Inicio from "@/components/Main";

export const metadata: Metadata = {
  title: 'Inicio | RoomFinder',
}

export default function Home() {
  return (
    <>
      <Inicio />
    </>
  );
}

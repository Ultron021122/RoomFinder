import { Metadata } from 'next';
import HomeComponent from "@/components/Main";

export const metadata: Metadata = {
  title: 'Inicio | RoomFinder',
}

export default function Home() {
  return (
    <>
      <HomeComponent />
    </>
  );
}

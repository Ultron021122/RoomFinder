import { Metadata } from 'next';
import Login from "@/components/Sessions";

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default function Signin() {
  return (
    <>
      <Login />
    </>
  );
};
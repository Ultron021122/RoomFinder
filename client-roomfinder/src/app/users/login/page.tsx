import { Metadata } from 'next';
import Login from "@/components/Users/login";

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default function Signin() {
  return ( <Login /> );
};
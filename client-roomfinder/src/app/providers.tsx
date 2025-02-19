"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyProvider } from '@/contexts/PropertyContext';
interface Props {
    children: React.ReactNode;
}
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <PropertyProvider>
          {children}
        </PropertyProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
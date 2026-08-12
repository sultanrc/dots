"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// * membuat komponen bernama queryProvider utk di layout.tsx
// * fungsinya untuk memberitahu semua component di bawahnya: “kalian boleh menggunakan React Query dan gunakan queryClient ini.”
// ! coba cek layout.tsx

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

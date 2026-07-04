"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ContactModalProvider } from "@/contexts/ContactModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ContactModalProvider>{children}</ContactModalProvider>
    </AuthProvider>
  );
}

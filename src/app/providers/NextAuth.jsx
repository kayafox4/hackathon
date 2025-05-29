// src/app/providers/NextAuth.jsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function NextAuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
'use client'; // Client Component

import { SessionProvider } from 'next-auth/react';
// import { ReactNode } from 'react'; // JavaScriptファイルでは不要

const NextAuthProvider = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
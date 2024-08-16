//done
// 'use client'
// import React from 'react'

// import { SessionProvider } from "next-auth/react"



// export default function AuthProvider({ children,} : {children: React.ReactNode}) {

//     return (
        
//         <SessionProvider  basePath="api/auth">
//             {children}
//         </SessionProvider>
//     )
//     }

'use client'

import React from 'react';
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}


"use client";

import { useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { CircularProgress } from "@mui/material";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    //   router.push("/unauthorized");
    // }
  }, [session, status, router, pathname, allowedRoles]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // if (allowedRoles && !allowedRoles.includes(session.user.role)) {
  //   return null;
  // }

  return <>{children}</>;
};

export default AuthGuard;








// 'use client';

// import { useRouter } from 'next/navigation';

// // project imports
// import useAuth from 'hooks/useAuth';
// import { useEffect } from 'react';
// import Loader from 'components/ui-component/Loader';

// // types
// import { GuardProps } from 'types';

// // ==============================|| AUTH GUARD ||============================== //

// /**
//  * Authentication guard for routes
//  * @param {PropTypes.node} children children element/node
//  */
// const AuthGuard = ({ children }: GuardProps) => {
//   const { isLoggedIn } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoggedIn) {
//       router.push('/login');
//     }
//   }, [isLoggedIn, router]);

//   if (!isLoggedIn) return <Loader />;

//   return children;
// };

// export default AuthGuard;

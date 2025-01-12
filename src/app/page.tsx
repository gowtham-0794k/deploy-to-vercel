"use client";
// import AdminLogin from "views/AdminAuthentication/login";
import Login from "views/authentication/login";
// import { useState, useEffect } from "react";
// import { useTenant } from "components/tenantLayout";
// import { Typography } from "@mui/material";

export default function HomePage() {
  // const [isAdminDomain, setIsAdminDomain] = useState(false);
  // const { tenant, error } = useTenant() ?? {};

  // useEffect(() => {
  //   if (!tenant) {
  //     return;
  //   }

  //   const hostname = window.location.hostname;
  //   setIsAdminDomain(hostname.startsWith("admin."));
  // }, [tenant]);

  // if (!tenant) {
  //   return (
  //     <div>
  //       <Typography variant="h4">{error?.message}</Typography>
  //     </div>
  //   );
  // }

  // if (isAdminDomain) {
  //   return <AdminLogin />;
  // }

  return <Login />;
}

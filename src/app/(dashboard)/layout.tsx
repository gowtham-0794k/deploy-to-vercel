// PROJECT IMPORTS
import DashboardLayout from "layout/MainLayout";
import AuthGuard from "utils/route-guard/AuthGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}

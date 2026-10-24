import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Staff admin",
  description: "Boardwalk Bowl staff admin (concept).",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}

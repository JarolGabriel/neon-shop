import { Suspense } from "react";
import { AdminOrdersView } from "@/components/admin/AdminOrdersView";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton rows={8} columns={6} />}>
      <AdminOrdersView />
    </Suspense>
  );
}

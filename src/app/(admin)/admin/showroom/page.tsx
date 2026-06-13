import { redirect } from "next/navigation";
import { ADMIN_COMMUNITY_PATH } from "@/lib/community-routes";

export default function LegacyAdminShowroomPage() {
  redirect(ADMIN_COMMUNITY_PATH);
}

import { redirect } from "next/navigation";
import { COMMUNITY_PATH } from "@/lib/community-routes";

export default function LegacyShowroomPage() {
  redirect(COMMUNITY_PATH);
}

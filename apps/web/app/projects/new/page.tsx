import { redirect } from "next/navigation";

/** The new-demo form now lives at /new. */
export default function LegacyNewProjectPage() {
  redirect("/new");
}

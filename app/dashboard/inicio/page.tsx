import { Dashboard } from "@/components/dashboard/dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mi despensa",
}
export default function Page() {
  return <Dashboard />
}

import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import LinkListView from "@/components/LinkListView";

export default function Home() {
  return (
    <AppShell sidebar={<Sidebar />}>
      <LinkListView fallbackTitle="All" />
    </AppShell>
  );
}

import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import LinkSection from "@/components/LinkSection";
import { folders, links } from "@/lib/mock-data";

export default function Home() {
  return (
    <AppShell sidebar={<Sidebar totalCount={links.length} />}>
      <LinkSection title="All" links={links} folders={folders} />
    </AppShell>
  );
}

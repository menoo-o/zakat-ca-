// app/page.tsx
import Nav from "@/components/Nav-Block/Nav-Block";
import SidebarNav from "@/components/Sidebar-Block/SidebarNav";
import ZakatCalculator from "@/components/Zakat-Block/ZakatCalculator";
// import "./page.css";
// import "../components/nav.css";
// import "../components/sidebar-nav.css";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="pageWrapper">
        <SidebarNav />
        <div className="pageMain">
          <ZakatCalculator />
        </div>
      </div>
    </>
  );
}

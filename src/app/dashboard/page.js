import Header from "@/components/Header";
import Account from "@/components/Account";
import Footer from "@/components/Footer";

export const metadata = { title: "Dashboard — NeXa" };

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main>
        <Account />
      </main>
      <Footer />
    </>
  );
}

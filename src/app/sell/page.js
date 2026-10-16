import Header from "@/components/Header";
import Sell from "@/components/Sell";
import Footer from "@/components/Footer";

export const metadata = { title: "Sell an item — NeXa" };

export default function SellPage() {
  return (
    <>
      <Header />
      <main>
        <section>
          <div className="wrap" style={{ maxWidth: 720 }}>
            <Sell />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

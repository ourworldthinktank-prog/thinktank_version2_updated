import Header from "./Header";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";
import Reveal from "./Reveal";

// Common frame for every inner page.
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CookieBanner />
      <Reveal />
    </>
  );
}

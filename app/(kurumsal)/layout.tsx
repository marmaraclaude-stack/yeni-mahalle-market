// Kurumsal / yasal sayfalar route grubu — hepsi aynı nav + footer kabuğunu
// paylaşır (URL'ler grupsuz kalır: /hakkimizda, /gizlilik-politikasi vb.).

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function KurumsalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}

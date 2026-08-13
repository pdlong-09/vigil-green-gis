import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vigil.green"),
  title: "VIGIL - Hệ thống AI cảnh báo sớm nguy cơ mất rừng",
  description: "VIGIL tích hợp dữ liệu ảnh vệ tinh, trí tuệ nhân tạo (AI) cùng khảo sát thực địa nhằm phát hiện sớm đồng thời trực quan hóa các nguy cơ mất rừng trên bản đồ, từ đó thúc đẩy hành động bảo tồn nhanh chóng, hiệu quả hơn tại Việt Nam và trên toàn cầu.",
  icons: {
    icon: [
      { url: '/images/logo.png' },
    ],
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: "VIGIL - Hệ thống AI cảnh báo sớm nguy cơ mất rừng",
    description: "VIGIL tích hợp dữ liệu ảnh vệ tinh, trí tuệ nhân tạo (AI) cùng khảo sát thực địa nhằm phát hiện sớm đồng thời trực quan hóa các nguy cơ mất rừng trên bản đồ, từ đó thúc đẩy hành động bảo tồn nhanh chóng, hiệu quả hơn tại Việt Nam và trên toàn cầu.",
    url: "https://www.vigil.green",
    siteName: "VIGIL",
    images: [
      {
        url: "/images/hero_forest_bg.png",
        width: 1200,
        height: 630,
        alt: "VIGIL - AI Deforestation Early Warning System",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIGIL - Hệ thống AI cảnh báo sớm nguy cơ mất rừng",
    description: "VIGIL tích hợp dữ liệu ảnh vệ tinh, trí tuệ nhân tạo (AI) cùng khảo sát thực địa nhằm phát hiện sớm đồng thời trực quan hóa các nguy cơ mất rừng trên bản đồ.",
    images: ["/images/hero_forest_bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${beVietnamPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

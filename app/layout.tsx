import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import BackgroundAmbience from "@/components/background-ambience";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divine Mercy Seeta | Jesus, I Trust In You",
  description:
    "A community of faith dedicated to the Divine Mercy devotion. Join us for prayer, fellowship, and spiritual growth at Seeta Parish.",
  keywords: [
    "Divine Mercy",
    "Seeta Parish",
    "Catholic",
    "Prayer",
    "Community",
    "Uganda",
  ],
  openGraph: {
    title: "Divine Mercy Seeta",
    description: "Jesus, I Trust In You — A community of faith and devotion.",
    siteName: "Divine Mercy Seeta",
    type: "website",
  },
  icons: {
    icon: "/Images/SEETA%20PARISH%20DIVINE%20MERCY.png",
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundAmbience />
        {children}
      </body>
    </html>
  );
}

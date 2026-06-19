import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans  } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
   title: "Debnath Electronics | Premium Skincare & Beauty Products",

  description:
    "Discover premium skincare and beauty products from Debnath Electronics. Nourish your skin with carefully selected beauty essentials and enjoy fast delivery across Bangladesh.",

   keywords: [
    "Debnath Electronics",
    "skincare products",
    "beauty products Bangladesh",
    "face care",
    "skin care",
    "beauty essentials",
    "cosmetics Bangladesh",
    "glowing skin",
    "organic skincare",
    "premium skincare",
    "online beauty shop",
    "Bangladesh skincare brand",
  ],

  metadataBase: new URL("https://debnathelectronics.com"),

  openGraph: {
    title: "Debnath Electronics | Premium Skincare & Beauty Products",
    description:
      "Discover premium skincare and beauty products from Debnath Electronics. Nourish your skin with carefully selected beauty essentials and enjoy fast delivery across Bangladesh.",
    url: "https://debnathelectronics.com",
    siteName: "Debnath Electronics",
    images: [
      {
        url: "/favicon.ico", 
        width: 1200,
        height: 630,
        alt: "Debnath Electronics - E-commerce Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
     title: "Debnath Electronics | Premium Skincare & Beauty Products",
    description:
      "Discover premium skincare and beauty products from Debnath Electronics. Nourish your skin with carefully selected beauty essentials and enjoy fast delivery across Bangladesh.",
    images: ["/favicon.ico"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut:"/favicon.ico",
    apple: "/favicon.ico",
  },

  applicationName: "Debnath Electronics",

  authors: [
    { name: "Debnath Electronics Team", url: "https://debnathelectronics.com" },
  ],

  creator: "Debnath Electronics",
  publisher: "Debnath Electronics",

  category: "e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable}  h-full antialiased`}

    >
      <body className="min-h-full flex flex-col">
        <UserProvider>

        {children}
        <Toaster richColors={true} position="top-center"/>
        </UserProvider>

      </body>

    </html>
  );
}

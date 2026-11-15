import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danlo Properties Ltd",
  description: "Land opportunities and enquiries with Danlo Properties Ltd.",
  icons: {
    icon: "/assets/danlo-logo.png",
    shortcut: "/assets/danlo-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

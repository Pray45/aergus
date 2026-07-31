import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "./components/ToastContainer";

export const metadata: Metadata = {
  title: "aergus",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-aergus-bg text-aergus-text">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

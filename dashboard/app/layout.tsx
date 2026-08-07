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
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('aergus-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-aergus-bg text-aergus-text">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

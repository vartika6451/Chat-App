import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Blink | Connect & Create",
  description: "Blink is a modern messaging platform where conversations become memories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&family=Great+Vibes&family=Alex+Brush&display=swap" rel="stylesheet" />
        <link rel="preload" href="/logo_open.png?v=4" as="image" />
        <link rel="preload" href="/logo.png?v=4" as="image" />
      </head>
      <body className="antialiased bg-brand-bg text-white">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#18181B",
                color: "#FFFFFF",
                border: "1px solid #27272A",
                borderRadius: "12px",
                fontSize: "13px",
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

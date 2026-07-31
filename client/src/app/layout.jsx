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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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

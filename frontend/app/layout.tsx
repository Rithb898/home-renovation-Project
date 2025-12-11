import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Huelip Renovations",
  description: "Modern home renovations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}

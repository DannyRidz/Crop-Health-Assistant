import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crop Health Assistant",
  description: "A coffee leaf screening prototype for coffee farmers worldwide, with PNG users as the first planned validation group.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

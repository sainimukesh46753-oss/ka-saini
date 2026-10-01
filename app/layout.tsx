import type { Metadata } from "next";
import "./globals.css";
import StoreShell from "./store-shell";
export const metadata: Metadata={title:"KA-SAINI | Online Shopping",description:"A modern Indian marketplace for fashion, electronics, beauty and more."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><StoreShell>{children}</StoreShell></body></html>}
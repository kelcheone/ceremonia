import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/components/Web3Provider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ceremonia",
  description: "Run DKG ceremonies without the hassle of docker and CLI tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={metadata.description ?? ""} />
        <title>
          {typeof metadata.title === "string" ? metadata.title : ""}
        </title>
      </Head>
      <script
        defer
        data-domain="ceremonia.kelche.co"
        src="https://plausible.kelche.co/js/script.js"
      ></script>
      <body data-theme="dark" className={inter.className}>
        <Web3Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

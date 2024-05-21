import "./globals.css";
import Head from "next/head";

export const metadata = {
  title: "2537 assignment 3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}

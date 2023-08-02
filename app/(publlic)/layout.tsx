import Link from "next/link";
import { ReactNode } from "react";


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head />
        <body>
        <h1>Header</h1>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            <li>
              <Link href="/tp-admin">Login</Link>
            </li>
            <li>
              <Link href="/tp-panel">Panel</Link>
            </li>
          </ul>
        </nav>
        <hr />
        {children}
      </body>
    </html>
  );
}

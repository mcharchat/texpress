import type { Metadata } from "next";
// These styles apply to every route in the application
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: "TextPress",
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			{children}
		</>
	);
}

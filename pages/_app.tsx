import { ThemeProvider } from "@material-tailwind/react";
import { AnimatePresence } from "framer-motion";

// Define types for the props of MyApp component
interface MyAppProps {
	Component: React.ElementType;
	pageProps: any; // You can specify a more specific type for pageProps if needed
}

export default function MyApp({ Component, pageProps }: MyAppProps) {
	return (
		<AnimatePresence mode='wait' initial={false}>
			<ThemeProvider>
				<Component {...pageProps} />
			</ThemeProvider>
		</AnimatePresence>
	);
}

"use client";

import TexPress from "@/app/pictures/svg/TexPress.svg";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transition from "@/app/Transition";
import { ReactNode } from "react";

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	const pathname = usePathname();
	const BottomLink = () => {
		if (pathname === "/tp-admin") {
			return (
				<Link href='./tp-resetpass'>
					<Typography color='gray' className='font-normal'>
						Lost your Password?
					</Typography>
				</Link>
			);
		}
		return (
			<Link href='./tp-admin'>
				<Typography color='gray' className='font-normal'>
					Want to log in?
				</Typography>
			</Link>
		);
	};

	return (
		<html>
			<head />
			<body>
				<Transition>
					<div className='bg-blue-gray-100 h-screen flex justify-center items-center flex-col gap-4'>
						<Image
							className='w-20 h-20'
							src={TexPress}
							alt='TexPress'
							priority={true}
						/>
						<div className='flex flex-col gap-4'>
							{children}
							<div className='flex flex-col justify-start gap-4 text-sm mx-4'>
								<BottomLink />
								<Link href='./'>
									<Typography color='gray' className='font-normal'>
										← Go to blog
									</Typography>
								</Link>
							</div>
						</div>
					</div>
					<ToastContainer />
				</Transition>
			</body>
		</html>
	);
}

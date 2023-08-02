"use client";
import { Typography } from "@material-tailwind/react";
import Transition from "@/app/Transition";

export default function Page() {
	return (
		<>
			<Transition>
				<Typography variant='h3' color='blue-gray' textGradient>
					All users
				</Typography>
			</Transition>
		</>
	);
}

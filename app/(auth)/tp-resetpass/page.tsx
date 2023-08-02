"use client";
import { Card, CardBody } from "@material-tailwind/react";
import ResetPassForm from "./partials/ResetPassForm";
import SetPassForm from "./partials/SetPassForm";
import { useSearchParams } from "next/navigation";
import Transition from "@/app/Transition";

export default function Page() {
	const router = useSearchParams() as any;

	const hasResetToken = router.has("resetToken");

	const AuthForm = () => {
		if (hasResetToken) {
			return <SetPassForm />;
		}
		return <ResetPassForm />;
	};
	return (
		<>
			<Transition>
				<Card className='min-w-60 max-w-80 w-[100%]'>
					<CardBody>
						<AuthForm />
					</CardBody>
				</Card>
			</Transition>
		</>
	);
}

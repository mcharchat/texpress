"use client";
import { Card, CardBody } from "@material-tailwind/react";
import SignInForm from "./partials/SignInForm";
import SignUpForm from "./partials/SignUpForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";
import Transition from "@/app/Transition";
import Cookies from "js-cookie";
import validateJWT from "@/lib/utils/ValidateJwt";

const AuthForm = ({ setUser }: { setUser: (user: any) => void }) => {
	const [hasAdminUser, setHasAdminUser] = useState(true);
	useEffect(() => {
		const hasAdminUser = async () => {
			const XCSRFTOKEN = await encryptTimestamp();
			const hasAdminUser = await fetch("/api/auth/setup", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
				},
			})
				.then((res) => res.json())
				.then((data) => data.hasAdminUser);
			setHasAdminUser(hasAdminUser);
		};
		hasAdminUser();
	}, []);
	if (hasAdminUser) {
		return <SignInForm setUser={setUser} />;
	}
	return <SignUpForm setUser={setUser} />;
};

export default function Page({}) {
	const [user, setUser] = useState();
	const router = useRouter();
	useEffect(() => {
		const user = JSON.parse(Cookies.get("user") || "{}");
		if (user?.token) {
			const validated = async () => await validateJWT(user.token);
			validated().then((data) => {
				if (data) {
					// next navigate to /tp-panel route
					router.replace("/tp-panel", undefined);
				}
			});
		}
	}, [user, router]);
	useEffect(() => {
		const user = JSON.parse(Cookies.get("user") || "{}");
		if (user?.token) {
			const validated = async () => await validateJWT(user.token);
			validated().then((data) => {
				if (!data) {
					// remove user cookie
					Cookies.remove("user", { path: "/" });
				}
			});
		}
	}, []);
	return (
		<>
			<Transition>
				<Card className='min-w-60 max-w-80 w-[100%]'>
					<CardBody>
						<AuthForm setUser={setUser} />
					</CardBody>
				</Card>
			</Transition>
		</>
	);
}

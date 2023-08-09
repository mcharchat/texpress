import { Input, Button, Tooltip } from "@material-tailwind/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";

function SetPassForm() {
	const params = useSearchParams() as any;

	const router = useRouter();

	const resetToken = params.get("resetToken");

	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const XCSRFTOKEN = await encryptTimestamp();

		if (!password || !passwordConfirmation) {
			toast.info("Please fill all fields");
			return;
		}

		if (!passwordRegex.test(password)) {
			toast.info(
				`
        The password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.
        `
			);
			return;
		}

		if (password !== passwordConfirmation) {
			toast.info("Password and password confirmation must match");
			return;
		}

		fetch("/api/auth/forgot-pass", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				password,
				verifyCode: resetToken,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					toast.error(res.error);
				} else {
					toast.success(res.message);
					router.replace("/tp-admin", undefined);
				}
			});
	};

	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirmation, setShowPasswordConfirmation] =
		useState(false);
	return (
		<form className='grid gap-4' onSubmit={handleSubmit}>
			<h1 className='text-2xl font-bold text-center'>Reset Password</h1>
			<Tooltip
				content='Use at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
				placement='bottom'
			>
				<Input
					label='Password'
					type={showPassword ? "text" : "password"}
					required
					value={password}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setPassword(e.target.value)
					}
					success={password !== "" && passwordRegex.test(password)}
					error={password !== "" && !passwordRegex.test(password)}
					icon={
						showPassword ? (
							<Icon
								icon='heroicons:eye-slash'
								className='h-5 w-5 cursor-pointer'
								onClick={() => setShowPassword(!showPassword)}
							/>
						) : (
							<Icon
								icon='heroicons:eye'
								className='h-5 w-5 cursor-pointer'
								onClick={() => setShowPassword(!showPassword)}
							/>
						)
					}
				></Input>
			</Tooltip>
			<Input
				label='Password Confirmation'
				type={showPasswordConfirmation ? "text" : "password"}
				required
				value={passwordConfirmation}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setPasswordConfirmation(e.target.value)
				}
				success={
					passwordConfirmation !== "" && passwordConfirmation === password
				}
				error={passwordConfirmation !== "" && passwordConfirmation !== password}
				icon={
					showPasswordConfirmation ? (
						<Icon
							icon='heroicons:eye-slash'
							className='h-5 w-5 cursor-pointer'
							onClick={() =>
								setShowPasswordConfirmation(!showPasswordConfirmation)
							}
						/>
					) : (
						<Icon
							icon='heroicons:eye'
							className='h-5 w-5 cursor-pointer'
							onClick={() =>
								setShowPasswordConfirmation(!showPasswordConfirmation)
							}
						/>
					)
				}
			></Input>
			<Button color='blue' variant='gradient' fullWidth type='submit'>
				Reset Password
			</Button>
		</form>
	);
}

export default SetPassForm;

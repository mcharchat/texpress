import { Button, Checkbox, Input, Tooltip } from "@material-tailwind/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";
import { Icon } from "@iconify/react";

function SignInForm({ setUser }: { setUser: (user: any) => void }) {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
	const emailRegex = /\S+@\S+\.\S+/;
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const XCSRFTOKEN = await encryptTimestamp();

		if (!email || !password) {
			toast.info("Please fill all fields");
			return;
		}

		if (!emailRegex.test(email)) {
			toast.info("Please provide a valid email address");
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
		fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				email,
				password,
				rememberMe,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					toast.error(res.error);
				} else {
					setUser(res);
					toast.success("Signed In, redirecting...", {
						toastId: "loggedIn",
					});
				}
			});
	};
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form className='grid gap-4' onSubmit={handleSubmit}>
			<h1 className='text-2xl font-bold text-center'>Sign In</h1>
			<Input
				label='Email Address'
				type='email'
				required
				value={email}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setEmail(e.target.value)
				}
				success={email !== "" && emailRegex.test(email)}
				error={email !== "" && !emailRegex.test(email)}
			></Input>
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
			<div className='-ml-2.5'>
				<Checkbox
					label='Remember Me'
					checked={rememberMe}
					color='blue'
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setRememberMe(e.target.checked)
					}
				/>
			</div>
			<Button color='blue' variant='gradient' fullWidth type='submit'>
				Sign In
			</Button>
		</form>
	);
}

export default SignInForm;

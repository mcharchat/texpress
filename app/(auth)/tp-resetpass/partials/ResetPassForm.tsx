import { Input, Button } from "@material-tailwind/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";

function ResetPassForm({}) {
	const emailRegex = /\S+@\S+\.\S+/;
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const XCSRFTOKEN = await encryptTimestamp();

		if (!email) {
			toast.info("Please fill all fields");
			return;
		}

		if (!emailRegex.test(email)) {
			toast.info("Please provide a valid email address");
			return;
		}

		fetch("/api/auth/forgot-pass", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				email,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					toast.error(res.error);
				} else {
					toast.success(res.message);
				}
			});
	};
	const [email, setEmail] = useState("");
	return (
		<form className='grid gap-4' onSubmit={handleSubmit}>
			<h1 className='text-2xl font-bold text-center'>Send reset Email</h1>
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
			<Button variant='gradient' fullWidth type='submit'>
				Send reset Email
			</Button>
		</form>
	);
}

export default ResetPassForm;

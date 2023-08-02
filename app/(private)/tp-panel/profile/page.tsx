"use client";
import {
	Avatar,
	Button,
	Card,
	CardBody,
	Input,
	Textarea,
	Tooltip,
	Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Transition from "@/app/Transition";
import { ChangeEvent, useEffect, useState } from "react";
import md5 from "md5";
import { toast } from "react-toastify";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";
import DeleteAccountDialog from "./partials/DeleteAccountDialog";
import Cookies from "js-cookie";

export default function Page() {
	const [persDetForm, setPersDetForm] = useState<{
		name: string;
		email: string;
		bioInfo: string;
	}>({
		name: "",
		email: "",
		bioInfo: "",
	});
	const [firstImg, setFirstImg] = useState<string>("");
	const [img, setImg] = useState<string>("");
	const [passForm, setPassForm] = useState<{
		password: string;
		passwordConfirmation: string;
	}>({
		password: "",
		passwordConfirmation: "",
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showPasswordConfirmation, setShowPasswordConfirmation] =
		useState<boolean>(false);

	const [openDeleteAccountDialog, setopenDeleteAccountDialog] =
		useState<boolean>(false);

	const handleopenDeleteAccountDialog = () =>
		setopenDeleteAccountDialog(!openDeleteAccountDialog);

	const data = async () => {
		// fetch user details
		const XCSRFTOKEN = await encryptTimestamp();
		const userDetails = await fetch("/api/users/me", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});
		return userDetails.json();
	};

	const fetchUserData = async () => {
		try {
			const userData = await data();
			setPersDetForm({
				name: userData.name,
				email: userData.email,
				bioInfo: userData.bioInfo,
			});
			setImg(userData?.img || "");
			setFirstImg(userData?.img || "");
		} catch (error) {
			console.error(`
			Failure to load user data: ${error}
			`);
			toast.error(`
			Failure to load user data.
			`);
		}
	};
	const emailRegex = /\S+@\S+\.\S+/;
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
	const hashedEmail = md5(persDetForm.email.trim().toLowerCase());
	const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		if (e.target.files.length === 0) return;
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			setImg(reader.result as string);
		};
		reader.readAsDataURL(file);
	};
	useEffect(() => {
		if (img !== firstImg) {
			updateImg();
		}
	}, [img]);

	useEffect(() => {
		fetchUserData();
	}, []);

	const updatePersDet = async () => {
		const XCSRFTOKEN = await encryptTimestamp();
		if (!persDetForm.name || !persDetForm.email) {
			toast.info("Please fill all fields");
			return;
		}
		if (!emailRegex.test(persDetForm.email)) {
			toast.info("Please provide a valid email address");
			return;
		}
		fetch("/api/users/me", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				name: persDetForm.name,
				email: persDetForm.email,
				bioInfo: persDetForm.bioInfo,
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

	const updatePass = async () => {
		const XCSRFTOKEN = await encryptTimestamp();
		if (!passForm.password || !passForm.passwordConfirmation) {
			toast.info("Please fill all fields");
			return;
		}
		if (!passwordRegex.test(passForm.password)) {
			toast.info(
				"The password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character."
			);
			return;
		}
		if (passForm.password !== passForm.passwordConfirmation) {
			toast.info("Password and password confirmation must match");
			return;
		}
		fetch("/api/users/me", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				password: passForm.password,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					toast.error(res.error);
				} else {
					setPassForm({
						password: "",
						passwordConfirmation: "",
					});
					toast.success(res.message);
				}
			});
	};

	const updateImg = async () => {
		const XCSRFTOKEN = await encryptTimestamp();
		if (!img) {
			toast.info("Please select an image");
			return;
		}
		fetch("/api/users/me", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				img,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					toast.error(res.error);
				} else {
					toast.success("Profile picture updated successfully");
					setFirstImg(img);
				}
			});
	};

	const deleteAccount = async () => {
		const XCSRFTOKEN = await encryptTimestamp();
		fetch("/api/users/me", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		})
			.then((res) => res.json())
			.then((res) => {
				setopenDeleteAccountDialog(false);
				if (res.error) {
					toast.error(res.error);
				} else {
					toast.success(res.message);
					Cookies.remove("user", { path: "/" });
					window.location.href = "/";
				}
			});
	};

	return (
		<>
			<Transition>
				<div className='p-4 flex flex-col gap-3'>
					<Typography variant='h3' color='gray'>
						Profile
					</Typography>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<Card className='bg-gray-100 shadow-none'>
							<CardBody className='flex flex-col gap-6 grow'>
								<Typography variant='h4' color='gray'>
									Avatar
								</Typography>
								<div className='flex items-center justify-center grow relative'>
									<Avatar
										src={
											img ||
											`http://www.gravatar.com/avatar/${hashedEmail}?d=identicon`
										}
										alt='avatar'
										className='w-48 h-48'
									></Avatar>
									<input
										type='file'
										accept='image/*'
										onChange={uploadImage}
										className='absolute opacity-0 w-48 h-48 cursor-pointer rounded-full'
									/>
								</div>
							</CardBody>
						</Card>
						<Card className='bg-gray-100 shadow-none'>
							<CardBody className='flex flex-col gap-6'>
								<Typography variant='h4' color='gray'>
									Personal Details
								</Typography>
								<div className='grid grid-cols-1 gap-3'>
									<Input
										label='Name'
										required
										className='bg-white'
										value={persDetForm.name}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setPersDetForm({ ...persDetForm, name: e.target.value })
										}
										success={persDetForm.name !== ""}
									></Input>
									<Input
										label='Email Address'
										type='email'
										required
										className='bg-white'
										value={persDetForm.email}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setPersDetForm({ ...persDetForm, email: e.target.value })
										}
										success={
											persDetForm.email !== "" &&
											emailRegex.test(persDetForm.email)
										}
										error={
											persDetForm.email !== "" &&
											!emailRegex.test(persDetForm.email)
										}
									></Input>
									<Textarea
										className='bg-white'
										label='Biographical Information'
										value={persDetForm.bioInfo}
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
											setPersDetForm({
												...persDetForm,
												bioInfo: e.target.value,
											})
										}
										success={persDetForm.bioInfo !== ""}
									></Textarea>
								</div>
								<div className='flex justify-start gap-3'>
									<Button variant='gradient' onClick={updatePersDet}>
										Update
									</Button>
								</div>
							</CardBody>
						</Card>
						<Card className='bg-gray-100 shadow-none'>
							<CardBody className='flex flex-col gap-6'>
								<Typography variant='h4' color='gray'>
									Password
								</Typography>
								<div className='grid grid-cols-1 gap-3'>
									<Tooltip
										content='Use at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
										placement='bottom'
									>
										<Input
											className='bg-white'
											label='Password'
											type={showPassword ? "text" : "password"}
											required
											value={passForm.password}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												setPassForm({ ...passForm, password: e.target.value })
											}
											success={
												passForm.password !== "" &&
												passwordRegex.test(passForm.password)
											}
											error={
												passForm.password !== "" &&
												!passwordRegex.test(passForm.password)
											}
											icon={
												showPassword ? (
													<EyeSlashIcon
														className='h-5 w-5 cursor-pointer'
														onClick={() => setShowPassword(!showPassword)}
													/>
												) : (
													<EyeIcon
														className='h-5 w-5 cursor-pointer'
														onClick={() => setShowPassword(!showPassword)}
													/>
												)
											}
										></Input>
									</Tooltip>
									<Input
										className='bg-white'
										label='Password Confirmation'
										type={showPasswordConfirmation ? "text" : "password"}
										required
										value={passForm.passwordConfirmation}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setPassForm({
												...passForm,
												passwordConfirmation: e.target.value,
											})
										}
										success={
											passForm.passwordConfirmation !== "" &&
											passForm.passwordConfirmation === passForm.password
										}
										error={
											passForm.passwordConfirmation !== "" &&
											passForm.passwordConfirmation !== passForm.password
										}
										icon={
											showPasswordConfirmation ? (
												<EyeSlashIcon
													className='h-5 w-5 cursor-pointer'
													onClick={() =>
														setShowPasswordConfirmation(
															!showPasswordConfirmation
														)
													}
												/>
											) : (
												<EyeIcon
													className='h-5 w-5 cursor-pointer'
													onClick={() =>
														setShowPasswordConfirmation(
															!showPasswordConfirmation
														)
													}
												/>
											)
										}
									></Input>
								</div>
								<div className='flex justify-start gap-3'>
									<Button variant='gradient' onClick={updatePass}>
										Update
									</Button>
								</div>
							</CardBody>
						</Card>
						<Card className='bg-gray-100 shadow-none'>
							<CardBody className='flex flex-col gap-6 grow'>
								<Typography variant='h4' color='gray'>
									Delete Account
								</Typography>
								<div className='flex items-end grow'>
									<Button
										color='red'
										variant='gradient'
										onClick={handleopenDeleteAccountDialog}
									>
										Delete
									</Button>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
				<DeleteAccountDialog
					openDeleteAccountDialog={openDeleteAccountDialog}
					handleopenDeleteAccountDialog={handleopenDeleteAccountDialog}
					deleteAccount={deleteAccount}
				/>
			</Transition>
		</>
	);
}

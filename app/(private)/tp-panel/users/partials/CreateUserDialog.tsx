import React, { useState } from "react";
import {
	Button,
	Chip,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	IconButton,
	Input,
	Option,
	Select,
	Textarea,
	Tooltip,
	Typography,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import User from "@/lib/types/User";
import { colors } from "@material-tailwind/react/types/generic";
import { Icon } from "@iconify/react";

export default function CreateUserDialog({
	openCreateUserDialog,
	handleopenCreateUserDialog,
	createUser,
	allRoles,
}: {
	openCreateUserDialog: boolean;
	handleopenCreateUserDialog: () => void;
	createUser: (userData: User) => void;
	allRoles: string[];
}) {
	const blankUserData = {
		name: "",
		email: "",
		role: "",
		isActive: true,
	};
	const [userData, setUserData] = useState<User>(blankUserData as User);

	const handleSaveUser = async () => {
		validateForm()
			.then((res) => {
				createUser(userData);
				setUserData(blankUserData as User);
			})
			.catch((err) => {
				toast.error(err);
				return;
			});
		handleopenCreateUserDialog();
	};

	const validateForm = async () => {
		const requiredFields = ["name", "email", "role", "isActive"];
		return new Promise((resolve, reject) => {
			// based on each one of required field, check if it is filled
			const emptyFields = requiredFields.filter(
				(field) => !(userData as any)[field]
			);
			if (emptyFields.length > 0) {
				reject(`Required fields cannot be empty: ${emptyFields.join(", ")}`);
			}
			resolve(true);
		});
	};

	return (
		<Dialog
			open={openCreateUserDialog}
			handler={handleopenCreateUserDialog}
			size='xxl'
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					New user
				</Typography>
			</DialogHeader>
			<DialogBody
				divider
				className='bg-white h-[calc(100vh-30px)] overflow-y-scroll custom-scroll custom-y-scroll'
			>
				<div className='flex flex-col gap-4'>
					<Input
						label='Name'
						type='text'
						required
						value={userData?.name}
						onChange={(e) => {
							setUserData({
								...userData,
								name: e.target.value,
							});
						}}
					></Input>
					<Input
						label='Email'
						type='email'
						required
						value={userData?.email}
						onChange={(e) => {
							setUserData({
								...userData,
								email: e.target.value,
							});
						}}
					></Input>
					<Select
						label='Role'
						value={userData?.role || ""}
						onChange={(e) => {
							setUserData({
								...userData,
								role: e as string,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						{allRoles.map((role, index) => (
							<Option
								key={index}
								value={index.toString()}
								className='flex items-center gap-2'
							>
								{role}
							</Option>
						))}
					</Select>
					<Select
						label='Status'
						value={userData?.isActive ? "1" : "0" || ""}
						onChange={(e) => {
							setUserData({
								...userData,
								isActive: e === "1" ? true : false,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						<Option value='1'>
							<Chip
								variant='ghost'
								size='sm'
								color='green'
								value='Active'
								className='w-max transition-all'
							/>
						</Option>
						<Option value='0'>
							<Chip
								variant='ghost'
								size='sm'
								color='red'
								value='Inactive'
								className='w-max transition-all'
							/>
						</Option>
					</Select>
				</div>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenCreateUserDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button variant='gradient' color='green' onClick={handleSaveUser}>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

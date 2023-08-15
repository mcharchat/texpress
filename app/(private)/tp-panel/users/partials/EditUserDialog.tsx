import React, { useEffect, useState } from "react";
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
import TableRow from "@/lib/types/User";
import { toast } from "react-toastify";
import User from "@/lib/types/User";
import { colors } from "@material-tailwind/react/types/generic";
import { Icon } from "@iconify/react";

export default function EditUserDialog({
	openEditUserDialog,
	handleopenEditUserDialog,
	editUser,
	allRoles,
}: {
	openEditUserDialog: {
		open: boolean;
		userDetails: TableRow | null;
	};
	handleopenEditUserDialog: () => void;
	editUser: (userData: User) => void;
	allRoles: string[];
}) {
	const [userData, setUserData] = useState<Partial<TableRow> | null>(
		openEditUserDialog.userDetails
	);

	useEffect(() => {
		setUserData({
			...openEditUserDialog.userDetails,
			role: openEditUserDialog.userDetails?.role?.toString(),
		});
	}, [openEditUserDialog.userDetails]);

	const handleSaveUser = async () => {
		validateForm()
			.then((res) => {
				editUser(userData as User);
			})
			.catch((err) => {
				toast.error(err);
				return;
			});
		handleopenEditUserDialog();
	};

	const validateForm = async () => {
		const requiredFields = ["name", "email", "role"];
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
			open={openEditUserDialog.open}
			handler={handleopenEditUserDialog}
			size='xxl'
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Edit user
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
						value={userData?.name || ""}
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
						value={userData?.email || ""}
						onChange={(e) => {
							setUserData({
								...userData,
								email: e.target.value,
							});
						}}
					></Input>
					<Select
						label='Role'
						value={
							userData?.hasOwnProperty("role") ? userData?.role?.toString() : ""
						}
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
						value={userData?.isActive ? "1" : "0"}
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
					onClick={handleopenEditUserDialog}
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

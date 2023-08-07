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
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Tag from "@/lib/types/Tag";
import { colors } from "@material-tailwind/react/types/generic";

export default function CreateTagDialog({
	openCreateTagDialog,
	handleopenCreateTagDialog,
	createTag,
	allCollors,
}: {
	openCreateTagDialog: boolean;
	handleopenCreateTagDialog: () => void;
	createTag: (tagData: Tag) => void;
	allCollors: string[];
}) {
	const blankTagData = {
		name: "",
		slug: "",
		description: "",
		color: "",
	};
	const [tagData, setTagData] = useState<Tag>(blankTagData as Tag);
	const [generating, setGenerating] = useState({
		slug: false,
	});

	const generateSlug = () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			slug: true,
		}));
		setTagData((prevData: Tag) => ({
			...prevData,
			slug: prevData?.name
				?.normalize("NFD")
				.toLowerCase()
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/[^\w-]+/g, "-")
				.replace(/^-+|-+$/g, ""),
		}));
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			slug: false,
		}));
	};

	const handleSaveTag = async () => {
		validateForm()
			.then((res) => {
				createTag(tagData);
				setTagData(blankTagData as Tag);
			})
			.catch((err) => {
				toast.error(err);
				return;
			});
		handleopenCreateTagDialog();
	};

	const validateForm = async () => {
		const requiredFields = ["name", "slug"];
		return new Promise((resolve, reject) => {
			// based on each one of required field, check if it is filled
			const emptyFields = requiredFields.filter(
				(field) => !(tagData as any)[field]
			);
			if (emptyFields.length > 0) {
				reject(`Required fields cannot be empty: ${emptyFields.join(", ")}`);
			}
			resolve(true);
		});
	};

	return (
		<Dialog
			open={openCreateTagDialog}
			handler={handleopenCreateTagDialog}
			size='xxl'
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					New post
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
						value={tagData?.name}
						onChange={(e) => {
							setTagData({
								...tagData,
								name: e.target.value,
							});
						}}
					></Input>
					<Input
						label='Slug'
						type='text'
						required
						value={tagData?.slug}
						onChange={(e) => {
							setTagData({
								...tagData,
								slug: e.target.value,
							});
						}}
						icon={
							<Tooltip
								content={`${
									generating.slug ? "Generating slug" : "Generate slug"
								}`}
								className='z-[9999]'
							>
								<IconButton
									variant='text'
									color='blue-gray'
									className='h-5 w-5 transition-all'
									onClick={() => {
										generateSlug();
									}}
									disabled={generating.slug}
								>
									<ArrowPathIcon
										className={`h-3 w-3 transition-all hover:rotate-[720deg] ease-in-out duration-1000 ${
											generating.slug ? "animate-spin" : ""
										}`}
									/>
								</IconButton>
							</Tooltip>
						}
					></Input>
					<Select
						label='Color'
						value={tagData?.color || ""}
						onChange={(e) => {
							setTagData({
								...tagData,
								color: e as string,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						{allCollors.map((color) => (
							<Option
								key={color}
								value={color}
								className='flex items-center gap-2'
							>
								<Chip
									variant='ghost'
									size='sm'
									value={color}
									color={color as colors}
									className='w-max transition-all'
								/>
							</Option>
						))}
					</Select>
					<div>
						<Textarea
							label='Description'
							value={tagData?.description}
							onChange={(e) => {
								setTagData({
									...tagData,
									description: e.target.value,
								});
							}}
						/>
					</div>
				</div>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenCreateTagDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button variant='gradient' color='green' onClick={handleSaveTag}>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

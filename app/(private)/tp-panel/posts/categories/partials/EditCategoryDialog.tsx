import React, { useEffect, useState } from "react";
import {
	Button,
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
import TableRow from "@/lib/types/Category";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Category from "@/lib/types/Category";

export default function EditCategoryDialog({
	openEditCategoryDialog,
	handleopenEditCategoryDialog,
	editCategory,
	allCategories,
}: {
	openEditCategoryDialog: {
		open: boolean;
		categoryDetails: TableRow | null;
	};
	handleopenEditCategoryDialog: () => void;
	editCategory: (categoryData: Category) => void;
	allCategories: TableRow[];
}) {
	const [categoryData, setCategoryData] = useState<Partial<TableRow> | null>(
		openEditCategoryDialog.categoryDetails
	);

	useEffect(() => {
		setCategoryData(openEditCategoryDialog.categoryDetails);
	}, [openEditCategoryDialog.categoryDetails]);
	const [generating, setGenerating] = useState({
		slug: false,
	});

	const generateSlug = () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			slug: true,
		}));
		setCategoryData((prevData) => ({
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

	const handleSaveCategory = async () => {
		validateForm()
			.then((res) => {
				editCategory(categoryData as Category);
			})
			.catch((err) => {
				toast.error(err);
				return;
			});
		handleopenEditCategoryDialog();
	};

	const validateForm = async () => {
		const requiredFields = ["name", "slug"];
		return new Promise((resolve, reject) => {
			// based on each one of required field, check if it is filled
			const emptyFields = requiredFields.filter(
				(field) => !(categoryData as any)[field]
			);
			if (emptyFields.length > 0) {
				reject(`Required fields cannot be empty: ${emptyFields.join(", ")}`);
			}
			resolve(true);
		});
	};

	return (
		<Dialog
			open={openEditCategoryDialog.open}
			handler={handleopenEditCategoryDialog}
			size='xxl'
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Edit post
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
						value={categoryData?.name || ""}
						onChange={(e) => {
							setCategoryData({
								...categoryData,
								name: e.target.value,
							});
						}}
					></Input>
					<Input
						label='Slug'
						type='text'
						required
						value={categoryData?.slug || ""}
						onChange={(e) => {
							setCategoryData({
								...categoryData,
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
						label='Parent'
						value={categoryData?.parent?.id || ""}
						onChange={(e) => {
							setCategoryData({
								...categoryData,
								parent:
									allCategories.find((category) => category.id === e) || null,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						{[
							<Option key='0' value=''>
								No parent
							</Option>,
							...allCategories.filter((category) => categoryData?._id !== category?._id).map((category) => (
								<Option key={category.id} value={category.id}>
									{category.name}
								</Option>
							)),
						]}
					</Select>
					<div>
						<Textarea
							label='Description'
							value={categoryData?.description}
							onChange={(e) => {
								setCategoryData({
									...categoryData,
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
					onClick={handleopenEditCategoryDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button variant='gradient' color='green' onClick={handleSaveCategory}>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

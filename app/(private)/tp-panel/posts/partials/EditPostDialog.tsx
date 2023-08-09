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
import MenuWithCheckbox from "./MenuWithCheckbox";
import TableRow from "@/lib/types/TableRow";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import Tag from "@/lib/types/Tag";
import Category from "@/lib/types/Category";
import PostData from "@/lib/types/PostData";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";
import { Icon } from "@iconify/react";

export default function EditPostDialog({
	openEditPostDialog,
	handleopenEditPostDialog,
	editPost,
	categories,
	tags,
}: {
	openEditPostDialog: {
		open: boolean;
		postDetails: TableRow | null;
	};
	handleopenEditPostDialog: () => void;
	editPost: (postData: PostData) => void;
	categories: Category[];
	tags: Tag[];
}) {
	const [postData, setPostData] = useState<Partial<TableRow> | null>(
		openEditPostDialog.postDetails
	);
	const [generating, setGenerating] = useState({
		title: false,
		subtitle: false,
		slug: false,
		content: false,
		metaDescription: false,
	});

	const [quill, setQuill] = useState<string | null | undefined>(
		postData?.content
	);

	useEffect(() => {
		setPostData((prevData) => ({
			...prevData,
			content: quill as string,
		}));
	}, [quill]);

	useEffect(() => {
		setPostData(openEditPostDialog.postDetails);
		setQuill(openEditPostDialog.postDetails?.content);
	}, [openEditPostDialog.postDetails]);

	const generateSlug = () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			slug: true,
		}));
		setPostData((prevData) => ({
			...prevData,
			slug: prevData?.title
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

	const handleSavePost = async () => {
		validateForm()
			.then((res) => {
				editPost(postData as PostData);
			})
			.catch((err) => {
				toast.error(err);
				return;
			});
		handleopenEditPostDialog();
	};

	const setCategories = (selectedCategories: string[]) => {
		setPostData((prevData) => ({
			...prevData,
			categories: categories.filter((category) =>
				selectedCategories.includes(category.id)
			),
		}));
	};

	const setTags = (selectedTags: string[]) => {
		setPostData((prevData) => ({
			...prevData,
			tags: tags.filter((tag) => selectedTags.includes(tag.id)),
		}));
	};

	const [categoryOptions, setCategoryOptions] = useState<
		{
			id: string;
			label: string;
		}[]
	>([]);
	const [tagOptions, setTagOptions] = useState<
		{
			id: string;
			label: string;
		}[]
	>([]);
	useEffect(() => {
		setCategoryOptions(
			categories?.map((category) => ({
				id: category.id,
				label: category.name,
			}))
		);
	}, [categories]);
	useEffect(() => {
		setTagOptions(
			tags?.map((tag) => ({
				id: tag.id,
				label: tag.name,
			}))
		);
	}, [tags]);

	const generatePost = async () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			content: true,
		}));
		// generate XCSRFTOKEN
		const XCSRFTOKEN = await encryptTimestamp();
		// make request to api to generate post
		const res = await fetch("/api/posts/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				fieldName: "content",
				startContent: postData?.content,
				relativeContent: postData?.title,
			}),
		});
		const data = await res.json();

		// set the content of the post to the generated content
		setQuill(data.message.content);

		setGenerating((prevGenerating) => ({
			...prevGenerating,
			content: false,
		}));
	};

	const generateSubtitle = async () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			subtitle: true,
		}));
		// generate XCSRFTOKEN
		const XCSRFTOKEN = await encryptTimestamp();
		// make request to api to generate post
		const res = await fetch("/api/posts/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				fieldName: "subtitle",
				startContent: postData?.subtitle,
				relativeContent: postData?.title,
			}),
		});
		const data = await res.json();

		// set the subtitle of the post to the generated subtitle
		setPostData((prevData) => ({
			...prevData,
			subtitle: `${JSON.parse(data.message.content)}`,
		}));

		setGenerating((prevGenerating) => ({
			...prevGenerating,
			subtitle: false,
		}));
	};

	const generateTitle = async () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			title: true,
		}));
		// generate XCSRFTOKEN
		const XCSRFTOKEN = await encryptTimestamp();
		// make request to api to generate post
		const res = await fetch("/api/posts/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				fieldName: "title",
				startContent: "",
				relativeContent: "",
			}),
		});
		const data = await res.json();

		// set the title of the post to the generated title
		setPostData((prevData) => ({
			...prevData,
			title: `${JSON.parse(data.message.content)}`,
		}));

		setGenerating((prevGenerating) => ({
			...prevGenerating,
			title: false,
		}));
	};

	const generateMetaDescription = async () => {
		setGenerating((prevGenerating) => ({
			...prevGenerating,
			metaDescription: true,
		}));
		// generate XCSRFTOKEN
		const XCSRFTOKEN = await encryptTimestamp();
		// make request to api to generate post
		const res = await fetch("/api/posts/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify({
				fieldName: "metaDescription",
				startContent: "",
				relativeContent: postData?.content,
			}),
		});
		const data = await res.json();

		// set the metaDescription of the post to the generated metaDescription
		setPostData((prevData) => ({
			...prevData,
			metaDescription: `${data.message.content}`,
		}));

		setGenerating((prevGenerating) => ({
			...prevGenerating,
			metaDescription: false,
		}));
	};

	const validateForm = async () => {
		const requiredFields = ["title", "slug", "content"];
		return new Promise((resolve, reject) => {
			// based on each one of required field, check if it is filled
			const emptyFields = requiredFields.filter(
				(field) => !(postData as any)[field]
			);
			if (emptyFields.length > 0) {
				reject(`Required fields cannot be empty: ${emptyFields.join(", ")}`);
			}
			resolve(true);
		});
	};

	return (
		<Dialog
			open={openEditPostDialog.open}
			handler={handleopenEditPostDialog}
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
						label='Title'
						type='text'
						required
						value={postData?.title || ""}
						onChange={(e) => {
							setPostData({
								...postData,
								title: e.target.value,
							});
						}}
						icon={
							<Tooltip
								content={`${
									generating.title ? "Generating title" : "Generate title"
								}`}
								className='z-[9999]'
							>
								<IconButton
									variant='text'
									color='blue-gray'
									className='h-5 w-5 transition-all'
									onClick={() => {
										generateTitle();
									}}
									disabled={generating.title}
								>
									<Icon
										icon='ri:openai-fill'
										className={`h-4 w-4 transition-all hover:rotate-[720deg] ease-in-out duration-1000 ${
											generating.title ? "animate-spin" : ""
										}`}
									/>
								</IconButton>
							</Tooltip>
						}
					></Input>
					<Input
						label='Subtitle'
						type='text'
						value={postData?.subtitle || ""}
						onChange={(e) => {
							setPostData({
								...postData,
								subtitle: e.target.value,
							});
						}}
						icon={
							<Tooltip
								content={`${
									generating.subtitle
										? "Generating subtitle"
										: "Generate subtitle"
								}`}
								className='z-[9999]'
							>
								<IconButton
									variant='text'
									color='blue-gray'
									className='h-5 w-5 transition-all'
									onClick={() => {
										generateSubtitle();
									}}
									disabled={generating.subtitle}
								>
									<Icon
										icon='ri:openai-fill'
										className={`h-4 w-4 transition-all hover:rotate-[720deg] ease-in-out duration-1000 ${
											generating.subtitle ? "animate-spin" : ""
										}`}
									/>
								</IconButton>
							</Tooltip>
						}
					></Input>
					<Input
						label='Slug'
						type='text'
						required
						value={postData?.slug || ""}
						onChange={(e) => {
							setPostData({
								...postData,
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
									<Icon icon="heroicons:arrow-path"
										className={`h-3 w-3 transition-all hover:rotate-[720deg] ease-in-out duration-1000 ${
											generating.slug ? "animate-spin" : ""
										}`}
									/>
								</IconButton>
							</Tooltip>
						}
					></Input>
					<Select
						label='State'
						value={postData?.state || ""}
						onChange={(e) => {
							setPostData({
								...postData,
								state: e as string,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						<Option value='published'>Published</Option>
						<Option value='drafted'>Drafted</Option>
						<Option value='archived'>Archived</Option>
						<Option value='trashed'>Trashed</Option>
					</Select>
					<MenuWithCheckbox
						label='Categories'
						options={categoryOptions}
						selectedOptions={
							postData?.categories?.map((category) => category.id) || []
						}
						setSelectedOptions={setCategories}
					/>
					<MenuWithCheckbox
						label='Tags'
						options={tagOptions}
						selectedOptions={postData?.tags?.map((tag) => tag.id) || []}
						setSelectedOptions={setTags}
					/>

					<Select
						label='Public'
						value={postData?.isPublic ? "true" : "false"}
						onChange={(e) => {
							setPostData({
								...postData,
								isPublic: e === "true" ? true : false,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						<Option value='true'>Yes</Option>
						<Option value='false'>No</Option>
					</Select>
					<div>
						<label className='leading-tight font-normal text-[11px] relative'>
							<div className='absolute mx-2.5 px-1 top-[-6px] bg-white'>
								Content
							</div>
						</label>
						<ReactQuill
							theme='snow'
							value={quill || ""}
							onChange={(value) => {
								setQuill(value);
							}}
							modules={{
								toolbar: [
									["bold", "italic", "underline", "strike"], // toggled buttons
									["blockquote", "code-block"],
									["link", "image", "video"],

									[{ header: 1 }, { header: 2 }], // custom button values
									[{ list: "ordered" }, { list: "bullet" }],
									[{ script: "sub" }, { script: "super" }], // superscript/subscript
									[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
									[{ direction: "rtl" }], // text direction

									[{ size: ["small", false, "large", "huge"] }], // custom dropdown
									[{ header: [1, 2, 3, 4, 5, 6, false] }],

									[{ color: [] }, { background: [] }], // dropdown with defaults from theme
									[{ font: [] }],
									[{ align: [] }],

									["clean"], // remove formatting button
								],
							}}
						/>
						<div className='relative flex grow justify-end'>
							<Tooltip
								content={`${
									generating.content ? "Generating post" : "Generate post"
								}`}
								className='z-[9999]'
							>
								<IconButton
									variant='text'
									color='blue-gray'
									className='h-5 w-5 transition-all absolute top-[-24px] right-[4px]'
									onClick={() => {
										generatePost();
									}}
									disabled={generating.content}
								>
									<Icon
										icon='ri:openai-fill'
										className={`h-4 w-4 transition-all hover:rotate-[720deg] ease-in-out duration-1000 ${
											generating.content ? "animate-spin" : ""
										}`}
									/>
								</IconButton>
							</Tooltip>
						</div>
					</div>
					<div>
						<Textarea
							label='Meta description'
							value={postData?.metaDescription}
							onChange={(e) => {
								setPostData({
									...postData,
									metaDescription: e.target.value,
								});
							}}
						/>
						<div className='relative flex grow justify-end'>
							<Tooltip
								content={`${
									generating.metaDescription
										? "Generating meta description"
										: "Generate meta description"
								}`}
								className='z-[9999]'
							>
								<IconButton
									variant='text'
									color='blue-gray'
									className='h-5 w-5 transition-all absolute top-[-32px] right-[4px]'
									onClick={() => {
										generateMetaDescription();
									}}
									disabled={generating.metaDescription}
								>
									<Icon
										icon='ri:openai-fill'
										className={`h-4 w-4 transition-all hover:rotate-[720deg] ease-in-out duration-1000 ${
											generating.metaDescription ? "animate-spin" : ""
										}`}
									/>
								</IconButton>
							</Tooltip>
						</div>
					</div>
				</div>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenEditPostDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button variant='gradient' color='green' onClick={handleSavePost}>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

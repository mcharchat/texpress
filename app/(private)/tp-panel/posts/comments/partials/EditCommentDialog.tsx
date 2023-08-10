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
import TableRow from "@/lib/types/Comment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import Tag from "@/lib/types/Tag";
import Category from "@/lib/types/Category";
import CommentData from "@/lib/types/Comment";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";
import { Icon } from "@iconify/react";

export default function EditCommentDialog({
	openEditCommentDialog,
	handleopenEditCommentDialog,
	editComment,
}: {
	openEditCommentDialog: {
		open: boolean;
		commentDetails: TableRow | null;
	};
	handleopenEditCommentDialog: () => void;
	editComment: (commentData: CommentData) => void;
}) {
	const [commentData, setCommentData] = useState<Partial<TableRow> | null>(
		openEditCommentDialog.commentDetails
	);

	const [quill, setQuill] = useState<string | null | undefined>(
		commentData?.content
	);

	useEffect(() => {
		setCommentData((prevData) => ({
			...prevData,
			content: quill as string,
		}));
	}, [quill]);

	useEffect(() => {
		setCommentData(openEditCommentDialog.commentDetails);
		setQuill(openEditCommentDialog.commentDetails?.content);
	}, [openEditCommentDialog.commentDetails]);

	const handleSaveComment = async () => {
		validateForm()
			.then((res) => {
				editComment(commentData as CommentData);
			})
			.catch((err) => {
				toast.error(err);
				return;
			});
		handleopenEditCommentDialog();
	};

	const validateForm = async () => {
		const requiredFields = ["state", "content"];
		return new Promise((resolve, reject) => {
			// based on each one of required field, check if it is filled
			const emptyFields = requiredFields.filter(
				(field) => !(commentData as any)[field]
			);
			if (emptyFields.length > 0) {
				reject(`Required fields cannot be empty: ${emptyFields.join(", ")}`);
			}
			resolve(true);
		});
	};

	return (
		<Dialog
			open={openEditCommentDialog.open}
			handler={handleopenEditCommentDialog}
			size='xxl'
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Edit comment
				</Typography>
			</DialogHeader>
			<DialogBody
				divider
				className='bg-white h-[calc(100vh-30px)] overflow-y-scroll custom-scroll custom-y-scroll'
			>
				<div className='flex flex-col gap-4'>
					<Select
						label='State'
						value={commentData?.state || ""}
						onChange={(e) => {
							setCommentData({
								...commentData,
								state: e as string,
							});
						}}
						menuProps={{
							className: "flex flex-col gap-1",
						}}
						arrow={false}
					>
						<Option value='approved'>Approved</Option>
						<Option value='pending'>Pending</Option>
						<Option value='spam'>Spam</Option>
						<Option value='trashed'>Trashed</Option>
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
					</div>
				</div>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenEditCommentDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button variant='gradient' color='green' onClick={handleSaveComment}>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

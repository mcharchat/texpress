"use client";
import { faker } from "@faker-js/faker";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import CommentsFooter from "./partials/CommentsFooter";
import CommentsHeader from "./partials/CommentsHeader";
import TableRow from "@/lib/types/Comment";
import CommentsBody from "./partials/CommentsBody";
import Transition from "@/app/Transition";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";

export default function Page() {
	const [loadingBody, setLoadingBody] = useState<boolean>(true);

	const [tabs, setTabs] = useState<{ label: string; value: string }[]>([
		{
			label: "All",
			value: "all",
		},
		{
			label: "Approved",
			value: "approved",
		},
		{
			label: "Pending",
			value: "pending",
		},
		{
			label: "Spam",
			value: "spam",
		},
		{
			label: "Trashed",
			value: "trashed",
		},
	]);
	const stateColorDict: {
		[key: string]: string;
	} = {
		approved: "light-green",
		pending: "yellow",
		spam: "brown",
		trashed: "deep-orange",
	};

	const [tableHead, setTableHead] = useState<string[]>([
		"Author",
		"Content",
		"In response to",
		"Date",
		"",
	]);

	const tableHeadDict: {
		[key: string]: string;
	} = {
		Author: "author.name",
		Content: "content",
		"In response to": "parent.content",
		Date: "createdAt",
	};

	const [tableRows, setTableRows] = useState<TableRow[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [tags, setTags] = useState<any[]>([]);

	const [filteredData, setFilteredData] = useState<TableRow[]>(tableRows);

	const [totalPages, setTotalPages] = useState<number>(
		Math.ceil(tableRows.length / 5)
	);

	const [inputElement, setInputElement] = useState<string>("");

	const inputElementRef = useRef<HTMLInputElement>(null);
	const tabsElementRef = useRef<HTMLDivElement>(null);

	const [tabsValue, setTabsValue] = useState<string>("all");

	const [selectedPage, setSelectedPage] = useState<number>(0);

	const [sortField, setSortField] = useState<string>("createdAt");
	const [sortDirection, setSortDirection] = useState<string>("asc");

	useEffect(() => {
		const sortedData = (data: TableRow[]) => {
			const returnedData = data.sort((a: any, b: any) => {
				const sortFieldArray = sortField.split(".");
				let aSortField = a;
				let bSortField = b;
				sortFieldArray.forEach((field) => {
					if (aSortField) {
						if (aSortField[field]) {
							aSortField = aSortField[field];
						} else {
							aSortField =
								a[
									sortField
										.split(".")
										.map((word, index) =>
											index === 0
												? word
												: word.charAt(0).toUpperCase() + word.slice(1)
										)
										.join("")
								] || "";
						}
					}
					if (bSortField) {
						if (bSortField[field]) {
							bSortField = bSortField[field];
						} else {
							bSortField =
								b[
									sortField
										.split(".")
										.map((word, index) =>
											index === 0
												? word
												: word.charAt(0).toUpperCase() + word.slice(1)
										)
										.join("")
								] || "";
						}
					}
				});
				if (sortDirection === "asc") {
					if (aSortField < bSortField) {
						return -1;
					}
					if (aSortField > bSortField) {
						return 1;
					}
					return 0;
				} else {
					if (aSortField < bSortField) {
						return 1;
					}
					if (aSortField > bSortField) {
						return -1;
					}
					return 0;
				}
			});
			return returnedData;
		};
		if (inputElement || tabsValue) {
			let filteredData = tableRows.filter((row) => {
				let authorName;
				let authorEmail;
				if (row?.author?.name) {
					authorName = row.author.name;
					authorEmail = row.author.email;
				} else {
					authorName = row.authorName;
					authorEmail = row.authorEmail;
				}
				const shouldIncludeByInput =
					authorName.toLowerCase().includes(inputElement.toLowerCase()) ||
					authorEmail.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.content
						.replace(/<[^>]*>/g, "")
						.toLowerCase()
						.includes(inputElement.toLowerCase()) ||
					row?.parent?.content
						.replace(/<[^>]*>/g, "")
						.toLowerCase()
						.includes(inputElement.toLowerCase()) ||
					row.state.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.createdAt.toLowerCase().includes(inputElement.toLowerCase()) ||
					row?.post?.title.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.stateChangedAt.toLowerCase().includes(inputElement.toLowerCase());
				return shouldIncludeByInput;
			});
			if (tabsValue != "all") {
				filteredData = filteredData.filter((row) => {
					return row.state === tabsValue;
				});
			}
			setTotalPages(Math.ceil(filteredData.length / 5));
			filteredData = sortedData(filteredData);
			if (selectedPage > totalPages) {
				setSelectedPage(0);
			}
			filteredData = filteredData.slice(selectedPage * 5, selectedPage * 5 + 5);
			setFilteredData(filteredData);
		} else {
			setTotalPages(Math.ceil(tableRows.length / 5));
			let filteredData = sortedData(tableRows);
			if (selectedPage > totalPages) {
				setSelectedPage(0);
			}
			filteredData = filteredData.slice(selectedPage * 5, selectedPage * 5 + 5);
			setFilteredData(filteredData);
		}
	}, [
		inputElement,
		tabsValue,
		selectedPage,
		sortField,
		sortDirection,
		tableRows,
		totalPages,
	]);

	const commentsDataAPI = async () => {
		// fetch comments
		const XCSRFTOKEN = await encryptTimestamp();
		const comments = await fetch("/api/comments", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});
		return comments.json();
	};

	const fetchComments = async () => {
		try {
			const commentsData = await commentsDataAPI();
			// set comments
			setTableRows(commentsData.comments);
			setLoadingBody(false);
		} catch (error) {
			console.error(`
			Failure to load comments data: ${error}
			`);
			toast.error(`
			Failure to load comments data.
			`);
		}
	};

	useEffect(() => {
		fetchComments();
	}, []);

	const [openDeleteCommentDialog, setopenDeleteCommentDialog] = useState({
		open: false,
		state: "",
	});

	const [openEditCommentDialog, setopenEditCommentDialog] = useState({
		open: false,
		commentDetails: null,
	});

	const handleopenDeleteCommentDialog = () =>
		setopenDeleteCommentDialog({
			...openDeleteCommentDialog,
			open: !openDeleteCommentDialog.open,
		});

	const handleopenEditCommentDialog = () =>
		setopenEditCommentDialog({
			...openEditCommentDialog,
			open: !openEditCommentDialog.open,
		});
	const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
		null
	);

	const deleteComment = async (_id: string | null, state: string) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const deletedComment = await fetch(`/api/comments/${_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});

		if (!deletedComment.ok) {
			const deletedCommentBody = await deletedComment.json();
			console.error(`
			${deletedCommentBody.error}
			`);
			toast.error(`
			${deletedCommentBody.error}
			`);
			return;
		}

		let newTableRows;
		if (state === "trashed") {
			newTableRows = tableRows.filter((row) => {
				return row._id !== _id;
			});
		} else {
			newTableRows = tableRows.map((row) => {
				if (row._id === _id) {
					return {
						...row,
						state: "trashed",
						stateChangedAt: new Date().toISOString(),
					};
				} else {
					return row;
				}
			});
		}
		setTableRows(newTableRows);
		setSelectedCommentId(null);
		handleopenDeleteCommentDialog();
		let commentDetails = filteredData.find((row) => {
			return row._id === _id;
		});
		toast.success(
			`
			The comment 
			"${commentDetails?.content.replace(/<[^>]*>/g, "")}"
			has been ${
				state === "trashed" ? "removed permanently" : "trashed"
			} successfully!
		`
		);
	};

	const editComment = async (commentDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const editedComment = await fetch(`/api/comments/${commentDetails._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(commentDetails),
		});

		if (!editedComment.ok) {
			const editedCommentBody = await editedComment.json();
			console.error(`
			${editedCommentBody.error}
			`);
			toast.error(`
			${editedCommentBody.error}
			`);
			return;
		}
		// get body from response
		const editedCommentBody = await editedComment.json();

		const newTableRows = tableRows.map((row) => {
			if (row._id === editedCommentBody.comment._id) {
				return editedCommentBody.comment;
			} else {
				return row;
			}
		});
		setTableRows(newTableRows);
		setSelectedCommentId(null);
		handleopenEditCommentDialog();
		toast.success(
			`
			The comment
			"${commentDetails.content.replace(/<[^>]*>/g, "")}"
			has been edited successfully!
		`
		);
	};

	return (
		<>
			<Transition>
				<CommentsHeader
					setInputElement={setInputElement}
					inputElement={inputElement}
					inputElementRef={inputElementRef}
					setSelectedPage={setSelectedPage}
					setTabsValue={setTabsValue}
					tabsValue={tabsValue}
					tabsElementRef={tabsElementRef}
					tabs={tabs}
				/>
				<CommentsBody
					tableHead={tableHead}
					tableHeadDict={tableHeadDict}
					filteredData={filteredData}
					setSortField={setSortField}
					setSortDirection={setSortDirection}
					sortField={sortField}
					sortDirection={sortDirection}
					setSelectedCommentId={setSelectedCommentId}
					setopenDeleteCommentDialog={setopenDeleteCommentDialog}
					setopenEditCommentDialog={setopenEditCommentDialog}
					openDeleteCommentDialog={openDeleteCommentDialog}
					openEditCommentDialog={openEditCommentDialog}
					handleopenDeleteCommentDialog={handleopenDeleteCommentDialog}
					handleopenEditCommentDialog={handleopenEditCommentDialog}
					deleteComment={deleteComment}
					editComment={editComment}
					selectedCommentId={selectedCommentId}
					loading={loadingBody}
					tabsValue={tabsValue}
					stateColorDict={stateColorDict}
				/>
				<CommentsFooter
					totalPages={totalPages}
					selectedPage={selectedPage}
					setSelectedPage={setSelectedPage}
				/>
			</Transition>
		</>
	);
}

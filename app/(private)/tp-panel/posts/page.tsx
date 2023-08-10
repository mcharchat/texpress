"use client";
import { faker } from "@faker-js/faker";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import PostsFooter from "./partials/PostsFooter";
import PostsHeader from "./partials/PostsHeader";
import TableRow from "@/lib/types/TableRow";
import PostsBody from "./partials/PostsBody";
import Transition from "@/app/Transition";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";

export default function Page() {
	const [loadingBody, setLoadingBody] = useState<boolean>(true);
	const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
	const [loadingTags, setLoadingTags] = useState<boolean>(true);

	const [tabs, setTabs] = useState<{ label: string; value: string }[]>([
		{
			label: "All",
			value: "all",
		},
		{
			label: "Published",
			value: "published",
		},
		{
			label: "Draft",
			value: "drafted",
		},
		{
			label: "Archived",
			value: "archived",
		},
		{
			label: "Trashed",
			value: "trashed",
		},
	]);
	const stateColorDict: {
		[key: string]: string;
	} = {
		published: "light-green",
		drafted: "yellow",
		archived: "brown",
		trashed: "deep-orange",
	};

	const [tableHead, setTableHead] = useState<string[]>([
		"Title",
		"Author",
		"Categories",
		"Tags",
		"Comments",
		"Date",
		"",
	]);

	const tableHeadDict: {
		[key: string]: string;
	} = {
		Title: "title",
		Author: "author.name",
		Categories: "categories",
		Tags: "tags",
		Comments: "comments",
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

	const [sortField, setSortField] = useState<string>("title");
	const [sortDirection, setSortDirection] = useState<string>("asc");

	useEffect(() => {
		const sortedData = (data: TableRow[]) => {
			const returnedData = data.sort((a: any, b: any) => {
				const sortFieldArray = sortField.split(".");
				let aSortField = a;
				let bSortField = b;
				sortFieldArray.forEach((field) => {
					aSortField = aSortField[field];
					bSortField = bSortField[field];
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
				const shouldIncludeByInput =
					row.title.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.subtitle.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.author.name.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.author.email.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.stateChangedAt
						.toLowerCase()
						.includes(inputElement.toLowerCase()) ||
					row.categories.some((category) => {
						return category.name
							.toLowerCase()
							.includes(inputElement.toLowerCase());
					}) ||
					row.tags.some((tag) => {
						return tag.name.toLowerCase().includes(inputElement.toLowerCase());
					}) ||
					row.comments.some((comment) => {
						return comment.content
							.toLowerCase()
							.includes(inputElement.toLowerCase());
					});

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

	const postsDataAPI = async () => {
		// fetch posts
		const XCSRFTOKEN = await encryptTimestamp();
		const posts = await fetch("/api/posts", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});
		return posts.json();
	};

	const categoriesDataAPI = async () => {
		// fetch categories
		const XCSRFTOKEN = await encryptTimestamp();
		const categories = await fetch("/api/categories", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});
		return categories.json();
	};

	const tagsDataAPI = async () => {
		// fetch tags
		const XCSRFTOKEN = await encryptTimestamp();
		const tags = await fetch("/api/tags", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});
		return tags.json();
	};

	const fetchPosts = async () => {
		try {
			const postsData = await postsDataAPI();
			// set posts
			setTableRows(postsData.posts);
			setLoadingBody(false);
		} catch (error) {
			console.error(`
			Failure to load posts data: ${error}
			`);
			toast.error(`
			Failure to load posts data.
			`);
		}
	};

	const fetchCategories = async () => {
		try {
			const categoriesData = await categoriesDataAPI();
			// set categories
			setCategories(categoriesData.categories);
			setLoadingCategories(false);
		} catch (error) {
			console.error(`
			Failure to load categories data: ${error}
			`);
			toast.error(`
			Failure to load categories data.
			`);
		}
	};

	const fetchTags = async () => {
		try {
			const tagsData = await tagsDataAPI();
			// set tags
			setTags(tagsData.tags);
			setLoadingTags(false);
		} catch (error) {
			console.error(`
			Failure to load tags data: ${error}
			`);
			toast.error(`
			Failure to load tags data.
			`);
		}
	};

	useEffect(() => {
		fetchPosts();
		fetchCategories();
		fetchTags();
	}, []);

	const [openDeletePostDialog, setopenDeletePostDialog] = useState({
		open: false,
		state: "",
	});

	const [openCreatePostDialog, setopenCreatePostDialog] =
		useState<boolean>(false);

	const [openEditPostDialog, setopenEditPostDialog] = useState({
		open: false,
		postDetails: null,
	});

	const handleopenDeletePostDialog = () =>
		setopenDeletePostDialog({
			...openDeletePostDialog,
			open: !openDeletePostDialog.open,
		});

	const handleopenCreatePostDialog = () =>
		setopenCreatePostDialog(!openCreatePostDialog);

	const handleopenEditPostDialog = () =>
		setopenEditPostDialog({
			...openEditPostDialog,
			open: !openEditPostDialog.open,
		});
	const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

	const deletePost = async (_id: string | null, state: string) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const deletedPost = await fetch(`/api/posts/${_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});

		if (!deletedPost.ok) {
			const deletedPostBody = await deletedPost.json();
			console.error(`
			${deletedPostBody.error}
			`);
			toast.error(`
			${deletedPostBody.error}
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
		setSelectedPostId(null);
		handleopenDeletePostDialog();
		let postDetails = filteredData.find((row) => {
			return row._id === _id;
		});
		toast.success(
			`
			The post 
			"${postDetails?.title}"
			has been ${
				state === "trashed" ? "removed permanently" : "trashed"
			} successfully!
		`
		);
	};

	const createPost = async (postDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const newPost = await fetch("/api/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(postDetails),
		});

		if (!newPost.ok) {
			const newPostBody = await newPost.json();
			console.error(`
			${newPostBody.error}
			`);
			toast.error(`
			${newPostBody.error}
			`);
			return;
		}
		// get body from response
		const newPostBody = await newPost.json();

		const newTableRows = [newPostBody.post as TableRow, ...tableRows];
		setTableRows(newTableRows);
		setSelectedPostId(null);
		toast.success(
			`
			The post
			"${postDetails.title}"
			has been created successfully!
		`
		);
	};

	const editPost = async (postDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const editedPost = await fetch(`/api/posts/${postDetails._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(postDetails),
		});

		if (!editedPost.ok) {
			const editedPostBody = await editedPost.json();
			console.error(`
			${editedPostBody.error}
			`);
			toast.error(`
			${editedPostBody.error}
			`);
			return;
		}
		// get body from response
		const editedPostBody = await editedPost.json();

		const newTableRows = tableRows.map((row) => {
			if (row._id === editedPostBody.post._id) {
				return editedPostBody.post;
			} else {
				return row;
			}
		});
		setTableRows(newTableRows);
		setSelectedPostId(null);
		handleopenEditPostDialog();
		toast.success(
			`
			The post
			"${postDetails.title}"
			has been edited successfully!
		`
		);
	};

	return (
		<>
			<Transition>
				<PostsHeader
					setInputElement={setInputElement}
					inputElement={inputElement}
					inputElementRef={inputElementRef}
					setSelectedPage={setSelectedPage}
					setTabsValue={setTabsValue}
					tabsValue={tabsValue}
					tabsElementRef={tabsElementRef}
					tabs={tabs}
					setopenCreatePostDialog={setopenCreatePostDialog}
					loading={loadingTags && loadingCategories}
				/>
				<PostsBody
					tableHead={tableHead}
					tableHeadDict={tableHeadDict}
					filteredData={filteredData}
					setSortField={setSortField}
					setSortDirection={setSortDirection}
					sortField={sortField}
					sortDirection={sortDirection}
					setSelectedPostId={setSelectedPostId}
					setopenDeletePostDialog={setopenDeletePostDialog}
					setopenEditPostDialog={setopenEditPostDialog}
					openDeletePostDialog={openDeletePostDialog}
					openEditPostDialog={openEditPostDialog}
					openCreatePostDialog={openCreatePostDialog}
					handleopenDeletePostDialog={handleopenDeletePostDialog}
					handleopenEditPostDialog={handleopenEditPostDialog}
					handleopenCreatePostDialog={handleopenCreatePostDialog}
					createPost={createPost}
					deletePost={deletePost}
					editPost={editPost}
					selectedPostId={selectedPostId}
					categories={categories}
					tags={tags}
					loading={loadingBody}
					tabsValue={tabsValue}
					stateColorDict={stateColorDict}
				/>
				<PostsFooter
					totalPages={totalPages}
					selectedPage={selectedPage}
					setSelectedPage={setSelectedPage}
				/>
			</Transition>
		</>
	);
}

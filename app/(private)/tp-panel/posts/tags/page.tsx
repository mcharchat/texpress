"use client";
import { faker } from "@faker-js/faker";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import TagsFooter from "./partials/TagsFooter";
import TagsHeader from "./partials/TagsHeader";
import Tag from "@/lib/types/Tag";
import TagsBody from "./partials/TagsBody";
import Transition from "@/app/Transition";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";

export default function Page() {
	const [loadingBody, setLoadingBody] = useState<boolean>(true);

	const [tableHead, setTableHead] = useState<string[]>([
		"Name",
		"Description",
		"Slug",
		"Count",
		"",
	]);

	const tableHeadDict: {
		[key: string]: string;
	} = {
		Name: "name",
		Description: "description",
		Slug: "slug",
		Count: "posts",
	};

	const [tableRows, setTableRows] = useState<Tag[]>([]);

	const [filteredData, setFilteredData] = useState<Tag[]>(tableRows);

	const [totalPages, setTotalPages] = useState<number>(
		Math.ceil(tableRows.length / 5)
	);

	const [inputElement, setInputElement] = useState<string>("");

	const inputElementRef = useRef<HTMLInputElement>(null);

	const [selectedPage, setSelectedPage] = useState<number>(0);

	const [sortField, setSortField] = useState<string>("name");
	const [sortDirection, setSortDirection] = useState<string>("asc");

	useEffect(() => {
		const sortedData = (data: Tag[]) => {
			const returnedData = data.sort((a: any, b: any) => {
				const sortFieldArray = sortField.split(".");
				let aSortField = a;
				let bSortField = b;
				sortFieldArray.forEach((field) => {
					aSortField = aSortField[field] || "";
					bSortField = bSortField[field] || "";
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
		if (inputElement) {
			let filteredData = tableRows.filter((row) => {
				const shouldIncludeByInput =
					row.name.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.slug.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.description.toLowerCase().includes(inputElement.toLowerCase()) ||
					row.color.toLowerCase().includes(inputElement.toLowerCase());
				return shouldIncludeByInput;
			});
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
		selectedPage,
		sortField,
		sortDirection,
		tableRows,
		totalPages,
	]);

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

	const fetchTags = async () => {
		try {
			const tagsData = await tagsDataAPI();
			// set tags
			setTableRows(tagsData.tags);
			setLoadingBody(false);
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
		fetchTags();
	}, []);

	const [openDeleteTagDialog, setopenDeleteTagDialog] = useState({
		open: false,
	});

	const [openCreateTagDialog, setopenCreateTagDialog] =
		useState<boolean>(false);

	const [openEditTagDialog, setopenEditTagDialog] = useState({
		open: false,
		tagDetails: null,
	});

	const handleopenDeleteTagDialog = () =>
		setopenDeleteTagDialog({
			...openDeleteTagDialog,
			open: !openDeleteTagDialog.open,
		});

	const handleopenCreateTagDialog = () =>
		setopenCreateTagDialog(!openCreateTagDialog);

	const handleopenEditTagDialog = () =>
		setopenEditTagDialog({
			...openEditTagDialog,
			open: !openEditTagDialog.open,
		});
	const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

	const deleteTag = async (_id: string | null) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const deletedTag = await fetch(`/api/tags/${_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});

		if (!deletedTag.ok) {
			const deletedTagBody = await deletedTag.json();
			console.error(`
			${deletedTagBody.error}
			`);
			toast.error(`
			${deletedTagBody.error}
			`);
			return;
		}

		let newTableRows;
		newTableRows = tableRows.filter((row) => {
			return row._id !== _id;
		});
		setTableRows(newTableRows);
		setSelectedTagId(null);
		handleopenDeleteTagDialog();
		let tagDetails = filteredData.find((row) => {
			return row._id === _id;
		});
		toast.success(
			`
			The tag 
			"${tagDetails?.name}"
			has been removed permanently successfully!
		`
		);
	};

	const createTag = async (tagDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const newTag = await fetch("/api/tags", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(tagDetails),
		});

		if (!newTag.ok) {
			const newTagBody = await newTag.json();
			console.error(`
			${newTagBody.error}
			`);
			toast.error(`
			${newTagBody.error}
			`);
			return;
		}
		// get body from response
		const newTagBody = await newTag.json();

		const newTableRows = [newTagBody.tag as Tag, ...tableRows];
		setTableRows(newTableRows);
		setSelectedTagId(null);
		toast.success(
			`
			The tag
			"${tagDetails.name}"
			has been created successfully!
		`
		);
	};

	const editTag = async (tagDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const editedTag = await fetch(`/api/tags/${tagDetails._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(tagDetails),
		});

		if (!editedTag.ok) {
			const editedTagBody = await editedTag.json();
			console.error(`
			${editedTagBody.error}
			`);
			toast.error(`
			${editedTagBody.error}
			`);
			return;
		}
		// get body from response
		const editedTagBody = await editedTag.json();

		const newTableRows = tableRows.map((row) => {
			if (row._id === editedTagBody.tag._id) {
				return editedTagBody.tag;
			} else {
				return row;
			}
		});
		setTableRows(newTableRows);
		setSelectedTagId(null);
		handleopenEditTagDialog();
		toast.success(
			`
			The tag
			"${tagDetails.name}"
			has been edited successfully!
		`
		);
	};

	const allCollors = [
		"blue-gray",
		"gray",
		"brown",
		"deep-orange",
		"orange",
		"amber",
		"yellow",
		"lime",
		"light-green",
		"green",
		"teal",
		"cyan",
		"light-blue",
		"blue",
		"indigo",
		"deep-purple",
		"purple",
		"pink",
		"red",
	];

	return (
		<>
			<Transition>
				<TagsHeader
					setInputElement={setInputElement}
					inputElement={inputElement}
					inputElementRef={inputElementRef}
					setSelectedPage={setSelectedPage}
					setopenCreateTagDialog={setopenCreateTagDialog}
					loading={false}
				/>
				<TagsBody
					tableHead={tableHead}
					tableHeadDict={tableHeadDict}
					filteredData={filteredData}
					setSortField={setSortField}
					setSortDirection={setSortDirection}
					sortField={sortField}
					sortDirection={sortDirection}
					setSelectedTagId={setSelectedTagId}
					setopenDeleteTagDialog={setopenDeleteTagDialog}
					setopenEditTagDialog={setopenEditTagDialog}
					openDeleteTagDialog={openDeleteTagDialog}
					openEditTagDialog={openEditTagDialog}
					openCreateTagDialog={openCreateTagDialog}
					handleopenDeleteTagDialog={handleopenDeleteTagDialog}
					handleopenEditTagDialog={handleopenEditTagDialog}
					handleopenCreateTagDialog={handleopenCreateTagDialog}
					createTag={createTag}
					deleteTag={deleteTag}
					editTag={editTag}
					selectedTagId={selectedTagId}
					loading={loadingBody}
					allCollors={allCollors}
				/>
				<TagsFooter
					totalPages={totalPages}
					selectedPage={selectedPage}
					setSelectedPage={setSelectedPage}
				/>
			</Transition>
		</>
	);
}

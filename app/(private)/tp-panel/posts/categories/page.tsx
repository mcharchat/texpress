"use client";
import { faker } from "@faker-js/faker";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import CategoriesFooter from "./partials/CategoriesFooter";
import CategoriesHeader from "./partials/CategoriesHeader";
import Category from "@/lib/types/Category";
import CategoriesBody from "./partials/CategoriesBody";
import Transition from "@/app/Transition";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";

export default function Page() {
	const [loadingBody, setLoadingBody] = useState<boolean>(true);

	const [tableHead, setTableHead] = useState<string[]>([
		"Name",
		"Parent",
		"Description",
		"Slug",
		"Posts",
		"",
	]);

	const tableHeadDict: {
		[key: string]: string;
	} = {
		Name: "name",
		Parent: "parent.name",
		Description: "description",
		Slug: "slug",
		Posts: "posts",
	};

	const [tableRows, setTableRows] = useState<Category[]>([]);

	const [filteredData, setFilteredData] = useState<Category[]>(tableRows);

	const [totalPages, setTotalPages] = useState<number>(
		Math.ceil(tableRows.length / 5)
	);

	const [inputElement, setInputElement] = useState<string>("");

	const inputElementRef = useRef<HTMLInputElement>(null);

	const [selectedPage, setSelectedPage] = useState<number>(0);

	const [sortField, setSortField] = useState<string>("name");
	const [sortDirection, setSortDirection] = useState<string>("asc");

	useEffect(() => {
		const sortedData = (data: Category[]) => {
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
					row?.parent?.name.toLowerCase().includes(inputElement.toLowerCase());

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

	const fetchCategories = async () => {
		try {
			const categoriesData = await categoriesDataAPI();
			// set categories
			setTableRows(categoriesData.categories);
			setLoadingBody(false);
		} catch (error) {
			console.error(`
			Failure to load categories data: ${error}
			`);
			toast.error(`
			Failure to load categories data.
			`);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const [openDeleteCategoryDialog, setopenDeleteCategoryDialog] = useState({
		open: false,
	});

	const [openCreateCategoryDialog, setopenCreateCategoryDialog] =
		useState<boolean>(false);

	const [openEditCategoryDialog, setopenEditCategoryDialog] = useState({
		open: false,
		categoryDetails: null,
	});

	const handleopenDeleteCategoryDialog = () =>
		setopenDeleteCategoryDialog({
			...openDeleteCategoryDialog,
			open: !openDeleteCategoryDialog.open,
		});

	const handleopenCreateCategoryDialog = () =>
		setopenCreateCategoryDialog(!openCreateCategoryDialog);

	const handleopenEditCategoryDialog = () =>
		setopenEditCategoryDialog({
			...openEditCategoryDialog,
			open: !openEditCategoryDialog.open,
		});
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);

	const deleteCategory = async (_id: string | null) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const deletedCategory = await fetch(`/api/categories/${_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});

		if (!deletedCategory.ok) {
			const deletedCategoryBody = await deletedCategory.json();
			console.error(`
			${deletedCategoryBody.error}
			`);
			toast.error(`
			${deletedCategoryBody.error}
			`);
			return;
		}

		let newTableRows;
		newTableRows = tableRows.filter((row) => {
			return row._id !== _id;
		});
		setTableRows(newTableRows);
		setSelectedCategoryId(null);
		handleopenDeleteCategoryDialog();
		let categoryDetails = filteredData.find((row) => {
			return row._id === _id;
		});
		toast.success(
			`
			The category 
			"${categoryDetails?.name}"
			has been removed permanently successfully!
		`
		);
	};

	const createCategory = async (categoryDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const newCategory = await fetch("/api/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(categoryDetails),
		});

		if (!newCategory.ok) {
			const newCategoryBody = await newCategory.json();
			console.error(`
			${newCategoryBody.error}
			`);
			toast.error(`
			${newCategoryBody.error}
			`);
			return;
		}
		// get body from response
		const newCategoryBody = await newCategory.json();

		const newTableRows = [newCategoryBody.category as Category, ...tableRows];
		setTableRows(newTableRows);
		setSelectedCategoryId(null);
		toast.success(
			`
			The category
			"${categoryDetails.name}"
			has been created successfully!
		`
		);
	};

	const editCategory = async (categoryDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const editedCategory = await fetch(
			`/api/categories/${categoryDetails._id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
				},
				body: JSON.stringify(categoryDetails),
			}
		);

		if (!editedCategory.ok) {
			const editedCategoryBody = await editedCategory.json();
			console.error(`
			${editedCategoryBody.error}
			`);
			toast.error(`
			${editedCategoryBody.error}
			`);
			return;
		}
		// get body from response
		const editedCategoryBody = await editedCategory.json();

		const newTableRows = tableRows.map((row) => {
			if (row._id === editedCategoryBody.category._id) {
				return editedCategoryBody.category;
			} else {
				return row;
			}
		});
		setTableRows(newTableRows);
		setSelectedCategoryId(null);
		handleopenEditCategoryDialog();
		toast.success(
			`
			The category
			"${categoryDetails.name}"
			has been edited successfully!
		`
		);
	};

	return (
		<>
			<Transition>
				<CategoriesHeader
					setInputElement={setInputElement}
					inputElement={inputElement}
					inputElementRef={inputElementRef}
					setSelectedPage={setSelectedPage}
					setopenCreateCategoryDialog={setopenCreateCategoryDialog}
					loading={false}
				/>
				<CategoriesBody
					tableHead={tableHead}
					tableHeadDict={tableHeadDict}
					filteredData={filteredData}
					setSortField={setSortField}
					setSortDirection={setSortDirection}
					sortField={sortField}
					sortDirection={sortDirection}
					setSelectedCategoryId={setSelectedCategoryId}
					setopenDeleteCategoryDialog={setopenDeleteCategoryDialog}
					setopenEditCategoryDialog={setopenEditCategoryDialog}
					openDeleteCategoryDialog={openDeleteCategoryDialog}
					openEditCategoryDialog={openEditCategoryDialog}
					openCreateCategoryDialog={openCreateCategoryDialog}
					handleopenDeleteCategoryDialog={handleopenDeleteCategoryDialog}
					handleopenEditCategoryDialog={handleopenEditCategoryDialog}
					handleopenCreateCategoryDialog={handleopenCreateCategoryDialog}
					createCategory={createCategory}
					deleteCategory={deleteCategory}
					editCategory={editCategory}
					selectedCategoryId={selectedCategoryId}
					loading={loadingBody}
					allCategories={tableRows}
				/>
				<CategoriesFooter
					totalPages={totalPages}
					selectedPage={selectedPage}
					setSelectedPage={setSelectedPage}
				/>
			</Transition>
		</>
	);
}

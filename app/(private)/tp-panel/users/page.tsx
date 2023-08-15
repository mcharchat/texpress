"use client";
import { faker } from "@faker-js/faker";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import UsersFooter from "./partials/UsersFooter";
import UsersHeader from "./partials/UsersHeader";
import User from "@/lib/types/User";
import UsersBody from "./partials/UsersBody";
import Transition from "@/app/Transition";
import encryptTimestamp from "@/lib/utils/encryptTimestamp";

export default function Page() {
	const [loadingBody, setLoadingBody] = useState<boolean>(true);

	const [tableHead, setTableHead] = useState<string[]>([
		"Name",
		"Role",
		"Posts",
		"Status",
		"",
	]);

	const tableHeadDict: {
		[key: string]: string;
	} = {
		Name: "name",
		Role: "role",
		Posts: "posts",
		Status: "active",
	};

	const [tableRows, setTableRows] = useState<User[]>([]);

	const [filteredData, setFilteredData] = useState<User[]>(tableRows);

	const [totalPages, setTotalPages] = useState<number>(
		Math.ceil(tableRows.length / 5)
	);

	const [inputElement, setInputElement] = useState<string>("");

	const inputElementRef = useRef<HTMLInputElement>(null);

	const [selectedPage, setSelectedPage] = useState<number>(0);

	const [sortField, setSortField] = useState<string>("name");
	const [sortDirection, setSortDirection] = useState<string>("asc");

	useEffect(() => {
		const sortedData = (data: User[]) => {
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
					row.email.toLowerCase().includes(inputElement.toLowerCase());
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

	const usersDataAPI = async () => {
		// fetch users
		const XCSRFTOKEN = await encryptTimestamp();
		const users = await fetch("/api/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});
		return users.json();
	};

	const fetchUsers = async () => {
		try {
			const usersData = await usersDataAPI();
			// set users
			setTableRows(usersData.users);
			setLoadingBody(false);
		} catch (error) {
			console.error(`
			Failure to load users data: ${error}
			`);
			toast.error(`
			Failure to load users data.
			`);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const [openDeleteUserDialog, setopenDeleteUserDialog] = useState({
		open: false,
	});

	const [openCreateUserDialog, setopenCreateUserDialog] =
		useState<boolean>(false);

	const [openEditUserDialog, setopenEditUserDialog] = useState({
		open: false,
		userDetails: null,
	});

	const handleopenDeleteUserDialog = () =>
		setopenDeleteUserDialog({
			...openDeleteUserDialog,
			open: !openDeleteUserDialog.open,
		});

	const handleopenCreateUserDialog = () =>
		setopenCreateUserDialog(!openCreateUserDialog);

	const handleopenEditUserDialog = () =>
		setopenEditUserDialog({
			...openEditUserDialog,
			open: !openEditUserDialog.open,
		});
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const deleteUser = async (_id: string | null) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const deletedUser = await fetch(`/api/users/${_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
		});

		if (!deletedUser.ok) {
			const deletedUserBody = await deletedUser.json();
			console.error(`
			${deletedUserBody.error}
			`);
			toast.error(`
			${deletedUserBody.error}
			`);
			return;
		}

		let newTableRows;
		newTableRows = tableRows.filter((row) => {
			return row._id !== _id;
		});
		setTableRows(newTableRows);
		setSelectedUserId(null);
		handleopenDeleteUserDialog();
		let userDetails = filteredData.find((row) => {
			return row._id === _id;
		});
		toast.success(
			`
			The user 
			"${userDetails?.name}"
			has been removed permanently successfully!
		`
		);
	};

	const createUser = async (userDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const newUser = await fetch("/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(userDetails),
		});

		if (!newUser.ok) {
			const newUserBody = await newUser.json();
			console.error(`
			${newUserBody.error}
			`);
			toast.error(`
			${newUserBody.error}
			`);
			return;
		}
		// get body from response
		const newUserBody = await newUser.json();

		const newTableRows = [newUserBody.user as User, ...tableRows];
		setTableRows(newTableRows);
		setSelectedUserId(null);
		toast.success(
			`
			The user
			"${userDetails.name}"
			has been created successfully!
		`
		);
	};

	const editUser = async (userDetails: any) => {
		const XCSRFTOKEN = await encryptTimestamp();
		const editedUser = await fetch(`/api/users/${userDetails._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": JSON.stringify(XCSRFTOKEN),
			},
			body: JSON.stringify(userDetails),
		});

		if (!editedUser.ok) {
			const editedUserBody = await editedUser.json();
			console.error(`
			${editedUserBody.error}
			`);
			toast.error(`
			${editedUserBody.error}
			`);
			return;
		}
		// get body from response
		const editedUserBody = await editedUser.json();

		const newTableRows = tableRows.map((row) => {
			if (row._id === editedUserBody.user._id) {
				return editedUserBody.user;
			} else {
				return row;
			}
		});
		setTableRows(newTableRows);
		setSelectedUserId(null);
		handleopenEditUserDialog();
		toast.success(
			`
			The user
			"${userDetails.name}"
			has been edited successfully!
		`
		);
	};

	const allRoles = [
		"Super Admin",
		"Administrator",
		"Editor",
		"Author",
		"Contributor",
		"Subscriber",
	];

	return (
		<>
			<Transition>
				<UsersHeader
					setInputElement={setInputElement}
					inputElement={inputElement}
					inputElementRef={inputElementRef}
					setSelectedPage={setSelectedPage}
					setopenCreateUserDialog={setopenCreateUserDialog}
					loading={false}
				/>
				<UsersBody
					tableHead={tableHead}
					tableHeadDict={tableHeadDict}
					filteredData={filteredData}
					setSortField={setSortField}
					setSortDirection={setSortDirection}
					sortField={sortField}
					sortDirection={sortDirection}
					setSelectedUserId={setSelectedUserId}
					setopenDeleteUserDialog={setopenDeleteUserDialog}
					setopenEditUserDialog={setopenEditUserDialog}
					openDeleteUserDialog={openDeleteUserDialog}
					openEditUserDialog={openEditUserDialog}
					openCreateUserDialog={openCreateUserDialog}
					handleopenDeleteUserDialog={handleopenDeleteUserDialog}
					handleopenEditUserDialog={handleopenEditUserDialog}
					handleopenCreateUserDialog={handleopenCreateUserDialog}
					createUser={createUser}
					deleteUser={deleteUser}
					editUser={editUser}
					selectedUserId={selectedUserId}
					loading={loadingBody}
					allRoles={allRoles}
				/>
				<UsersFooter
					totalPages={totalPages}
					selectedPage={selectedPage}
					setSelectedPage={setSelectedPage}
				/>
			</Transition>
		</>
	);
}

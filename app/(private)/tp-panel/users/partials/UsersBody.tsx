import {
	CardBody,
	IconButton,
	Tooltip,
	Chip,
	Typography,
	Avatar,
} from "@material-tailwind/react";
import Link from "next/link";
import TableRow from "@/lib/types/User";
import { Dispatch, SetStateAction } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteUserDialog from "./DeleteUserDialog";
import EditUserDialog from "./EditUserDialog";
import CreateUserDialog from "./CreateUserDialog";
import PopOverPosts from "./PopOverPosts";
import { colors } from "@material-tailwind/react/types/generic";
import { Icon } from "@iconify/react";

export default function UsersBody({
	tableHead,
	tableHeadDict,
	filteredData,
	setSortField,
	setSortDirection,
	sortField,
	sortDirection,
	setSelectedUserId,
	setopenDeleteUserDialog,
	setopenEditUserDialog,
	openEditUserDialog,
	openDeleteUserDialog,
	openCreateUserDialog,
	handleopenDeleteUserDialog,
	handleopenEditUserDialog,
	handleopenCreateUserDialog,
	createUser,
	deleteUser,
	editUser,
	selectedUserId,
	loading,
	allRoles,
}: {
	tableHead: string[];
	tableHeadDict: { [key: string]: string };
	filteredData: TableRow[];
	setSortField: Dispatch<SetStateAction<string>>;
	setSortDirection: Dispatch<SetStateAction<string>>;
	sortField: string;
	sortDirection: string;
	setSelectedUserId: Dispatch<SetStateAction<string | null>>;
	setopenDeleteUserDialog: Dispatch<
		SetStateAction<{
			open: boolean;
		}>
	>;
	setopenEditUserDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			userDetails: any;
		}>
	>;
	openEditUserDialog: {
		open: boolean;
		userDetails: TableRow | null;
	};
	openDeleteUserDialog: {
		open: boolean;
	};
	openCreateUserDialog: boolean;
	handleopenDeleteUserDialog: () => void;
	handleopenEditUserDialog: () => void;
	handleopenCreateUserDialog: () => void;
	createUser: (userData: TableRow) => void;
	deleteUser: (id: string | null) => void;
	editUser: (userData: TableRow) => void;
	selectedUserId: string | null;
	loading: boolean;
	allRoles: string[];
}) {
	return (
		<CardBody className='overflow-y-h_ide overflow-x-scroll custom-scroll custom-x-scroll px-0 py-5'>
			<table className='mt-4 w-full min-w-max table-auto sm:table-fixed text-left'>
				<thead>
					<tr>
						{tableHead.map((head, index) => (
							<th
								key={index}
								className='cursor-pointer border-y border-gray-200 bg-gray-100/50 p-4 transition-colors hover:bg-gray-100'
								onClick={() => {
									if (index !== tableHead.length - 1) {
										if (sortField === tableHeadDict[head]) {
											setSortDirection(
												sortDirection === "asc" ? "desc" : "asc"
											);
										} else {
											setSortField(tableHeadDict[head]);
											setSortDirection("asc");
										}
									}
								}}
							>
								<Typography
									variant='small'
									color='blue-gray'
									className='flex items-center justify-between gap-2 font-normal leading-none opacity-70'
								>
									{head}{" "}
									{index !== tableHead.length - 1 && (
										<>
											{(() => {
												if (sortField === tableHeadDict[head]) {
													if (sortDirection === "asc") {
														return (
															<Icon
																icon='heroicons:chevron-up'
																strokeWidth={2}
																className='h-4 w-4'
															/>
														);
													} else {
														return (
															<Icon
																icon='heroicons:chevron-down'
																strokeWidth={2}
																className='h-4 w-4'
															/>
														);
													}
												} else {
													return (
														<Icon
															icon='heroicons:chevron-up-down'
															strokeWidth={2}
															className='h-4 w-4'
														/>
													);
												}
											})()}
										</>
									)}
								</Typography>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{loading ? (
						// make a loop of 5
						Array.from({ length: 5 }).map((_, index) => (
							<tr key={index}>
								<td className='p-4 flex'>
									<div className='w-9 h-9 m-1'>
										<Skeleton circle className='h-9 aspect-square' />
									</div>
									<div className='grow min-w-[50px]'>
										<Skeleton count={2} />
									</div>
								</td>
								<td className='p-4'>
									<Skeleton />
								</td>
								<td className='p-4'>
									<Skeleton />
								</td>
								<td className='p-4'>
									<Skeleton />
								</td>
								<td className='p-4'>
									<Skeleton />
								</td>
							</tr>
						))
					) : filteredData.length === 0 ? (
						<tr>
							<td className='p-4' colSpan={5}>
								<div className='flex flex-col items-center justify-center gap-2'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal'
									>
										No users found
									</Typography>
								</div>
							</td>
						</tr>
					) : (
						filteredData.map(
							({ _id, img, name, email, role, posts, isActive }, index) => {
								const isLast = index === filteredData.length - 1;
								const classes = isLast
									? "p-4"
									: "p-4 border-b border-blue-gray-50";

								return (
									<tr
										key={index}
										onDoubleClick={() => {
											setSelectedUserId(_id);
											setopenEditUserDialog({
												open: true,
												userDetails: filteredData[index],
											});
										}}
									>
										<td className={classes}>
											<div className='flex items-center gap-3'>
												{img ? (
													<Avatar
														src={img}
														alt={name}
														withBorder={true}
														color='blue'
														className='p-0.5'
														size='sm'
													/>
												) : (
													<div>
														<div className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-gray-100 text-blue-gray-500'>
															{name[0]}
														</div>
													</div>
												)}
												<div className='flex flex-col'>
													<Typography
														variant='small'
														color='blue-gray'
														className='font-normal break-all'
													>
														{name}
													</Typography>
													<Typography
														variant='small'
														color='blue-gray'
														className='font-normal opacity-70 break-all'
													>
														{email}
													</Typography>
												</div>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-col items-center'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal'
												>
													{allRoles[parseInt(role)]}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-wrap gap-1 justify-center'>
												{posts ? (
													posts?.length > 0 ? (
														<PopOverPosts
															triggerElement={
																<Typography
																	variant='small'
																	color='blue'
																	className='font-normal cursor-pointer'
																>
																	{posts?.length}
																</Typography>
															}
														>
															<div className='flex flex-col gap-2'>
																{posts?.map(({ title, slug }, index) => {
																	return (
																		<div key={index}>
																			<Link href={`/blog/${slug}`}>
																				<Typography
																					variant='small'
																					color='blue'
																					className='font-normal hover:underline flex shrink'
																				>
																					{title}
																				</Typography>
																			</Link>
																		</div>
																	);
																})}
															</div>
														</PopOverPosts>
													) : (
														<Typography variant='small' className='font-normal'>
															{posts?.length}
														</Typography>
													)
												) : (
													<Typography variant='small' className='font-normal'>
														0
													</Typography>
												)}
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-col items-center'>
												{isActive ? (
													<Chip
														variant='ghost'
														size='sm'
														color='green'
														value='Active'
														className='w-max transition-all'
													/>
												) : (
													<Chip
														variant='ghost'
														size='sm'
														color='red'
														value='Inactive'
														className='w-max transition-all'
													/>
												)}
											</div>
										</td>
										<td className={classes}>
											<div className='flex gap-2 flex-wrap justify-center'>
												<Tooltip content='Edit user'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedUserId(_id);
															setopenEditUserDialog({
																open: true,
																userDetails: filteredData[index],
															});
														}}
													>
														<Icon
															icon='heroicons:pencil-solid'
															className='h-4 w-4'
														/>
													</IconButton>
												</Tooltip>
												<Tooltip content='Delete user'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedUserId(_id);
															setopenDeleteUserDialog({
																open: true,
															});
														}}
													>
														<Icon
															icon='heroicons:trash-solid'
															className='h-4 w-4'
														/>
													</IconButton>
												</Tooltip>
											</div>
										</td>
									</tr>
								);
							}
						)
					)}
				</tbody>
			</table>

			<DeleteUserDialog
				openDeleteUserDialog={openDeleteUserDialog}
				handleopenDeleteUserDialog={handleopenDeleteUserDialog}
				selectedUserId={selectedUserId}
				deleteUser={deleteUser}
			/>
			<EditUserDialog
				openEditUserDialog={openEditUserDialog}
				handleopenEditUserDialog={handleopenEditUserDialog}
				editUser={editUser}
				allRoles={allRoles}
			/>
			<CreateUserDialog
				openCreateUserDialog={openCreateUserDialog}
				handleopenCreateUserDialog={handleopenCreateUserDialog}
				createUser={createUser}
				allRoles={allRoles}
			/>
		</CardBody>
	);
}

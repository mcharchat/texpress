import {
	CardBody,
	IconButton,
	Tooltip,
	Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import TableRow from "@/lib/types/Category";
import { Dispatch, SetStateAction } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import CreateCategoryDialog from "./CreateCategoryDialog";
import PopOverPosts from "./PopOverPosts";
import { Icon } from "@iconify/react";

export default function CategoriesBody({
	tableHead,
	tableHeadDict,
	filteredData,
	setSortField,
	setSortDirection,
	sortField,
	sortDirection,
	setSelectedCategoryId,
	setopenDeleteCategoryDialog,
	setopenEditCategoryDialog,
	openEditCategoryDialog,
	openDeleteCategoryDialog,
	openCreateCategoryDialog,
	handleopenDeleteCategoryDialog,
	handleopenEditCategoryDialog,
	handleopenCreateCategoryDialog,
	createCategory,
	deleteCategory,
	editCategory,
	selectedCategoryId,
	loading,
	allCategories,
}: {
	tableHead: string[];
	tableHeadDict: { [key: string]: string };
	filteredData: TableRow[];
	setSortField: Dispatch<SetStateAction<string>>;
	setSortDirection: Dispatch<SetStateAction<string>>;
	sortField: string;
	sortDirection: string;
	setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
	setopenDeleteCategoryDialog: Dispatch<
		SetStateAction<{
			open: boolean;
		}>
	>;
	setopenEditCategoryDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			categoryDetails: any;
		}>
	>;
	openEditCategoryDialog: {
		open: boolean;
		categoryDetails: TableRow | null;
	};
	openDeleteCategoryDialog: {
		open: boolean;
	};
	openCreateCategoryDialog: boolean;
	handleopenDeleteCategoryDialog: () => void;
	handleopenEditCategoryDialog: () => void;
	handleopenCreateCategoryDialog: () => void;
	createCategory: (categoryData: any) => void;
	deleteCategory: (id: string | null) => void;
	editCategory: (categoryData: any) => void;
	selectedCategoryId: string | null;
	loading: boolean;
	allCategories: TableRow[];
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
															<Icon icon="heroicons:chevron-up"
																strokeWidth={2}
																className='h-4 w-4'
															/>
														);
													} else {
														return (
															<Icon icon="heroicons:chevron-down"
																strokeWidth={2}
																className='h-4 w-4'
															/>
														);
													}
												} else {
													return (
														<Icon icon="heroicons:chevron-up-down"
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
							<td className='p-4' colSpan={6}>
								<div className='flex flex-col items-center justify-center gap-2'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal'
									>
										No categories found
									</Typography>
								</div>
							</td>
						</tr>
					) : (
						filteredData.map(
							({ _id, name, description, slug, parent, posts }, index) => {
								const isLast = index === filteredData.length - 1;
								const classes = isLast
									? "p-4"
									: "p-4 border-b border-blue-gray-50";

								return (
									<tr
										key={index}
										onDoubleClick={() => {
											setSelectedCategoryId(_id);
											setopenEditCategoryDialog({
												open: true,
												categoryDetails: filteredData[index],
											});
										}}
									>
										<td className={classes}>
											<div className='flex flex-col'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal'
												>
													{name}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-col items-center'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal'
												>
													{parent ? parent.name : "-"}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-col'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal'
												>
													{description}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-col items-center'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal'
												>
													{slug}
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
											<div className='flex gap-2 flex-wrap justify-center'>
												<Tooltip content='Edit category'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedCategoryId(_id);
															setopenEditCategoryDialog({
																open: true,
																categoryDetails: filteredData[index],
															});
														}}
													>
														<Icon icon="heroicons:pencil-solid" className='h-4 w-4' />
													</IconButton>
												</Tooltip>
												<Tooltip content='Delete category'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedCategoryId(_id);
															setopenDeleteCategoryDialog({
																open: true,
															});
														}}
													>
														<Icon icon="heroicons:trash-solid" className='h-4 w-4' />
													</IconButton>
												</Tooltip>
												<Tooltip content='View category'>
													<Link href={`/categories/${slug}`}>
														<IconButton variant='text' color='blue-gray'>
															<Icon icon="heroicons:magnifying-glass" className='h-4 w-4' />
														</IconButton>
													</Link>
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

			<DeleteCategoryDialog
				openDeleteCategoryDialog={openDeleteCategoryDialog}
				handleopenDeleteCategoryDialog={handleopenDeleteCategoryDialog}
				selectedCategoryId={selectedCategoryId}
				deleteCategory={deleteCategory}
			/>
			<EditCategoryDialog
				openEditCategoryDialog={openEditCategoryDialog}
				handleopenEditCategoryDialog={handleopenEditCategoryDialog}
				editCategory={editCategory}
				allCategories={allCategories}
			/>
			<CreateCategoryDialog
				openCreateCategoryDialog={openCreateCategoryDialog}
				handleopenCreateCategoryDialog={handleopenCreateCategoryDialog}
				createCategory={createCategory}
				allCategories={allCategories}
			/>
		</CardBody>
	);
}

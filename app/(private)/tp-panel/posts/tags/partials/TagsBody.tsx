import {
	CardBody,
	IconButton,
	Tooltip,
	Chip,
	Typography,
} from "@material-tailwind/react";
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import TableRow from "@/lib/types/Tag";
import { Dispatch, SetStateAction, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteTagDialog from "./DeleteTagDialog";
import EditTagDialog from "./EditTagDialog";
import CreateTagDialog from "./CreateTagDialog";
import PopOverPosts from "./PopOverPosts";
import { colors } from "@material-tailwind/react/types/generic";

export default function TagsBody({
	tableHead,
	tableHeadDict,
	filteredData,
	setSortField,
	setSortDirection,
	sortField,
	sortDirection,
	setSelectedTagId,
	setopenDeleteTagDialog,
	setopenEditTagDialog,
	openEditTagDialog,
	openDeleteTagDialog,
	openCreateTagDialog,
	handleopenDeleteTagDialog,
	handleopenEditTagDialog,
	handleopenCreateTagDialog,
	createTag,
	deleteTag,
	editTag,
	selectedTagId,
	loading,
	allCollors,
}: {
	tableHead: string[];
	tableHeadDict: { [key: string]: string };
	filteredData: TableRow[];
	setSortField: Dispatch<SetStateAction<string>>;
	setSortDirection: Dispatch<SetStateAction<string>>;
	sortField: string;
	sortDirection: string;
	setSelectedTagId: Dispatch<SetStateAction<string | null>>;
	setopenDeleteTagDialog: Dispatch<
		SetStateAction<{
			open: boolean;
		}>
	>;
	setopenEditTagDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			tagDetails: any;
		}>
	>;
	openEditTagDialog: {
		open: boolean;
		tagDetails: TableRow | null;
	};
	openDeleteTagDialog: {
		open: boolean;
	};
	openCreateTagDialog: boolean;
	handleopenDeleteTagDialog: () => void;
	handleopenEditTagDialog: () => void;
	handleopenCreateTagDialog: () => void;
	createTag: (tagData: any) => void;
	deleteTag: (id: string | null) => void;
	editTag: (tagData: any) => void;
	selectedTagId: string | null;
	loading: boolean;
	allCollors: string[];
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
															<ChevronUpIcon
																strokeWidth={2}
																className='h-4 w-4'
															/>
														);
													} else {
														return (
															<ChevronDownIcon
																strokeWidth={2}
																className='h-4 w-4'
															/>
														);
													}
												} else {
													return (
														<ChevronUpDownIcon
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
							</tr>
						))
					) : filteredData.length === 0 ? (
						<tr>
							<td className='p-4' colSpan={7}>
								<div className='flex flex-col items-center justify-center gap-2'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal'
									>
										No tags found
									</Typography>
								</div>
							</td>
						</tr>
					) : (
						filteredData.map(
							({ _id, name, description, slug, color, posts }, index) => {
								const isLast = index === filteredData.length - 1;
								const classes = isLast
									? "p-4"
									: "p-4 border-b border-blue-gray-50";

								return (
									<tr
										key={index}
										onDoubleClick={() => {
											setSelectedTagId(_id);
											setopenEditTagDialog({
												open: true,
												tagDetails: filteredData[index],
											});
										}}
									>
										<td className={classes}>
											<div className='flex flex-col'>
												<Chip
													variant='ghost'
													size='sm'
													value={name}
													color={color as colors}
													className='w-max transition-all'
												/>
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
												<Tooltip content='Edit tag'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedTagId(_id);
															setopenEditTagDialog({
																open: true,
																tagDetails: filteredData[index],
															});
														}}
													>
														<PencilIcon className='h-4 w-4' />
													</IconButton>
												</Tooltip>
												<Tooltip content='Delete tag'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedTagId(_id);
															setopenDeleteTagDialog({
																open: true,
															});
														}}
													>
														<TrashIcon className='h-4 w-4' />
													</IconButton>
												</Tooltip>
												<Tooltip content='View tag'>
													<Link href={`/tags/${slug}`}>
														<IconButton variant='text' color='blue-gray'>
															<MagnifyingGlassIcon className='h-4 w-4' />
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

			<DeleteTagDialog
				openDeleteTagDialog={openDeleteTagDialog}
				handleopenDeleteTagDialog={handleopenDeleteTagDialog}
				selectedTagId={selectedTagId}
				deleteTag={deleteTag}
			/>
			<EditTagDialog
				openEditTagDialog={openEditTagDialog}
				handleopenEditTagDialog={handleopenEditTagDialog}
				editTag={editTag}
				allCollors={allCollors}
			/>
			<CreateTagDialog
				openCreateTagDialog={openCreateTagDialog}
				handleopenCreateTagDialog={handleopenCreateTagDialog}
				createTag={createTag}
				allCollors={allCollors}
			/>
		</CardBody>
	);
}

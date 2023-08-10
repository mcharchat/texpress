import {
	Avatar,
	CardBody,
	Chip,
	IconButton,
	Tooltip,
	Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { colors } from "@material-tailwind/react/types/generic";
import TableRow from "@/lib/types/Comment";
import { Dispatch, SetStateAction, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteCommentDialog from "./DeleteCommentDialog";
import EditCommentDialog from "./EditCommentDialog";
import CurrentUserContext from "@/lib/providers/CurrentUserContext";
import Tag from "@/lib/types/Tag";
import Category from "@/lib/types/Category";
import { Icon } from "@iconify/react";

export default function CommentsBody({
	tableHead,
	tableHeadDict,
	filteredData,
	setSortField,
	setSortDirection,
	sortField,
	sortDirection,
	setSelectedCommentId,
	setopenDeleteCommentDialog,
	setopenEditCommentDialog,
	openEditCommentDialog,
	openDeleteCommentDialog,
	handleopenDeleteCommentDialog,
	handleopenEditCommentDialog,
	deleteComment,
	editComment,
	selectedCommentId,
	loading,
	tabsValue,
	stateColorDict,
}: {
	tableHead: string[];
	tableHeadDict: { [key: string]: string };
	filteredData: TableRow[];
	setSortField: Dispatch<SetStateAction<string>>;
	setSortDirection: Dispatch<SetStateAction<string>>;
	sortField: string;
	sortDirection: string;
	setSelectedCommentId: Dispatch<SetStateAction<string | null>>;
	setopenDeleteCommentDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			state: string;
		}>
	>;
	setopenEditCommentDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			commentDetails: any;
		}>
	>;
	openEditCommentDialog: {
		open: boolean;
		commentDetails: TableRow | null;
	};
	openDeleteCommentDialog: {
		open: boolean;
		state: string;
	};
	handleopenDeleteCommentDialog: () => void;
	handleopenEditCommentDialog: () => void;
	deleteComment: (id: string | null, state: string) => void;
	editComment: (commentData: any) => void;
	selectedCommentId: string | null;
	loading: boolean;
	tabsValue: string;
	stateColorDict: { [key: string]: string };
}) {
	const currentUser = useContext(CurrentUserContext);
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
								<td className='p-4 flex flex-col'>
									<div className='flex'>
										<div className='grow min-w-[50px]'>
											<Skeleton />
										</div>
									</div>
									<div className='flex'>
										<div className='w-9 h-9 m-1'>
											<Skeleton circle className='h-9 aspect-square' />
										</div>
										<div className='grow min-w-[50px]'>
											<Skeleton count={2} />
										</div>
									</div>
								</td>
								<td className='p-4'>
									<Skeleton count={4} />
								</td>
								<td className='p-4'>
									<Skeleton />
								</td>
								<td className='p-4'>
									<Skeleton count={3} />
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
										No comments found
									</Typography>
								</div>
							</td>
						</tr>
					) : (
						filteredData.map(
							(
								{
									_id,
									author,
									authorEmail,
									authorName,
									stateChangedAt,
									state,
									createdAt,
									updatedAt,
									content,
									parent,
									post,
								},
								index
							) => {
								const isLast = index === filteredData.length - 1;
								const classes = isLast
									? "p-4"
									: "p-4 border-b border-blue-gray-50";

								return (
									<tr
										key={index}
										onDoubleClick={() => {
											setSelectedCommentId(_id);
											setopenEditCommentDialog({
												open: true,
												commentDetails: filteredData[index],
											});
										}}
									>
										<td className={classes}>
											<div className='flex flex-col gap-3'>
												<div className='flex'>
													{tabsValue === "all" && (
														<Chip
															variant='ghost'
															size='sm'
															value={state}
															color={stateColorDict[state] as colors}
															className='w-max transition-all'
														/>
													)}
												</div>
												<div className='flex flex-row gap-3'>
													{author ? (
														author.img ? (
															<Avatar
																src={author.img}
																alt={author.name}
																withBorder={true}
																color='blue'
																className='p-0.5'
																size='sm'
															/>
														) : (
															<div>
																<div className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-gray-100 text-blue-gray-500 border-2 border-blue-500 p-0.5'>
																	{author.name[0]}
																</div>
															</div>
														)
													) : (
														<div>
															<div className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-gray-100 text-blue-gray-500 border-2 border-blue-500 p-0.5'>
																{authorName[0]}
															</div>
														</div>
													)}
													<div className='flex flex-col'>
														<Typography
															variant='small'
															color='blue-gray'
															className='font-normal break-all'
														>
															{author ? author.name : authorName}
														</Typography>
														<Typography
															variant='small'
															color='blue-gray'
															className='font-normal opacity-70 break-all'
														>
															{author ? author.email : authorEmail}
														</Typography>
													</div>
												</div>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-wrap gap-1 justify-start'>
												<p
													className='block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal text-justify pb-2'
													dangerouslySetInnerHTML={{ __html: content }}
												></p>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-wrap gap-1 justify-start'>
												<Typography
													variant='small'
													color='blue'
													className='font-normal hover:underline flex'
												>
													<Link href={`/blog/${post?.slug}`}>
														{post?.title}
													</Link>
												</Typography>
												<p
													className='block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal text-justify pb-2'
													dangerouslySetInnerHTML={{
														__html: parent
															? parent.content
															: "No previous comment",
													}}
												></p>
											</div>
										</td>

										<td className={classes}>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal text-center pb-2'
											>
												Created at {new Date(createdAt).toLocaleString()}
											</Typography>

											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal text-center pb-2'
											>
												Updated at {new Date(updatedAt).toLocaleString()}
											</Typography>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal text-center'
											>
												{state.charAt(0).toUpperCase() + state.slice(1)} at{" "}
												{new Date(stateChangedAt).toLocaleString()}
											</Typography>
										</td>
										<td className={classes}>
											<div className='flex gap-2 flex-wrap justify-center'>
												<Tooltip content='Edit comment'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedCommentId(_id);
															setopenEditCommentDialog({
																open: true,
																commentDetails: filteredData[index],
															});
														}}
													>
														<Icon
															icon='heroicons:pencil-solid'
															className='h-4 w-4'
														/>
													</IconButton>
												</Tooltip>
												<Tooltip
													content={
														state === "trashed"
															? "Delete comment"
															: "Trash comment"
													}
												>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedCommentId(_id);
															setopenDeleteCommentDialog({ open: true, state });
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

			<DeleteCommentDialog
				openDeleteCommentDialog={openDeleteCommentDialog}
				handleopenDeleteCommentDialog={handleopenDeleteCommentDialog}
				selectedCommentId={selectedCommentId}
				deleteComment={deleteComment}
				tabsValue={tabsValue}
			/>
			<EditCommentDialog
				openEditCommentDialog={openEditCommentDialog}
				handleopenEditCommentDialog={handleopenEditCommentDialog}
				editComment={editComment}
			/>
		</CardBody>
	);
}

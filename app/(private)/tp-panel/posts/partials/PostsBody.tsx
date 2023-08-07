import {
	Avatar,
	CardBody,
	Chip,
	IconButton,
	Tooltip,
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
import { colors } from "@material-tailwind/react/types/generic";
import TableRow from "@/lib/types/TableRow";
import { Dispatch, SetStateAction, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeletePostDialog from "./DeletePostDialog";
import EditPostDialog from "./EditPostDialog";
import CreatePostDialog from "./CreatePostDialog";
import PopOverComment from "./PopOverComment";
import CurrentUserContext from "@/lib/providers/CurrentUserContext";
import Tag from "@/lib/types/Tag";
import Category from "@/lib/types/Category";

export default function PostsBody({
	tableHead,
	tableHeadDict,
	filteredData,
	setSortField,
	setSortDirection,
	sortField,
	sortDirection,
	setSelectedPostId,
	setopenDeletePostDialog,
	setopenEditPostDialog,
	openEditPostDialog,
	openDeletePostDialog,
	openCreatePostDialog,
	handleopenDeletePostDialog,
	handleopenEditPostDialog,
	handleopenCreatePostDialog,
	createPost,
	deletePost,
	editPost,
	selectedPostId,
	categories,
	tags,
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
	setSelectedPostId: Dispatch<SetStateAction<string | null>>;
	setopenDeletePostDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			state: string;
		}>
	>;
	setopenEditPostDialog: Dispatch<
		SetStateAction<{
			open: boolean;
			postDetails: any;
		}>
	>;
	openEditPostDialog: {
		open: boolean;
		postDetails: TableRow | null;
	};
	openDeletePostDialog: {
		open: boolean;
		state: string;
	};
	openCreatePostDialog: boolean;
	handleopenDeletePostDialog: () => void;
	handleopenEditPostDialog: () => void;
	handleopenCreatePostDialog: () => void;
	createPost: (postData: any) => void;
	deletePost: (id: string | null, state: string) => void;
	editPost: (postData: any) => void;
	selectedPostId: string | null;
	categories: Category[];
	tags: Tag[];
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
									<Skeleton count={3} />
								</td>
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
									<Skeleton count={2} />
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
										No posts found
									</Typography>
								</div>
							</td>
						</tr>
					) : (
						filteredData.map(
							(
								{
									_id,
									title,
									subtitle,
									author,
									stateChangedAt,
									categories,
									tags,
									comments,
									state,
									createdAt,
									updatedAt,
									slug,
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
											setSelectedPostId(_id);
											setopenEditPostDialog({
												open: true,
												postDetails: filteredData[index],
											});
										}}
									>
										<td className={classes}>
											<div className='flex flex-col'>
												{tabsValue === "all" && (
													<Chip
														variant='ghost'
														size='sm'
														value={state}
														color={stateColorDict[state] as colors}
														className='w-max transition-all'
													/>
												)}
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal'
												>
													{title}
												</Typography>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal opacity-70'
												>
													{subtitle}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className='flex items-center gap-3'>
												{author.img ? (
													<Avatar
														src={author.img}
														alt={author.name}
														withBorder={true}
														className='p-0.5'
														size='sm'
													/>
												) : (
													<div>
														<div className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-gray-100 text-blue-gray-500'>
															{author.name[0]}
														</div>
													</div>
												)}
												<div className='flex flex-col'>
													<Typography
														variant='small'
														color='blue-gray'
														className='font-normal break-all'
													>
														{author.name}
													</Typography>
													<Typography
														variant='small'
														color='blue-gray'
														className='font-normal opacity-70 break-all'
													>
														{author.email}
													</Typography>
												</div>
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-wrap gap-1 justify-center'>
												{categories.map(({ name }, index) => (
													<Chip
														key={index}
														size='sm'
														variant='outlined'
														value={name}
													/>
												))}
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-wrap gap-1 justify-center'>
												{tags.map(({ name, color }, index) => (
													<Chip
														key={index}
														variant='ghost'
														size='sm'
														value={name}
														color={color as colors}
													/>
												))}
											</div>
										</td>
										<td className={classes}>
											<div className='flex flex-wrap gap-1 justify-center'>
												{comments?.length > 0 ? (
													<PopOverComment
														triggerElement={
															<Link
																href={`/tp-panel/posts/comments/${_id}`}
																className='px-1'
															>
																<Typography
																	variant='small'
																	color='blue'
																	className='font-normal cursor-pointer'
																>
																	{comments?.length}
																</Typography>
															</Link>
														}
													>
														{comments?.map(
															(
																{ content, createdAt, author, authorName },
																index
															) => {
																return (
																	<div
																		key={index}
																		className={`flex mb-2 gap-4 min-w-[20rem] ${
																			currentUser?.id === author?.id
																				? "flex-row-reverse"
																				: ""
																		}`}
																	>
																		<div className='w-6 h-6 aspect-square'>
																			{author?.img ? (
																				<Avatar
																					src={author.img}
																					alt={author.name}
																					withBorder={true}
																					className='p-[0.0625rem]'
																					size='xs'
																				/>
																			) : (
																				<div className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-gray-100 text-blue-gray-500 border-2 border-blue-500 p-[0.5rem]'>
																					{author
																						? author.name[0]
																						: authorName[0]}
																				</div>
																			)}
																		</div>
																		<div className='bg-light-green-500/20 rounded-md p-1 max-w-[15rem]'>
																			<div className='p-2'>
																				<div className='font-semibold'>
																					{author ? author.name : authorName}
																				</div>
																				<div>{content}</div>
																			</div>
																			<div className='text-end pr-2 text-xs font-light'>
																				{new Date(createdAt).toLocaleString()}
																			</div>
																		</div>
																	</div>
																);
															}
														)}
													</PopOverComment>
												) : (
													<Typography variant='small' className='font-normal'>
														{comments?.length}
													</Typography>
												)}
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
												<Tooltip content='Edit post'>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedPostId(_id);
															setopenEditPostDialog({
																open: true,
																postDetails: filteredData[index],
															});
														}}
													>
														<PencilIcon className='h-4 w-4' />
													</IconButton>
												</Tooltip>
												<Tooltip
													content={
														state === "trashed" ? "Delete post" : "Trash post"
													}
												>
													<IconButton
														variant='text'
														color='blue-gray'
														onClick={() => {
															setSelectedPostId(_id);
															setopenDeletePostDialog({ open: true, state });
														}}
													>
														<TrashIcon className='h-4 w-4' />
													</IconButton>
												</Tooltip>
												<Tooltip content='View post'>
													<Link href={`/posts/${slug}`}>
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

			<DeletePostDialog
				openDeletePostDialog={openDeletePostDialog}
				handleopenDeletePostDialog={handleopenDeletePostDialog}
				selectedPostId={selectedPostId}
				deletePost={deletePost}
				tabsValue={tabsValue}
			/>
			<EditPostDialog
				openEditPostDialog={openEditPostDialog}
				handleopenEditPostDialog={handleopenEditPostDialog}
				editPost={editPost}
				categories={categories}
				tags={tags}
			/>
			<CreatePostDialog
				openCreatePostDialog={openCreatePostDialog}
				handleopenCreatePostDialog={handleopenCreatePostDialog}
				createPost={createPost}
				categories={categories}
				tags={tags}
			/>
		</CardBody>
	);
}

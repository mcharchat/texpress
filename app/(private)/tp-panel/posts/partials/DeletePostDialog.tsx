import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from "@material-tailwind/react";

export default function DeletePostDialog({
	openDeletePostDialog,
	handleopenDeletePostDialog,
	selectedPostId,
	deletePost,
	tabsValue,
}: {
	openDeletePostDialog: {
		open: boolean;
		state: string;
	};
	handleopenDeletePostDialog: () => void;
	selectedPostId: string | null;
	deletePost: (id: string | null, state: string) => void;
	tabsValue: string;
}) {
	return (
		<Dialog
			open={openDeletePostDialog.open}
			handler={handleopenDeletePostDialog}
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Confirm Delete
				</Typography>
			</DialogHeader>
			<DialogBody divider>
				<Typography variant='paragraph' color='blue-gray'>
					{openDeletePostDialog.state === "trashed" ? (
						<>
							Are you sure you want to remove permanently this post? This action
							can not be undone.
						</>
					) : (
						<>Are you sure you want to trash this post?</>
					)}
				</Typography>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenDeletePostDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button
					variant='gradient'
					color='green'
					onClick={() => {
						deletePost(selectedPostId, openDeletePostDialog.state);
					}}
				>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

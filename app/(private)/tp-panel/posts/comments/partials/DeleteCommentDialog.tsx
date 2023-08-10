import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from "@material-tailwind/react";

export default function DeleteCommentDialog({
	openDeleteCommentDialog,
	handleopenDeleteCommentDialog,
	selectedCommentId,
	deleteComment,
	tabsValue,
}: {
	openDeleteCommentDialog: {
		open: boolean;
		state: string;
	};
	handleopenDeleteCommentDialog: () => void;
	selectedCommentId: string | null;
	deleteComment: (id: string | null, state: string) => void;
	tabsValue: string;
}) {
	return (
		<Dialog
			open={openDeleteCommentDialog.open}
			handler={handleopenDeleteCommentDialog}
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Confirm Delete
				</Typography>
			</DialogHeader>
			<DialogBody divider>
				<Typography variant='paragraph' color='blue-gray'>
					{openDeleteCommentDialog.state === "trashed" ? (
						<>
							Are you sure you want to remove permanently this comment? This action
							can not be undone.
						</>
					) : (
						<>Are you sure you want to trash this comment?</>
					)}
				</Typography>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenDeleteCommentDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button
					variant='gradient'
					color='green'
					onClick={() => {
						deleteComment(selectedCommentId, openDeleteCommentDialog.state);
					}}
				>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

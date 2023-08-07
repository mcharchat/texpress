import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from "@material-tailwind/react";

export default function DeleteTagDialog({
	openDeleteTagDialog,
	handleopenDeleteTagDialog,
	selectedTagId,
	deleteTag,
}: {
	openDeleteTagDialog: {
		open: boolean;
	};
	handleopenDeleteTagDialog: () => void;
	selectedTagId: string | null;
	deleteTag: (id: string | null) => void;
}) {
	return (
		<Dialog
			open={openDeleteTagDialog.open}
			handler={handleopenDeleteTagDialog}
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Confirm Delete
				</Typography>
			</DialogHeader>
			<DialogBody divider>
				<Typography variant='paragraph' color='blue-gray'>
					Are you sure you want to remove permanently this tag? This action
							can not be undone.
				</Typography>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenDeleteTagDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button
					variant='gradient'
					color='green'
					onClick={() => {
						deleteTag(selectedTagId);
					}}
				>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

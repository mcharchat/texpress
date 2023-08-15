import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from "@material-tailwind/react";

export default function DeleteUserDialog({
	openDeleteUserDialog,
	handleopenDeleteUserDialog,
	selectedUserId,
	deleteUser,
}: {
	openDeleteUserDialog: {
		open: boolean;
	};
	handleopenDeleteUserDialog: () => void;
	selectedUserId: string | null;
	deleteUser: (id: string | null) => void;
}) {
	return (
		<Dialog
			open={openDeleteUserDialog.open}
			handler={handleopenDeleteUserDialog}
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Confirm Delete
				</Typography>
			</DialogHeader>
			<DialogBody divider>
				<Typography variant='paragraph' color='blue-gray'>
					Are you sure you want to remove permanently this user? This action
							can not be undone.
				</Typography>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenDeleteUserDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button
					variant='gradient'
					color='green'
					onClick={() => {
						deleteUser(selectedUserId);
					}}
				>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

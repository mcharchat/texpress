import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";

export default function DeleteAccountDialog({
	openDeleteAccountDialog,
	handleopenDeleteAccountDialog,
	deleteAccount,
}: {
	openDeleteAccountDialog: boolean;
	handleopenDeleteAccountDialog: () => void;
	deleteAccount: () => void;
}) {
	return (
		<Dialog open={openDeleteAccountDialog} handler={handleopenDeleteAccountDialog}>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Confirm Delete
				</Typography>
			</DialogHeader>
			<DialogBody divider>
				<Typography variant='paragraph' color='blue-gray'>
					Are you sure you want to delete this account? This action is not reversible.
				</Typography>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenDeleteAccountDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button
					variant='gradient'
					color='green'
					onClick={() => {
						deleteAccount();
					}}
				>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}
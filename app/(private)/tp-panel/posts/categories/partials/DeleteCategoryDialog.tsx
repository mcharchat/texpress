import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Typography,
} from "@material-tailwind/react";

export default function DeleteCategoryDialog({
	openDeleteCategoryDialog,
	handleopenDeleteCategoryDialog,
	selectedCategoryId,
	deleteCategory,
}: {
	openDeleteCategoryDialog: {
		open: boolean;
	};
	handleopenDeleteCategoryDialog: () => void;
	selectedCategoryId: string | null;
	deleteCategory: (id: string | null) => void;
}) {
	return (
		<Dialog
			open={openDeleteCategoryDialog.open}
			handler={handleopenDeleteCategoryDialog}
		>
			<DialogHeader>
				<Typography variant='h6' weight='bold' color='blue-gray'>
					Confirm Delete
				</Typography>
			</DialogHeader>
			<DialogBody divider>
				<Typography variant='paragraph' color='blue-gray'>
					Are you sure you want to remove permanently this category? This action
							can not be undone.
				</Typography>
			</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					color='red'
					onClick={handleopenDeleteCategoryDialog}
					className='mr-1'
				>
					<span>Cancel</span>
				</Button>
				<Button
					variant='gradient'
					color='green'
					onClick={() => {
						deleteCategory(selectedCategoryId);
					}}
				>
					<span>Confirm</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}

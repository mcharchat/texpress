import { Button, CardFooter, Typography } from "@material-tailwind/react";
import { Dispatch, SetStateAction } from "react";

export default function CategoriesFooter({
	selectedPage,
	totalPages,
	setSelectedPage,
}: {
	selectedPage: number;
	totalPages: number;
	setSelectedPage: Dispatch<SetStateAction<number>>;
}) {
	return (
		<CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4 sticky bottom-0 bg-white z-[1]'>
			<Typography variant='small' color='blue-gray' className='font-normal'>
				Page {selectedPage + 1} of {totalPages}
			</Typography>
			<div className='flex gap-2'>
				<Button
					variant='outlined'
					color='blue-gray'
					size='sm'
					onClick={() => setSelectedPage(selectedPage - 1)}
					disabled={selectedPage <= 0}
				>
					Previous
				</Button>
				<Button
					variant='outlined'
					color='blue-gray'
					size='sm'
					onClick={() => setSelectedPage(selectedPage + 1)}
					disabled={selectedPage >= totalPages - 1}
				>
					Next
				</Button>
			</div>
		</CardFooter>
	);
}
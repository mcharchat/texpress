import React from "react";
import {
	Menu,
	MenuHandler,
	Button,
	MenuList,
	MenuItem,
	Checkbox,
} from "@material-tailwind/react";
import { dismiss } from "@material-tailwind/react/types/components/menu";

interface MenuWithCheckboxProps {
	label: string;
	options: {
		id: string;
		label: string;
	}[];
	selectedOptions?: string[];
	setSelectedOptions?: any;
}
interface ExtendedDismiss extends dismiss {
	isRequired: {
		itemPress: boolean;
	};
}

const dismissValue: ExtendedDismiss = {
	itemPress: false,
	isRequired: {
		itemPress: false,
	},
};

const MenuWithCheckbox: React.FC<
	MenuWithCheckboxProps & React.HTMLAttributes<HTMLDivElement>
> = ({
	label,
	options,
	selectedOptions,
	setSelectedOptions,
	...props
}: MenuWithCheckboxProps & React.HTMLAttributes<HTMLDivElement>) => {
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id } = event.target;
		if (selectedOptions?.includes(id)) {
			setSelectedOptions(selectedOptions.filter((option) => option !== id));
		}
		if (!selectedOptions?.includes(id)) {
			setSelectedOptions([...(selectedOptions as []), id]);
		}
	};

	return (
		<Menu dismiss={dismissValue}>
			<MenuHandler>
				<div>
					<Button
						ripple={false}
						variant='outlined'
						className='normal-case px-3 peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm py-2.5 rounded-[7px] border-blue-gray-200'
					>
						{selectedOptions?.length
							? selectedOptions?.length + " selected"
							: "Select an option"}
					</Button>
					<label className='leading-tight font-normal text-[11px] relative'>
						<div className='absolute mx-2.5 px-1 top-[-22px] bg-white'>
							{label}
						</div>
					</label>
				</div>
			</MenuHandler>
			<MenuList className='z-[9999] max-h-72 overflow-y-scroll custom-scroll custom-y-scroll w-[calc(100%-2.5rem)]'>
				{options.map((option: { id: string; label: string }, index: number) => {
					return (
						<MenuItem className='p-0' key={index}>
							<label
								htmlFor={option.id}
								className='flex cursor-pointer items-center gap-2 p-2'
							>
								<Checkbox
									ripple={false}
									id={option.id}
									containerProps={{ className: "p-0" }}
									className='hover:before:content-none'
									checked={selectedOptions?.includes(option.id)}
									onChange={handleCheckboxChange}
								/>
								{option.label}
							</label>
						</MenuItem>
					);
				})}
			</MenuList>
		</Menu>
	);
};

export default MenuWithCheckbox;

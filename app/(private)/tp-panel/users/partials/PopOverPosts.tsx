import React from "react";
import {
	Popover,
	PopoverHandler,
	PopoverContent,
} from "@material-tailwind/react";

export default function PopOverComment({
	triggerElement,
	children,
}: {
	triggerElement: any;
	children: any;
}) {
	const [openPopover, setOpenPopover] = React.useState(false);

	const triggers = {
		onMouseEnter: () => setOpenPopover(true),
		onMouseLeave: () => setOpenPopover(false),
	};

	return (
		<Popover open={openPopover} handler={setOpenPopover}>
			<PopoverHandler {...triggers}>{triggerElement}</PopoverHandler>
			<PopoverContent
				{...triggers}
				className='max-w-[26rem] max-h-[15rem] overflow-y-scroll custom-scroll custom-y-scroll'
			>
				{children}
			</PopoverContent>
		</Popover>
	);
}

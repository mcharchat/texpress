import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Chip,
	List,
	ListItem,
	ListItemPrefix,
	ListItemSuffix,
	Typography,
} from "@material-tailwind/react";
import {
	PresentationChartBarIcon,
	ShoppingBagIcon,
	UserCircleIcon,
	Cog6ToothIcon,
	InboxIcon,
	PowerIcon,
	RectangleStackIcon,
	DocumentIcon,
	UserIcon,
	ChatBubbleBottomCenterIcon,
	PhotoIcon,
	PaintBrushIcon,
} from "@heroicons/react/24/solid";
import {
	ChevronRightIcon,
	ChevronDownIcon,
	ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import TexPress from "@/app/pictures/svg/TexPress.svg";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuContentProps {
	hasMinifier: boolean;
	isMinified: boolean;
	handleMinify: () => void;
	openCollapsible: any;
	handleOpenCollapsible: (value: any) => void;
	handleLogout: () => void;
	closeTheDrawer: () => void;
}

const menuItems = [
	{
		title: "Dashboard",
		icon: <PresentationChartBarIcon className='h-5 w-5' />,
		link: "/tp-panel",
	},
	{
		title: "Posts",
		icon: <RectangleStackIcon className='h-5 w-5' />,
		children: [
			{
				title: "All Posts",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/posts",
			},
			{
				title: "Comments",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/posts/comments",
			},
			{
				title: "Categories",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/posts/categories",
			},
			{
				title: "Tags",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/posts/tags",
			},
		],
	},
	{
		title: "Media",
		icon: <PhotoIcon className='h-5 w-5' />,
		children: [
			{
				title: "Library",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/media",
			},
		],
	},
	{
		title: "Pages",
		icon: <DocumentIcon className='h-5 w-5' />,
		children: [
			{
				title: "All Pages",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/pages",
			},
		],
	},
	{
		title: "Appearance",
		icon: <PaintBrushIcon className='h-5 w-5' />,
		children: [
			{
				title: "Themes",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/appearance/themes",
			},
		],
	},
	{
		title: "Users",
		icon: <UserIcon className='h-5 w-5' />,
		children: [
			{
				title: "All Users",
				icon: <ChevronRightIcon className='h-5 w-5' />,
				link: "/tp-panel/users",
			},
		],
	},
	{
		title: "Profile",
		icon: <UserCircleIcon className='h-5 w-5' />,
		link: "/tp-panel/profile",
	},
	{
		title: "Settings",
		icon: <Cog6ToothIcon className='h-5 w-5' />,
		link: "/tp-panel/settings",
	},
];
// this menu context has props with an object value, one of them is a key named hasMinifier, which is a boolean value
export default function MenuContent({
	hasMinifier,
	isMinified,
	handleMinify,
	openCollapsible,
	handleOpenCollapsible,
	handleLogout,
	closeTheDrawer,
}: MenuContentProps) {
	const [open, setOpen] = useState(0);

	const handleOpen = (value: any) => {
		setOpen(open === value ? 0 : value);
	};

	const path = usePathname();

	return (
		<>
			<div className='bg-gray-100 sticky -top-8 pt-4' style={
				{
					zIndex: 100,
				}
			}>
				<Link
					href={"/tp-panel"}
					className='mb-2 flex flex-col items-center gap-2 p-2'
					onClick={closeTheDrawer}
				>
					<Image
						className='w-10 h-10 transition-all'
						src={TexPress}
						alt='TexPress'
						priority={true}
						style={{
							marginTop: isMinified ? "1.11rem" : "0",
							marginBottom: isMinified ? "1.11rem" : "0",
						}}
					/>
					<Typography
						variant='h5'
						color='blue-gray'
						style={{
							display: isMinified ? "none" : "block",
						}}
					>
						TexPress
					</Typography>
				</Link>
			</div>
			<List
				style={{
					minWidth: isMinified ? "auto" : "240px",
				}}
				className='px-1.5'
			>
				{menuItems.map((item, index) =>
					item.children ? (
						<Accordion
							key={index}
							open={openCollapsible === index}
							icon={
								<ChevronDownIcon
									strokeWidth={2.5}
									className={`mx-auto h-4 w-4 transition-transform ${
										openCollapsible === index ? "rotate-180" : ""
									}`}
								/>
							}
						>
							<ListItem className='p-0'>
								<AccordionHeader
									onClick={() => handleOpenCollapsible(index)}
									className='border-b-0 p-3'
								>
									<ListItemPrefix className='aqui my-1'>
										{item.icon}
									</ListItemPrefix>
									<Typography
										color='blue-gray'
										className='mr-auto font-normal'
										style={{ display: isMinified ? "none" : "block" }}
									>
										{item.title}
									</Typography>
								</AccordionHeader>
							</ListItem>
							<AccordionBody className='py-1'>
								<List className='p-0'>
									{item.children.map((child, index) => (
										<Link
											href={child.link}
											className='flex items-center gap-2 px-3'
											key={index}
											onClick={closeTheDrawer}
										>
											<ListItem selected={child.link == path}>
												<ListItemPrefix className='aqui my-1'>
													{child.icon}
												</ListItemPrefix>
												<Typography
													color='blue-gray'
													className='mr-auto font-normal'
													style={{ display: isMinified ? "none" : "block" }}
												>
													{child.title}
												</Typography>
											</ListItem>
										</Link>
									))}
								</List>
							</AccordionBody>
						</Accordion>
					) : (
						<Link
							href={item.link}
							className='flex items-center'
							key={index}
							onClick={closeTheDrawer}
						>
							<ListItem selected={item.link == path}>
								<ListItemPrefix className='aqui my-1'>
									{item.icon}
								</ListItemPrefix>
								<Typography
									color='blue-gray'
									className='mr-auto font-normal'
									style={{ display: isMinified ? "none" : "block" }}
								>
									{item.title}
								</Typography>
							</ListItem>
						</Link>
					)
				)}
				<ListItem
					onClick={() => {
						closeTheDrawer();
						handleLogout();
					}}
				>
					<ListItemPrefix>
						<PowerIcon className='h-5 w-5' />
					</ListItemPrefix>
					<Typography
						color='blue-gray'
						className='mr-auto font-normal'
						style={{ display: isMinified ? "none" : "block" }}
					>
						Logout
					</Typography>
				</ListItem>
				{hasMinifier ? (
					<ListItem onClick={handleMinify}>
						<div className='flex items-center'>
							<ListItemPrefix className='aqui my-1'>
								<ChevronDoubleLeftIcon
									strokeWidth={3}
									className='h-5 w-5 transition-all'
									style={{
										transform: isMinified ? "scaleX(-1)" : "scaleX(1)",
									}}
								/>
							</ListItemPrefix>
							<Typography
								color='blue-gray'
								className='mr-auto font-normal'
								style={{ display: isMinified ? "none" : "block" }}
							>
								Collapse Menu
							</Typography>
						</div>
					</ListItem>
				) : (
					<></>
				)}
			</List>
		</>
	);
}

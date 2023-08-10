import {
	Button,
	CardHeader,
	IconButton,
	Input,
	Tab,
	Tabs,
	TabsHeader,
	Typography,
} from "@material-tailwind/react";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Icon } from "@iconify/react";

export default function PostsHeader({
	setInputElement,
	inputElement,
	inputElementRef,
	setSelectedPage,
	setTabsValue,
	tabsValue,
	tabsElementRef,
	tabs,
}: {
	setInputElement: Dispatch<SetStateAction<string>>;
	inputElement: string;
	inputElementRef: RefObject<HTMLInputElement>;
	setSelectedPage: Dispatch<SetStateAction<number>>;
	setTabsValue: Dispatch<SetStateAction<string>>;
	tabsValue: string;
	tabsElementRef: RefObject<HTMLDivElement>;
	tabs: {
		label: string;
		value: string;
	}[];
}) {
	return (
		<CardHeader
			floated={false}
			shadow={false}
			className='bg-transparent rounded-none'
		>
			<div className='mb-8 flex items-center justify-between gap-8'>
				<div>
					<Typography variant='h5' color='blue-gray'>
						All comments
					</Typography>
					<Typography color='gray' className='mt-1 font-normal'>
						See information about all comments
					</Typography>
				</div>
				<div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
					<Button
						variant='outlined'
						color='blue-gray'
						size='sm'
						onClick={() => {
							setInputElement("");
							setSelectedPage(0);
							const element = document.getElementById("all-tab");
							if (element) {
								element.click();
							}
						}}
					>
						view all
					</Button>
				</div>
			</div>
			<div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
				<Tabs
					value={tabsValue}
					className='w-full md:w-max'
					ref={tabsElementRef}
				>
					<TabsHeader className='bg-gray-100 bg-opacity-100 overflow-x-auto custom-scroll custom-x-scroll'>
						{tabs.map(({ label, value }: { label: string; value: string }) => (
							<Tab
								id={`${value}-tab`}
								key={value}
								value={value}
								onClick={() => setTabsValue(value)}
							>
								&nbsp;{label}&nbsp;
							</Tab>
						))}
					</TabsHeader>
				</Tabs>
				<div className='w-full md:w-72'>
					<Input
						label='Search'
						value={inputElement}
						onChange={(event) => {
							setInputElement(event.currentTarget.value);
						}}
						icon={
							inputElement && (
								<>
									<IconButton
										variant='text'
										color='blue-gray'
										className='h-5 w-5'
										onClick={() => {
											setInputElement("");
										}}
									>
										<Icon icon='heroicons:x-mark' className='h-3 w-3' />
									</IconButton>
								</>
							)
						}
						ref={inputElementRef}
					/>
				</div>
			</div>
		</CardHeader>
	);
}

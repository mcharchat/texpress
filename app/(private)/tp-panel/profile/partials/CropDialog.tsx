import React, { useState } from "react";
import {
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Button,
	Typography,
	IconButton,
} from "@material-tailwind/react";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop/types";

interface CropDialogProps {
	img: string;
	setImg: React.Dispatch<React.SetStateAction<string>>;
	openCropDialog: boolean;
	setOpenCropDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const CropDialog: React.FC<CropDialogProps> = ({
	img,
	setImg,
	openCropDialog,
	setOpenCropDialog,
}) => {
	const handleOpen = () => setOpenCropDialog((cur) => !cur);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState<number>(1);
	const [croppedArea, setCroppedArea] = useState<Area | null>(null);

	const onCropComplete = (
		croppedAreaPercentage: Area,
		croppedAreaPixels: Area
	) => {
		setCroppedArea(croppedAreaPixels);
	};

	const onCropDone = (imgCroppedArea: Area | null) => {
		if (!imgCroppedArea) return;
		const canvasEle = document.createElement("canvas");
		canvasEle.width = imgCroppedArea.width;
		canvasEle.height = imgCroppedArea.height;

		const context = canvasEle.getContext("2d");

		if (!context) return;

		let imageObj1 = new Image();
		imageObj1.src = img;
		imageObj1.onload = function () {
			context.drawImage(
				imageObj1,
				imgCroppedArea.x,
				imgCroppedArea.y,
				imgCroppedArea.width,
				imgCroppedArea.height,
				0,
				0,
				imgCroppedArea.width,
				imgCroppedArea.height
			);

			const dataURL = canvasEle.toDataURL("image/jpeg");

			setImg(dataURL);
			handleOpen();
		};
	};
	return (
		<Dialog size='xl' open={openCropDialog} handler={handleOpen}>
			<DialogHeader className='justify-between'>
				<Typography variant='h5' color='blue-gray'>
					Crop Image
				</Typography>
				<IconButton
					color='blue-gray'
					size='sm'
					variant='text'
					onClick={handleOpen}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
						className='h-5 w-5'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</IconButton>
			</DialogHeader>
			<DialogBody className='h-[70vh]'>
				<Cropper
					image={img}
					aspect={1 / 1}
					crop={crop}
					zoom={zoom}
					onCropChange={setCrop}
					onZoomChange={setZoom}
					onCropComplete={onCropComplete}
					maxZoom={10}
					style={{
						containerStyle: {
							width: "100%",
							height: "100%",
							backgroundColor: "#fff",
						},
					}}
				/>
			</DialogBody>
			<DialogFooter className='justify-center'>
					<Button
						variant='gradient'
						color='blue'
						onClick={() => {
							onCropDone(croppedArea);
						}}
					>
						Crop
					</Button>
			</DialogFooter>
		</Dialog>
	);
};

export default CropDialog;

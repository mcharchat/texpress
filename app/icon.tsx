import { ImageResponse } from "next/server";
import TexPressLogo from "@/app/pictures/image/TexPress";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
	return new ImageResponse(<TexPressLogo />, { ...size });
}

import { NextResponse } from "next/server";

export async function validateRequestContentType(request: Request) {
	//check if request is a valid json
	if (!request.headers.get("content-type")?.includes("application/json")) {
		return NextResponse.json(
			{
				error: "Invalid request. Please use JSON",
			},
			{ status: 400 }
		);
	}
	return null;
}

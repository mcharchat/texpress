import { NextResponse } from "next/server";
import { decrypt } from "../utils/SECRET_KEY";

export async function validateXCSRFToken(request: Request) {
	//check if request has a valid XCSTF token
	if (!request.headers.get("x-csrf-token")) {
		return NextResponse.json(
			{
				error: "Invalid request. Missing X-CSRF-Token",
			},
			{ status: 400 }
		);
	}
	// get the token from the request
	const token = request.headers.get("x-csrf-token");
	// parse the token
	const hash = JSON.parse(token || "{}");
	// decrypt the token
	const timestamp = parseInt(decrypt(hash), 10);
	 // if the timestamp is older than 1h, return an error
	if (Date.now() - timestamp > 3600000) {
		return NextResponse.json(
			{
				error: "Invalid request. X-CSRF-Token expired",
			},
			{ status: 400 }
		);
	}
	return null;
}

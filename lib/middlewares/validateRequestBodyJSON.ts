import { NextResponse } from "next/server";

export async function validateRequestBodyJSON(request: Request) {
	let body;
	try {
		body = await request.json();
		return body;
	} catch (error) {
		return null;
	}
}

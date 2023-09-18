import { NextResponse } from "next/server";
interface CreateUserBody {
	name: string;
	email: string;
	password: string;
	[key: string]: string;
}
export async function validateRequestBodyRequiredFields(
	body: CreateUserBody,
	requiredFields: string[]
) {
	const missingFields = requiredFields.filter((field) => !(field in body));
	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				error: `Missing required fields: ${missingFields.join(", ")}`,
			},
			{ status: 400 }
		);
	}
	// check if required fields are empty
	const emptyFields = requiredFields.filter((field) => !body[field]);
	if (emptyFields.length > 0) {
		return NextResponse.json(
			{
				error: `Required fields cannot be empty: ${emptyFields.join(", ")}`,
			},
			{ status: 400 }
		);
	}
	return null;
}

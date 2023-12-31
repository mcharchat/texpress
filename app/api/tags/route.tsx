import { TagModel } from "@/models";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { cookies } from "next/headers";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";

// this function get all the tags
export async function GET(request: Request) {
	// check xcsrf token on request header
	const xcsrfTokenError = await validateXCSRFToken(request);
	if (xcsrfTokenError) {
		return xcsrfTokenError;
	}

	// get user cookie from request header
	const cookieStore = cookies();
	const userCookie = cookieStore.get("user");

	if (!userCookie) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 400 }
		);
	}

	// decode user cookie
	const user = JSON.parse(userCookie.value);

	// validate user token
	const tokenReturn = checkValidJWT(user.token);

	if (!tokenReturn.valid) {
		return NextResponse.json(
			{
				error: tokenReturn.message,
			},
			{ status: 400 }
		);
	}

	// connect to database
	await dbConnect();

	// get tags
	const tags = await TagModel.find({}).populate({
		path: "posts",
		select: "title slug",
	});

	// return tags
	return NextResponse.json(
		{
			tags,
		},
		{ status: 200 }
	);
}

// this function create a new tag
export async function POST(request: Request) {
	// check xcsrf token on request header
	const xcsrfTokenError = await validateXCSRFToken(request);
	if (xcsrfTokenError) {
		return xcsrfTokenError;
	}

	// get user cookie from request header
	const cookieStore = cookies();
	const userCookie = cookieStore.get("user");

	if (!userCookie) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 400 }
		);
	}

	// decode user cookie
	const user = JSON.parse(userCookie.value);

	// validate user token
	const tokenReturn = checkValidJWT(user.token);

	if (!tokenReturn.valid) {
		return NextResponse.json(
			{
				error: tokenReturn.message,
			},
			{ status: 400 }
		);
	}

	// get tag data from request body
	const body = await request.json();

	// check request body has required fields
	const requiredFields = ["name", "slug", "color"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);

	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// connect to database
	await dbConnect();

	// create tag
	const newTag = await TagModel.create(body);

	// return tag
	return NextResponse.json(
		{
			tag: newTag,
		},
		{ status: 200 }
	);
}

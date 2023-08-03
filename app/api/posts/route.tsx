import { PostModel } from "@/models";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { cookies } from "next/headers";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { JwtPayload } from "jsonwebtoken";

// this function get all the posts
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

	// get posts
	const posts = await PostModel.find({})
		.populate({ path: "author", select: "img name email" })
		.populate({ path: "categories", select: "name" })
		.populate({ path: "tags", select: "name color" })
		.populate({
			path: "comments",
			select: "content createdAt authorName authorEmail",
			populate: { path: "author", select: "img name email" },
		});

	// return posts
	return NextResponse.json(
		{
			posts,
		},
		{ status: 200 }
	);
}

// this function create a post
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

	// check request content type
	const contentTypeError = await validateRequestContentType(request);
	if (contentTypeError) {
		return contentTypeError;
	}

	// check request body is JSON
	const body = await validateRequestBodyJSON(request);
	if (!body) {
		return NextResponse.json(
			{
				error: "Invalid request. Please provide a valid JSON body",
			},
			{ status: 400 }
		);
	}

	// check request body has required fields
	const requiredFields = ["title", "slug"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);
	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// manipulate body to add author and flatten categories and tags to their ids
	const postData = {
		...body,
		// get the author from the return of the token payload
		author: (tokenReturn.tokenContent as { id?: string })?.id,
		categories: body.categories.map((category: { id: string }) => category.id),
		tags: body.tags.map((tag: { id: string }) => tag.id),
		stateChangedAt: new Date(),
	};

	// connect to database
	await dbConnect();

	// create post
	const createdPost = await PostModel.create(postData);

	const post = await PostModel.findById(createdPost._id)
		.populate({ path: "author", select: "img name email" })
		.populate({ path: "categories", select: "name" })
		.populate({ path: "tags", select: "name color" })
		.populate({
			path: "comments",
			select: "content createdAt authorName authorEmail",
			populate: { path: "author", select: "img name email" },
		});

	// return post
	return NextResponse.json(
		{
			post,
		},
		{ status: 200 }
	);
}

import dbConnect from "@/lib/dbConnect";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { TagModel } from "@/models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// function for deleting a tag
export async function DELETE(
	request: Request,
	{ params }: { params: { _id: string } }
) {
	const _id = params._id;

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

	// find tag by id
	const tag = await TagModel.findById(_id).populate("posts");

	if (!tag) {
		return NextResponse.json(
			{
				error: "Tag not found",
			},
			{ status: 404 }
		);
	}

	// if tag has posts
	if (tag.posts?.length > 0) {
		return NextResponse.json(
			{
				error: "Tag has posts",
			},
			{ status: 400 }
		);
	}

	// delete tag
	await TagModel.findByIdAndDelete(_id);

	// return ok
	return NextResponse.json({
		status: 200,
	});
}

// route for editing a tag
export async function PUT(
	request: Request,
	{ params }: { params: { _id: string } }
) {
	const _id = params._id;

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

	// find tag by id
	const tag = await TagModel.findById(_id);

	if (!tag) {
		return NextResponse.json(
			{
				error: "Tag not found",
			},
			{ status: 404 }
		);
	}

	// update tag
	const updatedTag = await TagModel.findByIdAndUpdate(_id, body, {
		new: true,
	}).populate({
		path: "posts",
		select: "title slug",
	});

	// return updated tag
	return NextResponse.json(
		{
			tag: updatedTag,
		},
		{ status: 200 }
	);
}

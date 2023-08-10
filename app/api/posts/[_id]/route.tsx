import dbConnect from "@/lib/dbConnect";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { PostModel } from "@/models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

	// find post by id
	const post = await PostModel.findById(_id);
	if (!post) {
		return NextResponse.json(
			{
				error: "Post not found",
			},
			{ status: 404 }
		);
	}

	if (post.state === "trashed") {
		// delete post
		await PostModel.findByIdAndDelete(_id);
	} else {
		// update post state to trashed
		await PostModel.findByIdAndUpdate(
			_id,
			{
				state: "trashed",
				stateChangedAt: new Date(),
			},
			{ new: true }
		);
	}

	// return ok
	return NextResponse.json({
		status: 200,
	});
}

export async function PUT(
	request: Request,
	{ params }: { params: { _id: string } }
) {
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

	// connect to database
	await dbConnect();

	const oldPost = await PostModel.findById(params._id);
	// manipulate body to flatten categories and tags to their ids
	const postData = {
		...body,
		categories: body.categories.map((category: { id: string }) => category.id),
		tags: body.tags.map((tag: { id: string }) => tag.id),
		updatedAt: new Date(),
		stateChangedAt:
			oldPost.state !== body.state ? new Date() : oldPost.stateChangedAt,
	};

	// update post
	const updatedPost = await PostModel.findByIdAndUpdate(params._id, postData, {
		new: true,
	})
		.populate({ path: "author", select: "img name email" })
		.populate({ path: "categories", select: "name" })
		.populate({ path: "tags", select: "name color" })
		.populate({
			path: "comments",
			select: "content createdAt authorName authorEmail",
			populate: { path: "author", select: "img name email" },
		});

	// return updated post
	return NextResponse.json(
		{
			post: updatedPost,
		},
		{
			status: 200,
		}
	);
}

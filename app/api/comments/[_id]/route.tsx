import dbConnect from "@/lib/dbConnect";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { CommentModel } from "@/models";
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

	// find comment by id
	const comment = await CommentModel.findById(_id);
	if (!comment) {
		return NextResponse.json(
			{
				error: "Comment not found",
			},
			{ status: 404 }
		);
	}

	if (comment.state === "trashed") {
		// delete comment
		await CommentModel.findByIdAndDelete(_id);
	} else {
		// update comment state to trashed
		await CommentModel.findByIdAndUpdate(
			_id,
			{
				state: "trashed",
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
	const requiredFields = ["state", "content"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);
	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// connect to database
	await dbConnect();

	const oldComment = await CommentModel.findById(params._id);
	// manipulate body to flatten categories and tags to their ids
	const commentData = {
		...body,
		updatedAt: new Date(),
		stateChangedAt:
			oldComment.state !== body.state ? new Date() : oldComment.stateChangedAt,
	};

	// update comment
	const updatedComment = await CommentModel.findByIdAndUpdate(
		params._id,
		commentData,
		{
			new: true,
		}
	)
		.populate({
			path: "author",
			select: "name email img",
		})
		.populate({
			path: "parent",
			select: "content",
		})
		.populate({
			path: "post",
			select: "title slug",
		});

	// return updated comment
	return NextResponse.json(
		{
			comment: updatedComment,
		},
		{
			status: 200,
		}
	);
}

import dbConnect from "@/lib/dbConnect";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { CategoryModel } from "@/models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// route for deleting a category
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

	// find category by id
	const category = await CategoryModel.findById(_id).populate("posts");

	if (!category) {
		return NextResponse.json(
			{
				error: "Category not found",
			},
			{ status: 404 }
		);
	}

	// if category if parent
	const isParent = await CategoryModel.findOne({ parent: category._id });
	if (isParent) {
		return NextResponse.json(
			{
				error: "Category is parent",
			},
			{ status: 400 }
		);
	}

	// if category has posts
	if (category.posts?.length > 0) {
		return NextResponse.json(
			{
				error: "Category has posts",
			},
			{ status: 400 }
		);
	}

	// delete category
	await CategoryModel.findByIdAndDelete(_id);

	// return ok
	return NextResponse.json({
		status: 200,
	});
}

// route for editing a category
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
	const requiredFields = ["name", "slug"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);

	if (requiredFieldsError) {
		return requiredFieldsError;
	}
	// connect to database
	await dbConnect();

	// find category by id
	const category = await CategoryModel.findById(_id);

	if (!category) {
		return NextResponse.json(
			{
				error: "Category not found",
			},
			{ status: 404 }
		);
	}

	const categoryData = {
		...body,
		parent: body?.parent?.id || null,
		updatedAt: new Date(),
	};
	// update category
	const updatedCategory = await CategoryModel.findByIdAndUpdate(
		_id,
		categoryData,
		{
			new: true,
		}
	)
		.populate({
			path: "parent",
			select: "name",
		})
		.populate({
			path: "posts",
			select: "title slug",
		});

	// return updated category
	return NextResponse.json(
		{
			category: updatedCategory,
		},
		{ status: 200 }
	);
}

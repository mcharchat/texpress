import dbConnect from "@/lib/dbConnect";
import newUserPasswordTemplate from "@/lib/mails/newUserPasswordTemplate";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import sendMail from "@/lib/utils/mailService";
import { UserModel } from "@/models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";

// this function get all the users
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

	// get users
	const users = await UserModel.find({})
		.select("-password -verifyCode -verifyCodeExpiration")
		.populate({
			path: "posts",
			select: "title slug",
		});

	// return users
	return NextResponse.json(
		{
			users,
		},
		{ status: 200 }
	);
}

// this function create a new user
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

	// get user data from request body
	const body = await request.json();

	// check request body has required fields
	const requiredFields = ["name", "email", "role"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);

	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	const verifyCodeExpiration = Date.now() + 1000 * 60 * 60;
	const verifyCode = v4();
	// generate a random password and encrypt it
	const password = bcrypt.hashSync(v4(), 10);
	const extendedBody = {
		...body,
		password,
		verifyCode,
		verifyCodeExpiration,
	};
	// connect to database
	await dbConnect();

	// find out if user already exists
	const userExists = await UserModel.findOne({
		email: body.email,
	});

	if (userExists) {
		return NextResponse.json(
			{
				error: "This email is not available",
			},
			{ status: 400 }
		);
	}

	// create user
	await UserModel.create(extendedBody);

	// create user
	const newUser = await UserModel.findOne({
		email: body.email,
	})
		.select("-password -verifyCode -verifyCodeExpiration")
		.populate({
			path: "posts",
			select: "title slug",
		});

	// send reset password email
	sendMail(
		[body.email],
		"Wellcome to Texpress",
		newUserPasswordTemplate(body.name, verifyCode)
	);

	// return user
	return NextResponse.json(
		{
			user: newUser,
		},
		{ status: 200 }
	);
}

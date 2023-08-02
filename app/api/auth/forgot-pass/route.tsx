import { UserModel } from "@/models";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import sendMail from "@/lib/utils/mailService";
import { v4 } from "uuid";
import forgotPasswordTemplate from "@/lib/mails/forgotPasswordTemplate";

// this route will ask for user email and send a reset password link to the user email
export async function POST(request: Request) {
	// check xcsrf token on request header
	const xcsrfTokenError = await validateXCSRFToken(request);
	if (xcsrfTokenError) {
		return xcsrfTokenError;
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
	const requiredFields = ["email"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);
	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// get variables from request body
	const { email } = body;

	// connect to database
	await dbConnect();

	// find user by email
	const user = await UserModel.findOne({ email });

	// if no user found, return error
	if (!user) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 401 }
		);
	}

	if (user?.verifyCodeExpiration > Date.now()) {
		return NextResponse.json(
			{
				error:
					"You have already requested a reset password link. Please check your inbox or spam folder.",
			},
			{ status: 401 }
		);
	}

	const verifyCodeExpiration = Date.now() + 1000 * 60 * 60;
	const verifyCode = v4();

	const updatedUser = await UserModel.findOneAndUpdate(
		{ email },
		{ verifyCode, verifyCodeExpiration },
		{ new: true }
	);
	// send reset password email
	sendMail(
		[email],
		"Reset Password",
		forgotPasswordTemplate(updatedUser?.name, updatedUser?.verifyCode)
	);

	return NextResponse.json(
		{
			message: "Reset password link has been sent to your email",
		},
		{ status: 200 }
	);
}

// this route will set new password for the user
export async function PUT(request: Request) {
	// check xcsrf token on request header
	const xcsrfTokenError = await validateXCSRFToken(request);
	if (xcsrfTokenError) {
		return xcsrfTokenError;
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
	const requiredFields = ["password", "verifyCode"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);
	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// get variables from request body
	const { password, verifyCode } = body;

	// connect to database
	await dbConnect();

	// find user by verifyCode
	const user = await UserModel.findOne({ verifyCode });

	// if no user found, return error
	if (!user) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 401 }
		);
	}

	// hash password
	const hashedPassword = await bcrypt.hash(password, 10);

	// update user password
	await UserModel.findOneAndUpdate(
		{ verifyCode },
		{
			password: hashedPassword,
			$unset: { verifyCode: 1, verifyCodeExpiration: 1 },
		}
	);

	// return token
	return NextResponse.json(
		{
			message: "Password has been reset successfully",
		},
		{ status: 200 }
	);
}

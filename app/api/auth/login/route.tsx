import { UserModel } from "@/models";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { generateJWT } from "@/lib/utils/JWT";


// this route will authenticate the user and return a JWT token
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
	const requiredFields = ["email", "password"];
	const requiredFieldsError = await validateRequestBodyRequiredFields(
		body,
		requiredFields
	);
	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// get variables from request body
	const { email, password, rememberMe } = body;

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
			{ status: 400 }
		);
	}

	// compare password with hashed password
	const isPasswordMatch = await bcrypt.compare(password, user.password);

	// if password does not match, return error
	if (!isPasswordMatch) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 400 }
		);
	}
	// return user
	const token = generateJWT(
		{
			id: user._id,
			email,
			name: user.name,
			role: user.role,
		},
		rememberMe
	);
	const expiretimelimit = rememberMe
		? 1000 * 60 * 60 * 24 * 400
		: 1000 * 60 * 60 * 24;
	const expiretime = Date.now() + expiretimelimit;

	return new Response(
		JSON.stringify({
			id: user._id,
			token,
		}),
		{
			status: 200,
			headers: {
				"Set-Cookie": `user=${encodeURIComponent(
					JSON.stringify({
						id: user._id,
						token,
					})
				)} ; Path=/ ; Expires=${new Date(expiretime).toUTCString()}`,
				"Content-Type": "application/json",
			},
		}
	);
}

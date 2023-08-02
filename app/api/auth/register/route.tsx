import { UserModel } from "@/models";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestBodyRequiredFields } from "@/lib/middlewares/validateRequestBodyRequiredFields";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { generateJWT } from "@/lib/utils/JWT";

interface CreateUserBody {
	name: string;
	email: string;
	password: string;
	rememberMe?: boolean;
}

async function checkUserExists(email: string) {
	const user = await UserModel.findOne({ email });
	if (user) {
		return NextResponse.json(
			{
				error: "User already exists",
			},
			{ status: 400 }
		);
	}
	return null;
}

export async function POST(request: Request) {
	// check xcsrf token on request header
	const xcsrfTokenError = await validateXCSRFToken(request);
	if (xcsrfTokenError) {
		return xcsrfTokenError;
	}

	// check if request is a valid json
	const contentTypeError = await validateRequestContentType(request);
	if (contentTypeError) {
		return contentTypeError;
	}

	// check if request body is a valid json
	const body = await validateRequestBodyJSON(request);
	if (!body) {
		return NextResponse.json(
			{
				error: "Invalid request. Please provide a valid JSON body",
			},
			{ status: 400 }
		);
	}

	// check if request body has required fields
	const requiredFieldsError = await validateRequestBodyRequiredFields(body, [
		"name",
		"email",
		"password",
	]);
	if (requiredFieldsError) {
		return requiredFieldsError;
	}

	// get variables from body
	const { name, email, password, rememberMe } = body as CreateUserBody;

	// connect to database
	await dbConnect();

	// check if user already exists
	const unavailableEmailError = await checkUserExists(email);
	if (unavailableEmailError) {
		return unavailableEmailError;
	}

	// create user
	const newUser = await UserModel.create({
		name,
		email,
		password: bcrypt.hashSync(password, 10),
	});

	// return user
	const token = generateJWT(
		{
			id: newUser._id,
			email,
			name,
			role: newUser.role,
		},
		rememberMe
	);
	const expiretimelimit = rememberMe
		? 1000 * 60 * 60 * 24 * 400
		: 1000 * 60 * 60 * 24;
	const expiretime = Date.now() + expiretimelimit;

	return new Response(
		JSON.stringify({
			id: newUser._id,
			token,
		}),
		{
			status: 200,
			headers: {
				"Set-Cookie": `user=${encodeURIComponent(
					JSON.stringify({
						id: newUser._id,
						token,
					})
				)} ; Path=/ ; Expires=${new Date(expiretime).toUTCString()}`,
				"Content-Type": "application/json",
			},
		}
	);
}

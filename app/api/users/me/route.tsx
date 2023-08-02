import { UserModel } from "@/models";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { cookies } from "next/headers";

// this function get all the user details
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

	const tokenContent = tokenReturn.tokenContent;
	const { id } = tokenContent as any;

	// connect to database
	await dbConnect();

	// find user by id
	const findUser = await UserModel.findById(id);

	// if no user found, return error
	if (!findUser) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 400 }
		);
	}

	// return user

	return NextResponse.json(
		{
			id: findUser._id,
			email: findUser.email,
			name: findUser.name,
			role: findUser.role,
			bioInfo: findUser.bioInfo,
			img: findUser.img,
		},
		{ status: 200 }
	);
}

// this function will update the user details it can be used to update the user password, name, email, bioInfo, img, wich field the body request has
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

	const tokenContent = tokenReturn.tokenContent;
	const { id, email } = tokenContent as any;

	// connect to database
	await dbConnect();

	// if body has email, check if email is already in use
	if (body.email && body.email !== email) {
		const oldUser = await UserModel.findOne({ email: body.email });
		if (oldUser) {
			return NextResponse.json(
				{
					error: "Email already in use",
				},
				{ status: 400 }
			);
		}
	}

    // if body has password, hash password
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    // update user
    await UserModel.findOneAndUpdate({ _id: id }, body);

    // return success
    return NextResponse.json(
        {
            message: "User updated successfully",
        },
        { status: 200 }
    );
}

// this function will delete the user
export async function DELETE(request: Request) {
    //
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

    const tokenContent = tokenReturn.tokenContent;
    const { id, role } = tokenContent as any;

    // connect to database
    await dbConnect();

    // if this user role is 0, search if there is another user with role 0, if not, return error
    if (role === 0) {
        const findUser = await UserModel.findOne({ role: 0, _id: { $ne: id } });
        if (!findUser) {
            return NextResponse.json(
                {
                    error: "You are the only admin, you can't delete your account",
                },
                { status: 400 }
            );
        }
    }

    // delete user
    await UserModel.findOneAndDelete({ _id: id });

    // return success
    return NextResponse.json(
        {
            message: "User deleted successfully",
        },
        { status: 200 }
    );
}

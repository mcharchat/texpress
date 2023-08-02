import { UserModel } from "@/models";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
export async function GET(request: Request) {
    // check xcsrf token on request header
    const xcsrfTokenError = await validateXCSRFToken(request);
    if (xcsrfTokenError) {
        return xcsrfTokenError;
    }

    await dbConnect();

    // get all users that have role 0 (admin)
    const users = await UserModel.find({ role: 0 });

    // if no users found, return false else return true
    return NextResponse.json({ hasAdminUser: users.length > 0 });

}
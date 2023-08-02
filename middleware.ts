import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import validateJwt from "@/lib/utils/ValidateJwt";
import Cookies from "js-cookie";

export async function middleware(request: NextRequest) {
	// get the user cookie
	const userCookie = request.cookies.get("user");

	if (request.nextUrl.pathname.startsWith("/tp-admin")) {
		// if there is a user cookie, check if the token is not expired
		if (userCookie) {
			const user: any = JSON.parse(userCookie.value);
			if (user?.token) {
				const validated = await validateJwt(user.token);
				if (validated) {
					// decode token expiry
					const tokenExpiry = JSON.parse(validated).exp;
					// check if token is expired
					if (tokenExpiry * 1000 > Date.now()) {
						// redirect to admin panel
						return NextResponse.redirect(new URL("/tp-panel", request.url));
					}
				} else {
					// remove the user cookie
					Cookies.remove("user", { path: "/" });
					// response next
					return NextResponse.next();
				}
			}
		}
	}

	if (request.nextUrl.pathname.startsWith("/tp-panel")) {
		// if there is a user cookie
		if (!userCookie) {
			// remove the user cookie
			Cookies.remove("user", { path: "/" });
			return NextResponse.redirect(new URL("/tp-admin", request.url));
		}
		// if there is a user cookie, check if the token is not expired
		if (userCookie) {
			const user: any = JSON.parse(userCookie.value);
			if (user?.token) {
				const validated = await validateJwt(user.token);
				if (!validated) {
					// remove the user cookie
					Cookies.remove("user", { path: "/" });
					return NextResponse.redirect(new URL("/tp-admin", request.url));
				}
				// decode token expiry
				const tokenExpiry = JSON.parse(validated).exp;
				// check if token is expired
				if (tokenExpiry * 1000 < Date.now()) {
					// redirect to login
					Cookies.remove("user", { path: "/" });
					return NextResponse.redirect(new URL("/tp-admin", request.url));
				}
			}
		}
	}

	if (request.nextUrl.pathname === "/api/seed") {
		//if NODE_ENV is not development redirect to home
		if (process.env.NODE_ENV !== "development") {
			return NextResponse.rewrite(new URL("/", request.url));
		}
	}
}

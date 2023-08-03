import dbConnect from "@/lib/dbConnect";
import { checkValidJWT } from "@/lib/utils/JWT";
import { UserModel } from "@/models";
import { cookies } from "next/headers";

export default async function FetchProfile() {
	const cookieStore = cookies();
	const userCookie: any = cookieStore.get("user");
	const user = JSON.parse(userCookie.value);

	const tokenReturn = checkValidJWT(user.token);
	const tokenContent = tokenReturn.tokenContent;
	const { id } = tokenContent as any;
	await dbConnect();
	const findUser = await UserModel.findById(id);
	return JSON.stringify({
		id: findUser._id,
		email: findUser.email,
		name: findUser.name,
		role: findUser.role,
		bioInfo: findUser.bioInfo,
		img: findUser.img,
	});
}

import { NextResponse } from "next/server";
import seeders from "@/lib/seeders/index";

export async function GET(request: Request) {
	if (process.env.BUILD_SEEDING) {
		await seeders();
		return NextResponse.json(
			{
				message: "Seeded successfully",
			},
			{ status: 200 }
		);
	} else {
		return NextResponse.json(
			{
				message: "Seeding is disabled",
			},
			{ status: 200 }
		);
	}
}

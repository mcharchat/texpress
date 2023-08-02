import { NextResponse } from "next/server";
import seeders from '@/lib/seeders/index'

export async function GET(request: Request) {
    /*
    */
    await seeders();
    return NextResponse.json(
        {
            message: "Seeded successfully",
        },
        { status: 200 }
    );
}

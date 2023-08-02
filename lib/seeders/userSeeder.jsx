import { faker } from "@faker-js/faker";
import { UserModel } from "@/models";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export const userSeeder = async (number) => {
	const users = [];
	for (let i = 0; i < number; i++) {
		users.push({
			name: faker.person.firstName() + " " + faker.person.lastName(),
			email: faker.internet.email(),
			password: bcrypt.hashSync(process.env.TEST_USER_PASSWORD, 10),
			role: Math.floor(Math.random() * [0, 1, 2].length),
			img: faker.image.url(),
		});
	}

	await dbConnect();
	await UserModel.deleteMany({});
	await UserModel.insertMany(users);
	return console.log(number + " users seeded");
};

import { faker } from "@faker-js/faker";
import { CategoryModel } from "@/models";
import dbConnect from "@/lib/dbConnect";

export const categorySeeder = async (number) => {
	const categories = [];
	for (let i = 0; i < number; i++) {
		categories.push({
			name: faker.lorem.word(),
		});
	}

	await dbConnect();
	await CategoryModel.deleteMany({});
	await CategoryModel.insertMany(categories);
	return console.log(number + " categories seeded");
};

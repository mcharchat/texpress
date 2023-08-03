import { faker } from "@faker-js/faker";
import { TagModel } from "@/models";
import dbConnect from "@/lib/dbConnect";

export const tagSeeder = async (number) => {
	const tags = [];
	const allowedCollors = [
		"blue-gray",
		"gray",
		"brown",
		"deep-orange",
		"orange",
		"amber",
		"yellow",
		"lime",
		"light-green",
		"green",
		"teal",
		"cyan",
		"light-blue",
		"blue",
		"indigo",
		"deep-purple",
		"purple",
		"pink",
		"red",
	];
	for (let i = 0; i < number; i++) {
		tags.push({
			name: faker.lorem.word(),
			color: allowedCollors[Math.floor(Math.random() * allowedCollors.length)],
			slug: faker.lorem.slug(),
			description: faker.lorem.paragraph(),
		});
	}

	await dbConnect();
	await TagModel.deleteMany({});
	await TagModel.insertMany(tags);
	return console.log(number + " tags seeded");
};

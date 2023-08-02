import { faker } from "@faker-js/faker";
import { PostModel } from "@/models";
import { UserModel } from "@/models";
import { TagModel } from "@/models";
import { CategoryModel } from "@/models";
import dbConnect from "@/lib/dbConnect";

export const postSeeder = async (number) => {
	await dbConnect();
	//get all the users
	const users = await UserModel.find({});
	//get all the tags
	const tags = await TagModel.find({});
	//get all the categories
	const categories = await CategoryModel.find({});

	const allowedStates = ["published", "drafted", "archived", "trashed"];
	const posts = [];
	for (let i = 0; i < number; i++) {
		posts.push({
			title: faker.lorem.sentence(),
			subtitle: faker.lorem.sentence(),
			content: "<p>" + faker.lorem.paragraphs() + "</p>",
			author: users[Math.floor(Math.random() * users.length)]._id,
			stateChangedAt: faker.date.past(),
			categories: categories
				.map((category) => {
					if (Math.random() >= 0.5) {
						return category._id;
					}
				})
				.filter((category) => category !== undefined),
			tags: tags
				.map((tag) => {
					if (Math.random() >= 0.5) {
						return tag._id;
					}
				})
				.filter((tag) => tag !== undefined),
			state: allowedStates[Math.floor(Math.random() * allowedStates.length)],
			slug: faker.lorem.slug(),
			isPublic: Math.random() >= 0.5,
			metaDescription: faker.lorem.sentence(),
		});
	}
	await PostModel.deleteMany({});
	await PostModel.insertMany(posts);
	return console.log(number + " posts seeded");
};

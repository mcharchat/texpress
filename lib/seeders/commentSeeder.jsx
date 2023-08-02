import { faker } from "@faker-js/faker";
import { CommentModel } from "@/models";
import { UserModel } from "@/models";
import { PostModel } from "@/models";
import dbConnect from "@/lib/dbConnect";

export const commentSeeder = async (number) => {
	await dbConnect();
	//get all the users
	const users = await UserModel.find({});
	//get all the posts
	const posts = await PostModel.find({});

	const comments = [];
	for (let i = 0; i < number; i++) {
		const userAuthor =
			users[Math.floor(Math.random() * (users.length + 1))]?._id || null;
		comments.push({
			content: faker.lorem.paragraph(),
			author: userAuthor,
			authorName: userAuthor
				? null
				: faker.person.firstName() + " " + faker.person.lastName(),
			authorEmail: userAuthor ? null : faker.internet.email(),
			post: posts[Math.floor(Math.random() * posts.length)]._id,
			parent: null,
		});
	}
	await CommentModel.deleteMany({});
	console.log(
		"🚀 ~ file: commentSeeder.jsx:25 ~ commentSeeder ~ comments:",
		comments
	);
	await CommentModel.insertMany(comments);
	return console.log(number + " comments seeded");
};

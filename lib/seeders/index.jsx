import { userSeeder } from "./userSeeder";
import { categorySeeder } from "./categorySeeder";
import { tagSeeder } from "./tagSeeder";
import { postSeeder } from "./postSeeder";
import { commentSeeder } from "./commentSeeder";

const seeders = async () => {
	/*
	*/
	await userSeeder(10);
	await categorySeeder(5);
	await tagSeeder(20);
	await postSeeder(50);
	await commentSeeder(100);
	console.log("All seeders done");
};

export default seeders;

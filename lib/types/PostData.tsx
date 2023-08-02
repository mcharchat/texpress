import Category from "./Category";
import Tag from "./Tag";

export default interface PostData {
	title: string;
	subtitle: string;
	content: string;
	categories: Category[];
	tags: Tag[];
	state: string;
	isPublic: boolean;
	slug: string;
	metaDescription: string;
}

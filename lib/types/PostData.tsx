import Category from "@/lib/types/Category";
import Tag from "@/lib/types/Tag";

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

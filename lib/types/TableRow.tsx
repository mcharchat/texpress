import Tag from "@/lib/types/Tag";
import Category from "@/lib/types/Category";
import Author from "@/lib/types/Author";
import Comment from "./Comment";
export default interface TableRow {
	_id: string;
	id: string;
	title: string;
	subtitle: string;
	author: Author;
	content: string;
	createdAt: string;
	updatedAt: string;
	stateChangedAt: string;
	categories: Category[];
	tags: Tag[];
	state: string;
	slug: string;
	comments: Comment[];
	isPublic: boolean;
	metaDescription: string;
	__v: number;
}
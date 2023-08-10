import Post from "@/lib/types/Post";
export default interface Category {
	_id: string;
	id: string;
	name: string;
	slug: string;
	description: string;
	parent: this | null;
	posts: Post[] | null;
}

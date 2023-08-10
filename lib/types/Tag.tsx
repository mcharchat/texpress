import Post from "@/lib/types/Post";

export default interface Tag {
	_id: string;
	id: string;
	name: string;
	color: string;
	slug: string;
	description: string;
	posts: Post[] | null;
}

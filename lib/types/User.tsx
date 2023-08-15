import Post from "@/lib/types/Post";

export default interface User {
	_id: string;
	id: string;
	img: string;
	name: string;
	email: string;
	role: string;
	posts: Post[] | null;
	isActive: boolean;
}

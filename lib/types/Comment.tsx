import Author from "./Author";

export default interface Comment {
	_id: string;
	id: string;
	content: string;
	createdAt: string;
	author: Author | null;
	authorName: string;
	authorEmail: string;
}

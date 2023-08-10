import Author from "./Author";
import PostData from "./PostData";

export default interface Comment {
	_id: string;
	id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	author: Author | null;
	authorName: string;
	authorEmail: string;
	post: PostData | null;
	state: string;
	parent: this | null;
	moderationAgent: Author | null;
	stateChangedAt: string;
}

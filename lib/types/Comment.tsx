import User from "@/lib/types/User";
import Post from "@/lib/types/Post";

export default interface Comment {
	_id: string;
	id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	author: User | null;
	authorName: string;
	authorEmail: string;
	post: Post | null;
	state: string;
	parent: this | null;
	moderationAgent: User | null;
	stateChangedAt: string;
}

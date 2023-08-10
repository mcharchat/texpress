import User from "@/lib/types/User";
import Comment from "@/lib/types/Comment";
import PostData from "@/lib/types/PostData";
export default interface Post extends PostData {
	_id: string;
	id: string;
	author: User;
	createdAt: string;
	updatedAt: string;
	stateChangedAt: string;
	comments: Comment[];
	__v: number;
}

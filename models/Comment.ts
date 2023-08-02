import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { User } from "@/models/User";
import { Post } from "@/models/Post";

@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
	options: {
		allowMixed: 0,
	},
})
export class Comment {
	@prop({ default: () => new Date(), required: true })
	createdAt?: Date;

	@prop({ default: () => new Date(), required: true })
	updatedAt?: Date;

	@prop({ required: true })
	content!: string;

	@prop()
	authorName?: string;

	@prop()
	authorEmail?: string;

	@prop({ ref: () => User })
	public author?: Ref<User>;

	@prop({ ref: () => Post })
	public post?: Ref<Post>;

	@prop({ ref: () => Comment })
	public parent?: Ref<Comment>;

	@prop({ ref: () => User })
	public moderationAgent?: Ref<User>;
}

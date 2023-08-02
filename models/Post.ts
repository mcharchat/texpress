import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { User } from "@/models/User";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import { Comment } from "@/models/Comment";

@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
	options: {
		allowMixed: 0,
	},
})
export class Post {
	@prop({ default: () => new Date(), required: true })
	createdAt?: Date;

	@prop({ default: () => new Date(), required: true })
	updatedAt?: Date;

	@prop({ required: true })
	title!: string;

	@prop()
	subtitle: string;

	
	@prop({ required: true })
	content!: string;
	
	@prop({ ref: () => User })
	public author?: Ref<User>;
	
	@prop({ required: true })
	stateChangedAt!: Date;
	
	@prop({ ref: () => Category })
	public categories?: Ref<Category>[];
	
	@prop({ ref: () => Tag })
	public tags?: Ref<Tag>[];
	
	@prop({ required: true })
	state!: string;
	
	@prop({ required: true, unique: true })
	slug!: string;
	
	@prop({ default: () => true })
	isPublic?: boolean;

	@prop()
	metaDescription?: string;

	@prop({
		ref: () => Comment,
		localField: "_id",
		foreignField: "post",
		justOne: false,
	})
	public comments?: Ref<Comment>[];
}

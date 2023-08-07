import { modelOptions, prop } from "@typegoose/typegoose";
import { Post } from "@/models/Post";
import type { Ref } from "@typegoose/typegoose";

@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
	options: {
		allowMixed: 0,
	},
})
export class Category {
	@prop({ default: () => new Date(), required: true })
	createdAt?: Date;

	@prop({ default: () => new Date(), required: true })
	updatedAt?: Date;

	@prop({ required: true })
	name!: string;

	@prop({ required: true })
	slug!: string;

	@prop()
	description?: string;

	@prop({
		ref: () => Post,
		localField: "_id",
		foreignField: "categories",
		justOne: false,
	})
	public posts?: Ref<Post>[];

	@prop({ ref: () => Category })
	public parent?: this;
}

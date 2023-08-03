import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
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
export class Tag {
	@prop({ required: true })
	name!: string;

	@prop({ required: true })
	color!: string;

	@prop({ default: () => new Date(), required: true })
	createdAt?: Date;

	@prop({ default: () => new Date(), required: true })
	updatedAt?: Date;

	@prop({ required: true })
	slug!: string;

	@prop()
	description?: string;

	@prop({
		ref: () => Post,
		localField: "_id",
		foreignField: "tags",
		justOne: false,
	})
	public posts?: Ref<Post>[];
}

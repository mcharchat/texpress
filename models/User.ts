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
export class User {
	@prop({ default: () => new Date(), required: true })
	createdAt?: Date;

	@prop({ default: () => new Date(), required: true })
	updatedAt?: Date;

	@prop({ required: true })
	name!: string;

	@prop({ required: true, unique: true })
	email!: string;

	@prop()
	emailVerifiedAt: Date;

	@prop({ required: true })
	password!: string;

	@prop({ default: () => 0, required: true })
	role!: number;

	@prop()
	verifyCode: string;

	@prop()
	verifyCodeExpiration: Date;

	@prop()
	img: string;

	@prop()
	bioInfo: string;

	@prop({ default: () => true })
	isActive?: boolean;

	@prop({
		ref: () => Post,
		localField: "_id",
		foreignField: "author",
		justOne: false,
	})
	public posts?: Ref<Post>[];

}

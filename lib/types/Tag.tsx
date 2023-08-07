export default interface Tag {
	_id: string;
	id: string;
	name: string;
	color: string;
	slug: string;
	description: string;
	posts:
		| {
				_id: string;
				id: string;
				title: string;
				slug: string;
		  }[]
		| null;
}

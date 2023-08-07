export default interface Category {
	_id: string;
	id: string;
	name: string;
	slug: string;
	description: string;
	parent: this | null;
	posts:
		| {
				_id: string;
				id: string;
				title: string;
				slug: string;
		  }[]
		| null;
}

import { Suspense } from "react";
import MainComponent from "./partials/MainComponent";
import FetchProfile from "./partials/FetchProfile";

export default async function Page() {
	const profile = await FetchProfile();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<MainComponent profile={profile} />
		</Suspense>
	);
}

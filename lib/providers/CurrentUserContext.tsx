// CurrentUserContext.js
import { createContext } from "react";

interface User {
	id: string;
	token: string;
}

const CurrentUserContext = createContext<User | null>(null);

export default CurrentUserContext;

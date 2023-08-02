import fs from "fs";
import jwt from "jsonwebtoken";

const privateKey = fs.readFileSync("texpress.pem");
const publicKey = fs.readFileSync("texpress.pub");

function generateJWT(payload, rememberMe) {
	const options = {
		algorithm: "RS256",
		expiresIn: rememberMe ? "400d" : "1d",
	};

	const token = jwt.sign(payload, privateKey, options);
	return token;
}

function checkJWT(token) {
	const options = {
		algorithms: ["RS256"],
	};

	try {
		const decoded = jwt.verify(token, publicKey, options);
		return decoded;
	} catch (err) {
		return false;
	}
}

function checkValidJWT(token) {
	const decoded = checkJWT(token);
	if (!decoded) {
		return {
			valid: false,
			token,
			tokenContent: decoded,
			message: "Invalid token",
		};
	}
	if (decoded.exp < Date.now()/1000) {	
		return {
			valid: false,
			token,
			tokenContent: decoded,
			message: "Expired token",
		};
	}
	return {
		valid: true,
		token,
		tokenContent: decoded,
		message: "Valid token",
	};
}

export { generateJWT, checkJWT, checkValidJWT };

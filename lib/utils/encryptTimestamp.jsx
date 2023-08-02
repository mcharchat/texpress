import { encrypt } from "@/lib/utils/SECRET_KEY";

export default async function encryptTimestamp() {
	const timestamp = Date.now().toString();
	const hash = encrypt(timestamp);
	return hash;
}

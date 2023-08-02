import js from 'node-jose';
import publicKey from '@/texpress.json';
const jose = js;

const validateJWT = async (jwt) => {
    try {
        const key = await jose.JWK.asKey(publicKey, "x509", { alg: "RS256" });
        const result = await jose.JWS.createVerify(key).verify(jwt);

        return result.payload.toString();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default validateJWT;
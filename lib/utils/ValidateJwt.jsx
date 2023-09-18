import publicKey from '@/texpress.json';
import { createLocalJWKSet, jwtVerify } from "jose";

const JWKS = createLocalJWKSet({
    keys: [publicKey],
});

const validateJWT = async (jwt) => {
    try {
        const result = await jwtVerify(jwt, JWKS);
        return JSON.stringify(result.payload);
    } catch (error) {
        console.log(error);
        return null;
    }
}
export default validateJWT;
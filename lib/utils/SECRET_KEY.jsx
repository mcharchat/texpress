import crypto from "crypto";

const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    
    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted.toString("hex"),
    };
}

function decrypt(hash) {
    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(hash.iv, "hex")
    );
    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hash.encryptedData, "hex")),
        decipher.final(),
    ]);
    return decrpyted.toString();
}

export { encrypt, decrypt };
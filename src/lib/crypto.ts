import Cryptr from "cryptr";  // Use "import" instead of "require"

const secretKey: string = "myTotalySecretKey";  // Directly passing the secret key
const cryptr = new Cryptr(secretKey);


const m = (message: string,toEncrypt: boolean):string =>{
    if(toEncrypt){
        const encryptedString: string = cryptr.encrypt(message);
        console.log("Encrypted:", encryptedString);
        return encryptedString;
    }
    const decryptedString: string = cryptr.decrypt(message);
    console.log("Decrypted:", decryptedString);
    return decryptedString;
}


// const decryptedString: string = cryptr.decrypt(encryptedString);


// console.log("Decrypted:", decryptedString);
export default {m};
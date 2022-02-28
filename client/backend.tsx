import { Appwrite } from "appwrite";

const sdk = new Appwrite()

try {
    sdk.setEndpoint(process.env.NEXT_PUBLIC_RS_BACKEND_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_RS_BACKEND_PROJECT!);
} catch (error) {
    console.log(error);
}

export { sdk }
import { Models } from "appwrite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { sdk } from "../client/backend";

export let account: Models.User<Models.Preferences>;
export const app_url = process.env.NEXT_PUBLIC_APP_URL;

export const getCurrentUser = async (arg: void) => {
    return await sdk.account.get();
};

export const signup = async (email: string, password: string, name: string) => {
    return await sdk.account.create('unique()', email, password, name);
};

export const signin = async (username: string, password: string) => {
    return await sdk.account.createSession(username, password);
};

export const createMagicLink = async (email: string) => {
    return await sdk.account.createMagicURLSession('unique()', email, app_url + '/auth/login/acceptMagicLink');
}

export const updateMagicLink = async (userId: string, secret: string) => {
    return await sdk.account.updateMagicURLSession(userId, secret);
}

export const createProviderLogin = async (provider: string) => {
    return await sdk.account.createOAuth2Session(provider, app_url + '/auth/login/');
}

export const sendConfirmationEmail = async () => {
    return await sdk.account.createVerification(app_url + '/auth/login/verify');
}

export const updateConfirmationEmail = async (userId: string, secret: string) => {
    return await sdk.account.updateVerification(userId, secret);
}

export const sendPasswordRecoveryEmail = async (email: string) => {
    return await sdk.account.createRecovery(email, app_url + '/auth/login/recover');
}

export const updatePasswordRecoveryEmail = async (userId: string, secret: string, password: string, passwordAgain: string) => {
    return await sdk.account.updateRecovery(userId, secret, password, passwordAgain);
}


export const useRequireLogin = (callback: () => void = () => { }) => {
    const router = useRouter();

    useEffect(() => {
        getCurrentUser().then(
            (res) => {
                callback();
            },
            (err) => {
                router.push('/auth/login');
            }
        )
    }, [account]);
  }
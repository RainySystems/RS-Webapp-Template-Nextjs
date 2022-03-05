import { sdk } from "../client/backend";
import { getCurrentUser } from "./auth";

export const getUserInitialsURL = () => {
    return sdk.avatars.getInitials().href;
}

export const getUserDetails = () => {
    return getCurrentUser();
}
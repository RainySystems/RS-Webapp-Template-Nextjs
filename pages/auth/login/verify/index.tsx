import { useToast } from "@chakra-ui/react";
import { logout, updateConfirmationEmail } from "client/auth";
import { useRouter } from "next/router";

export let userId: string | string[];
export let secret: string | string[];

export async function checkParams() {
    const toast = useToast();
    const { query } = useRouter();
    const router = useRouter();
    if (query.userId && query.secret) {
        userId = query.userId;
        secret = query.secret;
        if (Array.isArray(userId) || Array.isArray(secret))
            toast({
                title: "Error",
                description: "Invalid query parameters",
                status: "error",
                duration: 9000,
                isClosable: true
            });
        else {
            try {
                await updateConfirmationEmail(userId, secret);
                toast({
                    title: "Success",
                    description: "Email successfully verified. Please wait while we redirect you to the login page.",
                    status: "success",
                    duration: 9000,
                    isClosable: true
                });
                await logout();
                router.push("/auth/login");
            } catch (e: any) {
                toast({
                    title: "Error",
                    description: 'There was an error verifying your email. Error: ' + e.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true
                });
                router.push("/auth/login");
            }
        }
    }
}

export default function verify() {
    checkParams();

    return (
        <div>
            <h1>Verify Email</h1>
            <p>
                Please check your email for a verification link. If you don't see it, please check your spam folder.
            </p>
        </div>
    )
}
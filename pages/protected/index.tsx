import { useRequireLogin } from "client/auth";

export default function protectedPage() {
    useRequireLogin();
    return <div>
        <h1>Protected Page</h1>
    </div>;
}
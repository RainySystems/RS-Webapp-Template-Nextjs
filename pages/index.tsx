import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

function HomePage() {
  const router = useRouter();
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
      <Button onClick={() => router.push('/auth/login')}>Login</Button>
      <Button onClick={() => router.push('/auth/register')}>Register</Button>
    </div>
  );
}

export default HomePage
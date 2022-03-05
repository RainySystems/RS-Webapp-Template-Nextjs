import { Button, Center, Heading, HStack, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { createProviderLogin, signin } from "client/auth";
import { useRouter } from "next/router";

export default function Login() {
    const theme = useColorMode();

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const toast = useToast();
    const login = async () => {
        const [a, b] = [emailInput.current?.value, passwordInput.current?.value]
        if (a && b)
            try {
                await signin(a, b);
                router.push("/");
                toast({
                    title: "Success",
                    description: "You have successfully logged in. Please wait while we redirect you.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } catch (e: any) {
                toast({
                    title: "Error",
                    description: "An error occurred while logging in. Please try again. Error: " + e.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
    }

    const loginGithub = async () => {
        try {
            await createProviderLogin("github");
            toast({
                title: "Success",
                description: "You have successfully logged in. Please wait while we redirect you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } catch (e: any) {
            toast({
                title: "Error",
                description: "An error occurred while logging in. Please try again. Error: " + e.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return <div>
        <HStack>
            <Button onClick={() => { theme.toggleColorMode(); }}>
                <FontAwesomeIcon icon={theme.colorMode == "dark" ? faSun : faMoon} />
            </Button>
        </HStack>
        <Center height={"100vh"}>
            <VStack>
                <Tabs>
                    <TabList>
                        <Tab>
                            Email & Password
                        </Tab>
                        <Tab>
                            GitHub
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <VStack>
                                <Heading>Login</Heading>
                                <Input placeholder="E-Mail" type="email" ref={emailInput} />
                                <Input placeholder="Passwort" type="password" ref={passwordInput} />
                                <Button onClick={login}>Log in</Button>
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <VStack>
                                <Heading>GitHub</Heading>
                                <Button onClick={loginGithub}>Sign in with GitHub</Button>
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Center>
    </div>;
}
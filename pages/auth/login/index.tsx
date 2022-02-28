import { Button, Center, Heading, HStack, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, VStack } from "@chakra-ui/react";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { createProviderLogin, signin } from "client/auth";

export default function Login() {
    const theme = useColorMode();

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const login = () => {
        const [a, b] = [emailInput.current?.value, passwordInput.current?.value]
        if (a && b)
            signin(a, b);
    }

    const loginGithub = () => {
        createProviderLogin("github");
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
                                <Heading>Anmelden</Heading>
                                <Input placeholder="E-Mail" type="email" ref={emailInput} />
                                <Input placeholder="Passwort" type="password" ref={passwordInput} />
                                <Button onClick={login}>Sign in</Button>
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
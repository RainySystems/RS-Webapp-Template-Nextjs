import { Button, Center, Heading, HStack, Input, Spacer, toast, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signup } from "client/auth";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Register() {
    const theme = useColorMode();

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const passwordInput2 = useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);

    const [registerDisabled, setRegisterDisabled] = useState(true);
    const checkRegisterDisabled = () => setRegisterDisabled(!(
        passwordInput.current?.value
        && passwordInput.current?.value === passwordInput2.current?.value
        && emailInput.current?.validity.valid
        && nameInput.current?.value)
    );
    const router = useRouter();
    const toast = useToast();

    const register = () => {
        const [a, b, c] = [emailInput.current?.value, passwordInput.current?.value, nameInput.current?.value]
        if (a && b && c)
            signup(a, b, c).then(() => {
                toast({
                    title: "Success",
                    description: "You have successfully registered. Please login.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                router.push("/auth/login");
            }).catch((e) => {
                toast({
                    title: "Error",
                    description: "An error occurred while registering. Please try again. Error: " + e.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
        }

        return <div>
            <HStack>
                <Button onClick={() => { theme.toggleColorMode(); }}>
                    <FontAwesomeIcon icon={theme.colorMode == "dark" ? faSun : faMoon} />
                </Button>
            </HStack>
            <Center height={"100vh"}>
                <VStack>

                    <VStack>
                        <Heading>Register</Heading>
                        <Spacer />
                        <Input placeholder="E-Mail" ref={emailInput} onChange={checkRegisterDisabled} type="email" />
                        <Input type="text" placeholder="Name (IC)" ref={nameInput} onChange={checkRegisterDisabled} />
                        <Input
                            placeholder="Passwort"
                            type="password"
                            ref={passwordInput}
                            onChange={checkRegisterDisabled} />
                        <Input placeholder="Passwort Wiederholen" type="password" ref={passwordInput2} onChange={checkRegisterDisabled} />
                        <Button disabled={registerDisabled} onClick={register}>Register</Button>
                    </VStack>
                </VStack>
            </Center>
        </div>;
    }
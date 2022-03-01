import {
    Button,
    Flex,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
    useToast,
    ModalOverlay,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Badge,
} from '@chakra-ui/react';
import { getUserDetails, getUserInitialsURL } from 'client/appfunctions';
import { sendConfirmationEmail, updateAccountEmail, updateAccountName, updateAccountPassword, useRequireLogin } from 'client/auth';
import { useEffect, useRef, useState } from 'react';
import { Models } from 'appwrite';
import { useRouter } from 'next/router';
import React from 'react';


export default function UserProfileEdit() {

    const router = useRouter();
    const toast = useToast()
    const emailInput = useRef<HTMLInputElement>(null);
    const newPasswordInput = useRef<HTMLInputElement>(null);
    const newPasswordConfirmationInput = useRef<HTMLInputElement>(null);
    const oldPasswordInput = useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);

    const [data, setData] = useState<Models.User<Models.Preferences>>();
    const [validPasswordUpdate, setValidPasswordUpdate] = useState(true);

    useRequireLogin();
    const profileAvatarURL = getUserInitialsURL();

    useEffect(() => {
        (async () => {
            try {
                setData(await getUserDetails());
            } catch (e: any) {
                toast({
                    title: "Error",
                    description: "An error occurred while loading your profile. Please try again. Error: " + e.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        })();
    }, []);

    const checkValidPasswordUpdate = () => setValidPasswordUpdate(!(
        newPasswordInput.current?.value === newPasswordConfirmationInput.current?.value &&
        newPasswordInput.current?.value &&
        newPasswordInput.current?.value.length >= 8 &&
        oldPasswordInput.current?.value !== newPasswordInput.current?.value &&
        oldPasswordInput.current?.value &&
        oldPasswordInput.current?.value.length >= 8
    ));

    const sendConfirmationEmailHandler = async () => {
        try {
            await sendConfirmationEmail();
            toast({
                title: "Success",
                description: "A confirmation email has been sent to your email address.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } catch (e: any) {
            toast({
                title: "Error",
                description: "An error occurred while sending the confirmation email. Please try again. Error: " + e.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    };

    const updateAccount = async () => {
        const [a, b, c, d, e] = [
            nameInput.current?.value,
            emailInput.current?.value,
            oldPasswordInput.current?.value,
            newPasswordInput.current?.value,
            newPasswordConfirmationInput.current?.value
        ];

        if (a)
            try {
                await updateAccountName(a);
                toast({
                    title: 'Success',
                    description: 'Your name has been updated. New name: ' + a,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            } catch (e: any) {
                toast({
                    title: 'Error',
                    description: 'Your name could not be updated. Error: ' + e.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }

        if (b && c)
            try {
                await updateAccountEmail(b, c);
                toast({
                    title: 'Success',
                    description: 'Your email has been updated. New email: ' + b,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            } catch (e: any) {
                toast({
                    title: 'Error',
                    description: 'Your email could not be updated. Error: ' + e.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }

        if (c && d && e)
            if (d !== e)
                toast({
                    title: 'Error',
                    description: 'New password and confirmation do not match.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            else
                try {
                    await updateAccountPassword(d, c);
                    toast({
                        title: 'Success',
                        description: 'Your password has been updated.',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    });
                } catch (e: any) {
                    toast({
                        title: 'Error',
                        description: 'Your password could not be updated. Error: ' + e.message,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });

                }
    }

    const ProfileOverlay = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure()
    const { isOpen: isNameOpen, onOpen: onNameOpen, onClose: onNameClose } = useDisclosure()
    const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<ProfileOverlay />)

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}
                alignItems="center"
            >
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile Edit
                </Heading>
                <FormLabel>User Icon</FormLabel>
                <Stack direction={['column', 'row']} spacing={6}>
                    <Center>
                        <Avatar size="xl" src={profileAvatarURL}>
                        </Avatar>
                    </Center>
                </Stack>
                <Center>
                    {data?.emailVerification ? <Badge colorScheme='green'>Verified</Badge> : <Badge colorScheme='red'>Not Verified</Badge>}
                </Center>
                {data?.emailVerification ? null :
                    <Button
                        onClick={sendConfirmationEmailHandler}
                        colorScheme={'blue'}
                    >
                        Send verification mail
                    </Button>
                }
                <Button
                    onClick={() => {
                        setOverlay(<ProfileOverlay />)
                        onNameOpen()
                    }}
                >
                    Change name
                </Button>
                <Modal isCentered isOpen={isNameOpen} onClose={onNameClose}>
                    {overlay}
                    <ModalContent>
                        <ModalHeader>Update name</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormLabel>Name</FormLabel>
                            <Input
                                placeholder={data?.name ?? 'Loading name'}
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                ref={nameInput}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={updateAccount} bg={'green.400'}>Update</Button>
                            <Button onClick={onNameClose} bg={'red.400'}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Button
                    onClick={() => {
                        setOverlay(<ProfileOverlay />)
                        onEmailOpen()
                    }}
                >
                    Change email
                </Button>
                <Modal isCentered isOpen={isEmailOpen} onClose={onEmailClose}>
                    {overlay}
                    <ModalContent>
                        <ModalHeader>Update email</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder={data?.email ?? 'Loading email'}
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                ref={emailInput}
                            />
                            <FormLabel>Password</FormLabel>
                            <Input
                                placeholder="Current password"
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                                ref={oldPasswordInput}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={updateAccount} bg={'green.400'}>Update</Button>
                            <Button onClick={onEmailClose} bg={'red.400'}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Button
                    onClick={() => {
                        setOverlay(<ProfileOverlay />)
                        onPasswordOpen()
                    }}
                >
                    Change password
                </Button>
                <Modal isCentered isOpen={isPasswordOpen} onClose={onPasswordClose}>
                    {overlay}
                    <ModalContent>
                        <ModalHeader>Update password</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormLabel>Current password</FormLabel>
                            <Input
                                placeholder='Current password'
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                                ref={oldPasswordInput}
                                onChange={checkValidPasswordUpdate}
                            />
                            <FormLabel>New password</FormLabel>
                            <Input
                                placeholder="New password"
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                                ref={newPasswordInput}
                                onChange={checkValidPasswordUpdate}
                            />
                            <FormLabel>New password confirmation</FormLabel>
                            <Input
                                placeholder="New password confirmation"
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                                ref={newPasswordConfirmationInput}
                                onChange={checkValidPasswordUpdate}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button disabled={validPasswordUpdate} onClick={updateAccount} bg={'green.400'}>Update</Button>
                            <Button onClick={onPasswordClose} bg={'red.400'}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Stack spacing={6} direction={['column', 'row']}>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        bg={'red.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                            bg: 'red.500',
                        }}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
}
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
    useToast,
} from '@chakra-ui/react';
import { getUserDetails, getUserInitialsURL } from 'client/appfunctions';
import { updateAccountEmail, updateAccountName, updateAccountPassword, useRequireLogin } from 'client/auth';
import { useEffect, useRef, useState } from 'react';
import { Models } from 'appwrite';
import { useRouter } from 'next/router';

export default function UserProfileEdit() {

    const router = useRouter();
    const toast = useToast()
    const emailInput = useRef<HTMLInputElement>(null);
    const newPasswordInput = useRef<HTMLInputElement>(null);
    const newPasswordConfirmationInput = useRef<HTMLInputElement>(null);
    const oldPasswordInput = useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);

    const [data, setData] = useState<Models.User<Models.Preferences>>();
    const [passwordUpdate, setPasswordUpdate] = useState(true);
    const [validUpdate, setValidUpdate] = useState(true);

    useRequireLogin();
    const profileAvatarURL = getUserInitialsURL();

    useEffect(() => {
        getUserDetails().then(setData).catch(
            (e) => {
                toast({
                    title: "Error",
                    description: "An error occurred while loading your profile. Please try again. Error: " + e.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        );
    }, []);

    const checkPasswordUpdate = () => setPasswordUpdate(!(
        oldPasswordInput.current?.value
    ));

    const checkValidUpdate = () => setValidUpdate(!(
        nameInput.current?.value ||
        emailInput.current?.value ||
        newPasswordInput.current?.value ||
        newPasswordConfirmationInput.current?.value ||
        oldPasswordInput.current?.value
    ));

    const updateAccount = async () => {
        const [a, b, c, d, e] = [nameInput.current?.value, emailInput.current?.value, oldPasswordInput.current?.value, newPasswordInput.current?.value, newPasswordConfirmationInput.current?.value];
        if (a)
            await updateAccountName(a).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your name has been updated. New name: ' + a,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            }).catch((e) => {
                toast({
                    title: 'Error',
                    description: 'Your name could not be updated. Error: ' + e.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            });
        if (b && c)
            await updateAccountEmail(b, c).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your email has been updated. New email: ' + b,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            }).catch((e) => {
                toast({
                    title: 'Error',
                    description: 'Your email could not be updated. Error: ' + e.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            });
           
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
            await updateAccountPassword(d, c).then(() => {
                toast({
                    title: 'Success',
                    description: 'Your password has been updated.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            }).catch((e) => {
                toast({
                    title: 'Error',
                    description: 'Your password could not be updated. Error: ' + e.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            });
            
    }

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
                my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile Edit
                </Heading>
                <FormControl id="userName">
                    <FormLabel>User Icon</FormLabel>
                    <Stack direction={['column', 'row']} spacing={6}>
                        <Center>
                            <Avatar size="xl" src={profileAvatarURL}>
                            </Avatar>
                        </Center>
                    </Stack>
                </FormControl>
                <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder={data?.name ?? 'Loading name'}
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        ref={nameInput}
                        onChange={checkValidUpdate}
                    />
                </FormControl>
                <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        placeholder={data?.email ?? 'Loading email'}
                        _placeholder={{ color: 'gray.500' }}
                        type="email"
                        ref={emailInput}
                        onChange={checkValidUpdate}
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                        placeholder="Current password"
                        _placeholder={{ color: 'gray.500' }}
                        type='password'
                        ref={oldPasswordInput}
                        onChange={checkPasswordUpdate}
                    />
                </FormControl>
                <FormControl hidden={passwordUpdate}>
                    <FormLabel>New Password</FormLabel>
                    <Input
                        placeholder="New password"
                        _placeholder={{ color: 'gray.500' }}
                        type="password"
                        ref={newPasswordInput}
                        onChange={checkPasswordUpdate}
                    />
                </FormControl>
                <FormControl hidden={passwordUpdate}>
                    <FormLabel>Repeat password</FormLabel>
                    <Input
                        placeholder="Repeat new password"
                        _placeholder={{ color: 'gray.500' }}
                        type="password"
                        ref={newPasswordConfirmationInput}
                        onChange={checkValidUpdate}
                    />
                </FormControl>
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
                    <Button
                    disabled={validUpdate}
                        onClick={() =>
                            updateAccount()
                        }
                        bg={'blue.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                            bg: 'blue.500',
                        }}>
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
}
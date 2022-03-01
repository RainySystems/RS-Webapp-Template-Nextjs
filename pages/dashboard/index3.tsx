import { ReactNode, useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    useToast,
    Center,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { logout, useRequireLogin } from 'client/auth';
import { Models } from 'appwrite';
import { getUserDetails, getUserInitialsURL } from 'client/appfunctions';
import { useRouter } from 'next/router';

const Links = ['Dashboard', 'Projects', 'Team'];

const NavLink = ({ children }: { children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);

export default function withAction() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useRequireLogin();
    const [data, setData] = useState<Models.User<Models.Preferences>>();

    useEffect(() => {
        getUserDetails().then(setData).catch(console.log);
    }, []);

    const router = useRouter();
    const toast = useToast();
    const pushTo = (path: string) => {
        router.push(path);
    };

    const avatarURL = getUserInitialsURL();

    const logoutUser = () => {
        localStorage.removeItem('cookieFallback');
        logout().then(() => {
            toast({
                title: 'Success',
                description: 'You have been logged out.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            pushTo('/');
        });
    };

    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>RainySystems</Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        src={avatarURL}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            src={avatarURL}
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>{data?.name ?? 'Loading name'}</p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem onClick={() => router.push('/dashboard/profile')}>Account Settings</MenuItem>
                                    <MenuItem onClick={logoutUser}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>

            <Box p={4}>Main Content Here</Box>
        </>
    );
}
import { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Link,
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
  Center,
  useToast,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { logout, useRequireLogin } from 'client/auth';
import { useRouter } from 'next/router';
import { getUserInitialsURL, getUserDetails } from 'client/appfunctions';
import { Models } from 'appwrite';

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

export default function Nav() {
  useRequireLogin();
  const [data, setData] = useState<Models.User<Models.Preferences>>();

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

  const router = useRouter();
  const toast = useToast();
  const pushTo = (path: string) => {
    router.push(path);
  };

  const avatarURL = getUserInitialsURL();

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutUser = async () => {
    try {
      pushTo('/auth/login');
      await logout();
      localStorage.removeItem('cookieFallback');
      toast({
        title: 'Success',
        description: 'You have been logged out.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: "An error occurred while logging out. Please try again. Error: " + e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>RainySystems</Box>

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
      </Box>
    </>
  );
}
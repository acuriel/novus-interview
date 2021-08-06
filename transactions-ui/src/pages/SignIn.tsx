import React, {useState} from 'react'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../hooks';
import { useHistory } from 'react-router-dom';


interface Props {
  
}

const SignIn = (props: Props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authenticating, setAuthenticating] = useState(false)
  const auth = useAuth()
  const history = useHistory()

  const sigin = async () => {
    setAuthenticating(true)
    try{
      await auth.login(username, password)
      setAuthenticating(false)
      history.push('/')
    }
    catch{
      console.log("Error");
      
    }

  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" isRequired value={username} onChange={e => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" isRequired value={password} onChange={e => setPassword(e.target.value)}/>
            </FormControl>
            <Stack spacing={10}>
              <Button
                onClick={() => sigin()}
                bg='brand'
                isLoading={authenticating}
                color={'white'}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignIn

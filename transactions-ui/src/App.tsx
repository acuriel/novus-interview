import React, {useEffect, useState} from 'react'
import {
  ChakraProvider,
  Link,
  VStack,
  HStack,
  Spacer,
  Button,
  // theme,
  extendTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Heading
} from "@chakra-ui/react"
import { FaChevronDown, FaUser } from "react-icons/fa";
import { Switch, Link as RouteLink, BrowserRouter as Router, Route, useHistory, Redirect, useLocation } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import NovusLogo from "./components/NovusLogo";
import Movements from "./pages/Movements";
import { useAuth } from "./hooks";
import SignIn from './pages/SignIn';


const theme = extendTheme({
  colors: {
    brand: "#01a89d"
  },
  components: {
    Button : {
      variants: {
        link:{
          color: 'white',
        },
        solid:{
          bg: 'brand',
          color: 'white',
          _hover: {
            bg: '#02D4C6'
          }
        }
      }
    }
  }
})

export const App = () => {
  const [currentUser, setCurrentUser] = useState<string|undefined>(undefined)
  const auth = useAuth()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    const signedUser = auth.getCurrentUser()
    if(!signedUser) {
      history.push('/signin')
    }else{
      setCurrentUser(signedUser)

    }
  }, [])

  const logout = () => {
    auth.logout()
    history.push('/signin')
  }

  return <ChakraProvider theme={theme}>
    <VStack alignItems="stretch">
      <HStack as='nav' p={5} bgColor="brand">
        <Link as={RouteLink} to="/">
          <NovusLogo/>
        </Link>
        <Spacer/>
        <HStack spacing={10}>
          {currentUser && <Button as={RouteLink} to="/movements" size='lg' variant="link">
            Movements
          </Button>}
          {currentUser && <Menu>
            <MenuButton as={Button} size='lg' variant="link" rightIcon={<FaChevronDown />}>
              {currentUser}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Log out</MenuItem>
            </MenuList>
          </Menu>}
          <ColorModeSwitcher/>
        </HStack>
      </HStack>
        <Switch>
          {currentUser && <Route path="/movements">
            <Movements user_id={currentUser}/>
          </Route>}
          <Route path="/signin">
            <SignIn/>
          </Route>
          <Route path="/">
            <Redirect to={{
              pathname: "/movements",
              state: { from: location }
            }}/>
          </Route>
        </Switch>
    </VStack>
  </ChakraProvider>
}

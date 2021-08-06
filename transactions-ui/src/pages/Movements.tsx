import React, {useEffect, useState} from 'react'
import { Box, Heading, SimpleGrid, VStack, Text, HStack, Button, Spacer } from '@chakra-ui/react'
import { useApi } from '../hooks'
import { Movement } from '../schemas'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import NewMovementForm from '../components/NewMovementForm'
import { Unauthorized } from '../services/auth'
import MovementList from '../components/MovementList'
import EmptyMovement from '../components/EmptyMovement'
import MovementDetails from '../components/MovementDetails'


interface MovementsProps {
  user_id:string
}


const Movements = ({user_id}: MovementsProps) => {
  const [fetchingMovements, setFetchingMovements] = useState(true)
  const [movements, setMovements] = useState<Movement[]>()
  const match = useRouteMatch();
  const history = useHistory()
  const api = useApi()

  const fetchMovements = async () => {
    setFetchingMovements(true)
    try{
      const data = await api.listMovements()
      setMovements(data)
    }catch (error){
      if(error instanceof Unauthorized){
        history.push('/signin')
      }
    }
    setFetchingMovements(false)
  }

  const fetchUsers = async () => {
    const data = await api.listOtherUsers()
    return data.map((user:{username:string}) => user.username)
  }

  useEffect(() => {
    fetchMovements()
  }, [])

  return (
    <VStack alignItems="start" p={10}>
      <SimpleGrid columns={2} w="100%" spacing={20}>
        <VStack  alignItems='stretch'>
          <HStack>
            <Heading as="h2" size="lg">Movements</Heading>
            <Spacer/>
            <Button leftIcon={<FaPlus />} bg="brand" variant="solid" onClick={() => history.push(`/movements/new`)}>
              New Movement
            </Button>

          </HStack>
          <MovementList movements={movements} loading={fetchingMovements} user_id={user_id} onItemClick={movement => history.push(`/movements/${movement.id}`)}/>
        </VStack>
        <Box>
          <Switch>
              <Route path={`${match.path}/new`}>
                <NewMovementForm 
                  fetchUsers={fetchUsers} 
                  onSave={async (movement) => {
                    const created = await api.createMovement(movement)
                    await fetchMovements()
                    history.push(`/movements/${created.id}`)
                  }}
                  onCancel={async (_) => history.push('/movements')}/>
              </Route>
              <Route path={`${match.path}/:movementId`}>
                <MovementDetails user_id={user_id}/>
              </Route>
              <Route path={`${match.path}`}>
                <EmptyMovement/>
              </Route>
            </Switch>
        </Box>
      </SimpleGrid>
      
    </VStack>
  )
}

export default Movements

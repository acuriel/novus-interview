import { Button, FormControl, FormHelperText, FormLabel, Heading, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Spacer, VStack } from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from 'react'
import { useCurrency } from '../hooks'
import { Currency, MovementCreation } from '../schemas'

interface NewMovementFormProps {
  onSave?:(movement:MovementCreation) => Promise<void>,
  onCancel?:(movement:MovementCreation) => Promise<void>,
  defaultCurrency?:Currency,
  fetchUsers:() => Promise<string[]>
}

const NewMovementForm = ({defaultCurrency, fetchUsers, onSave, onCancel}: NewMovementFormProps) => {
  const {currencies} = useCurrency()
  const [users, setUsers] = useState<string[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaultCurrency || currencies['EUR'])
  const [prevCurrency, setPrevCurrency] = useState<Currency>()
  const [amount, setAmount] = useState<string>('1')
  const [selectedUser, setSelectedUser] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    const amountFloat = parseFloat(amount)
    const normalized = prevCurrency ? amountFloat * Math.pow(10, prevCurrency.decimal_digits) : amountFloat
    setAmount((normalized / Math.pow(10, selectedCurrency.decimal_digits)).toString())
  }, [selectedCurrency])

  
  useEffect(() => {
    const fetchUsersWrapper = async () => {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    }
    fetchUsersWrapper()
  }, [fetchUsers])

  const asyncMovementOperationWrapper = (
    loaderUpdater:(value: React.SetStateAction<boolean>) => void, 
    operation?:(movement:MovementCreation) => Promise<void>
  ) => {
    return async () => {
      loaderUpdater(true)
      const movement:MovementCreation = {
        amount: parseFloat(amount) * Math.pow(10, selectedCurrency.decimal_digits), 
        partner:selectedUser, 
        currency:selectedCurrency.code
      }
      operation && await operation(movement)
      loaderUpdater(false)
    }
  }

  const onSaveWrapper = asyncMovementOperationWrapper(setSaving, onSave)

  const onCancelWrapper = asyncMovementOperationWrapper(setCanceling, onCancel)

  return (
    <VStack alignItems="stretch" spacing={7}>
      <Heading as="h3" size="md">New Movement</Heading>
      <FormControl id="amount">
        <FormLabel>Amount</FormLabel>
        <NumberInput isRequired value={amount} precision={selectedCurrency.decimal_digits}
          onChange ={v => setAmount(v)}
          step={1 / Math.pow(10, selectedCurrency.decimal_digits)} 
          min={1 / Math.pow(10, selectedCurrency.decimal_digits)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl id="currency">
        <FormLabel>Currency</FormLabel>
        <Select isRequired placeholder="Select currency" value={selectedCurrency.code} onChange={e => setSelectedCurrency(cur => {
            setPrevCurrency(cur)
            return currencies[e.target.value]
          })}>
          {Object.values<Currency>(currencies).sort((a,b) => a.code.localeCompare(b.code)).map(cur => 
            <option key={cur.code} value={cur.code}>{`${cur.code} - ${cur.name}`}</option>
          )}
        </Select>
      </FormControl>
      <FormControl id="destinatary">
        <FormLabel>Destinatary</FormLabel>
        <Select isRequired placeholder="Who's going to receive it" 
          value={selectedUser} 
          onChange={e => setSelectedUser(e.target.value)}>
          {users.sort((a,b) => a.localeCompare(b)).map(user => 
            <option key={user} value={user}>{user}</option>
          )}
        </Select>
      </FormControl>
      <HStack>
        <Button bg="red.400" color='white' _hover={{'bg': 'red.300'}} variant="outline" onClick={() => onCancelWrapper()}>
          Cancel
        </Button>
        <Spacer/>
        <Button bg="brand" variant="solid" onClick={() => onSaveWrapper()}>
          Send
        </Button>
      </HStack>
    </VStack>
  )
}

export default NewMovementForm

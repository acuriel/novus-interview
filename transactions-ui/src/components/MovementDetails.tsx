import { Heading, IconButton, HStack, Skeleton, Spacer, VStack, Text, Tag, useEditableControls, ButtonGroup, Editable, EditablePreview, EditableInput, Flex, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaEdit } from 'react-icons/fa'
import { GrClose } from 'react-icons/gr'
import { useParams } from 'react-router-dom'
import { getMovementDirection, getTitle, useApi, useCurrency } from '../hooks'
import { Movement } from '../schemas'

interface MovementDetailsProps {
  user_id:string
}

interface MovementDetailsParams{
  movementId:string
}


const MovementDetails = ({user_id}: MovementDetailsProps) => {
  const [movement, setMovement] = useState<Movement>()
  const [fetchingMovement, setFetchingMovement] = useState(true)
  const {movementId} = useParams<MovementDetailsParams>()
  const [comment, setComment] = useState('')
  const api = useApi()
  const {currencies, toCurrencyAmount} = useCurrency()

  const fetchMovement = async () => {
    setFetchingMovement(true)
    const data = await api.retrieveMovement(movementId)
    setMovement(data)
    setComment(data.comment)
    setFetchingMovement(false)
  }

  useEffect(() => {
    fetchMovement()
  }, [movementId])

  const updateComment = async () => {
    if(movement){
      await api.updateComment(movementId, comment)
      setMovement({...movement, comment})
    }
  }

  return fetchingMovement || !movement
    ? <Skeleton height={400}/>
    : <VStack alignItems="start" alignContent="stretch">
        <HStack width="100%">
          <Heading size="lg" as="h3">{getTitle(movement, getMovementDirection(movement, user_id))}</Heading>
          <Spacer/>
          <Heading size="lg" as="h3">{toCurrencyAmount(movement.amount, currencies[movement.currency])}</Heading>
        </HStack>
        <HStack width="100%">
          <Text>{moment(movement.created_at).calendar()}</Text>
          <Spacer/>
          <Tag size='md' variant="solid" bg={movement.booked ? "green.500" : "red.400"}>
            {movement.booked ? "booked" : "pending"}
          </Tag>
        </HStack>
        <VStack width="100%" alignContent="end">
          <FormControl id="comments">
            <FormLabel>Comments</FormLabel>
            <Input type="text" as="textarea" value={comment} p={2} h={100} onChange={(e) => setComment(e.target.value)} />
          </FormControl>
          {comment !== movement.comment && <ButtonGroup variant="solid" spacing="6" alignSelf="end">
            <Button bg="red.400" _hover={{bg:"red.300"}} onClick={_ => setComment(movement.comment)}>Cancel</Button>
            <Button colorScheme="brand" onClick={_ => updateComment()}>Save</Button>
          </ButtonGroup>}
        </VStack>
      </VStack>

}

export default MovementDetails

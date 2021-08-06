import { Skeleton, StackDivider, VStack } from '@chakra-ui/react'
import React from 'react'
import { getMovementDirection } from '../hooks'
import { Movement } from '../schemas'
import MovementItem from './MovementItem'

interface MovementListProps {
  movements?:Movement[],
  user_id:string,
  loading?:boolean,
  onItemClick?: (movement:Movement) => void
}

const MovementList = ({movements, user_id, loading=true, onItemClick}: MovementListProps) => {
    const getContent = () => {
    if(movements && !loading) {
      return movements.map(movement => <MovementItem 
        key={movement.id} 
        movement={movement} 
        direction={getMovementDirection(movement, user_id)}
        onClick={onItemClick}
      />)
    } else{
        return (new Array(10)).map(_ => <Skeleton height="100px" />)
    }
  }
  
  return (
    <VStack spacing={0} divider={<StackDivider borderColor="gray.200" />} alignItems='stretch'>
        {getContent()}
      </VStack>
  )
}

export default MovementList

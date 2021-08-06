import { Heading, HStack, Icon, VStack, Text, Spacer, Link } from '@chakra-ui/react'
import React from 'react'
import { Movement } from '../schemas'
import { BiArrowFromLeft, BiArrowToLeft } from "react-icons/bi";
import moment from 'moment';
import { getTitle, MovementDirection, useCurrency } from '../hooks';


interface MovementItemProps {
  movement:Movement,
  direction:MovementDirection,
  onClick?: (movement:Movement) => void
}


const MovementItem = ({movement, direction, onClick}: MovementItemProps) => {
  const {toCurrencyAmount} = useCurrency(movement.currency)

  const getIcon = () => direction === MovementDirection.Income 
    ? <Icon 
        boxSize={10} color='green'
        as={BiArrowToLeft}
      />
    :  <Icon 
        boxSize={10} color='red'
        as={BiArrowFromLeft}
      />

  return (
    <Link onClick={() => onClick && onClick(movement)}>
      <HStack spacing={5} paddingX={5} paddingY={3}>
        {getIcon()}
        <VStack alignItems="start" padding={0}>
          <Heading as='h5' size='md' w={400}>{getTitle(movement, direction)}</Heading>
          <Text mt={0}>{moment(movement.created_at).calendar()}</Text>
        </VStack>
        <Spacer/>
        <Heading as='h5' size='md'>{toCurrencyAmount(movement.amount, undefined, direction)}</Heading>
      </HStack>
    </Link>
  )
}

export default MovementItem

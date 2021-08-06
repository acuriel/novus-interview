import { Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  
}

const EmptyMovement = (props: Props) => {
  return (
    <Flex alignItems="center" justifyContent="center" h='100%' w="100%">
      <Heading size="lg" as="h2" color="gray.300">Please, select a Movement for seeing its details.</Heading>
    </Flex>
  )
}

export default EmptyMovement

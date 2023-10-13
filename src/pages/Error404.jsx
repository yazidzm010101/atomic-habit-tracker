import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react'

import { Link } from 'react-router-dom'
import React from 'react'

function Error404() {
  return (
    <Container maxW={"container.xl"} h={"100vh"}>
      <VStack w={"full"} h={"full"} justifyContent={"center"} pb={32}>
        <Heading fontSize={"5xl"}>404</Heading>
        <Text textAlign={"center"}>Sorry, the requested page was not found.</Text>
        <Button as={Link} to={"/"} rounded={0} mt={4}>Back to home</Button>
      </VStack>
    </Container>
  )
}

export default Error404
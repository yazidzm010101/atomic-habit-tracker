import { HStack, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";

function HabitSummary() {
  return (
    <HStack w={"full"}>
      <VStack border={"1px solid rgb(0 0 0 / 0.1)"} px={4} py={6}>
        <Heading as={"p"} fontSize={"4xl"} color={"yellow.600"}>
          <span>23</span>
          <span style={{ fontSize: "16px" }}>pts</span>
        </Heading>
        <Text
          maxW={"100px"}
          textAlign={"center"}
          lineHeight={1}
          fontSize={"sm"}
        >
          Positive habits today!
        </Text>
      </VStack>
      <VStack border={"1px solid rgb(0 0 0 / 0.1)"} px={4} py={6}>
        <Heading as={"p"} fontSize={"4xl"} color={"red.600"}>
          <span>10</span>
          <span style={{ fontSize: "16px" }}>pts</span>
        </Heading>
        <Text
          maxW={"100px"}
          textAlign={"center"}
          lineHeight={1}
          fontSize={"sm"}
        >
          Negative habits today!
        </Text>
      </VStack>
      <VStack border={"1px solid rgb(0 0 0 / 0.1)"} px={4} py={6}>
        <Heading as={"p"} fontSize={"4xl"} color={"yellow.600"}>
          <span>13</span>
          <span style={{ fontSize: "16px" }}>pts</span>
        </Heading>
        <Text
          maxW={"100px"}
          textAlign={"center"}
          lineHeight={1}
          fontSize={"sm"}
        >
          Total points today
        </Text>
      </VStack>
      <VStack border={"1px solid rgb(0 0 0 / 0.1)"} px={4} py={6}>
        <Heading as={"p"} fontSize={"4xl"} color={"yellow.600"}>
          <span>1%</span>
        </Heading>
        <Text
          maxW={"100px"}
          textAlign={"center"}
          lineHeight={1}
          fontSize={"sm"}
        >
          Growth from yesterday
        </Text>
      </VStack>
    </HStack>
  );
}

export default HabitSummary;

import React, { useEffect, useRef } from "react";
import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { PiMinus, PiPlus } from "react-icons/pi";

const HabitItem = React.forwardRef(
  ({ name, category, baseScore, currentScores, reasoning, ...rest }, ref) => {
    return (
      <Box
        pos={"relative"}
        w={"full"}
        px={4}
        py={2}
        pr={6}
        border={"1px solid"}
        borderColor={"gray.100"}
        _hover={{
          border: "1px solid",
          borderColor: category == "Positive" ? "yellow.500" : "red.500",
        }}
        {...rest}
        ref={ref}
      >
        <HStack w={"full"} h={"full"}>
          <Text>{name}</Text>
          <Button
            h={"full"}
            px={3}
            pos={"absolute"}
            right={0}
            top={0}
            rounded={0}
          >
            <Icon as={category == "Positive" ? PiPlus : PiMinus} w={4} h={4} />
          </Button>
        </HStack>
      </Box>
    );
  },
);

export default HabitItem;

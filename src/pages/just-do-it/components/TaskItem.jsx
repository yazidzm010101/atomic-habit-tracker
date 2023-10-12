import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";

import { PiCheck } from "react-icons/pi";
import React from "react";
import { useTask } from "@/hooks/useTask";

const GroupItem = React.forwardRef(({ name, id, isDone, ...rest }, ref) => {
  const { toggleDone } = useTask();
  return (
    <Box
      pos={"relative"}
      w={"full"}
      px={4}
      py={2}
      pr={6}
      border={"1px solid"}
      borderColor={"gray.100"}
      {...rest}
      ref={ref}
    >
      <HStack w={"full"} h={"full"}>
        <Text textDecor={isDone && "line-through"}>{name}</Text>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleDone(id);
          }}
          h={"full"}
          px={3}
          pos={"absolute"}
          right={0}
          top={0}
          rounded={0}
        >
          <Icon as={PiCheck} w={4} h={4} />
        </Button>
      </HStack>
    </Box>
  );
});

export default GroupItem;

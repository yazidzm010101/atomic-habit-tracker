import {
  Button,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { DragDropContext } from "react-beautiful-dnd";
import GroupCreator from "./GroupCreator";
import { PiPlusBold } from "react-icons/pi";
import TaskList from "./TaskList";
import { useTask } from "@/hooks/useTask";

function GroupList() {
  const {
    getGroups: { data },
  } = useTask();
  const [groups, setGroups] = useState(data);
  const createDisc = useDisclosure();

  const onDragEnd = (source, destination) => {};

  useEffect(() => {
    setGroups(groups);
  }, [data]);

  return (
    <VStack alignItems={"start"}>
      <HStack
        spacing={4}
        w={"full"}
        alignItems={"stretch"}
        overflowX={"auto"}
        flexWrap={"nowrap"}
        minH={"60vh"}
        py={2}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {data?.map((item) => (
            <TaskList
              flexShrink={0}
              key={item.id}
              id={item.id}
              title={item.name}
              w={{ base: "full", md: "300px" }}
              data={item.tasks}
            />
          ))}
        </DragDropContext>
        <Button
          flexShrink={0}
          my={-2}
          rounded={0}
          border={"1px dashed"}
          borderColor={"rgb(0 0 0 / 0)"}
          _hover={{
            borderColor: "rgb(0 0 0 / 0.1)",
          }}
          onClick={createDisc.onOpen}
          variant={"outline"}
          w={{ base: "full", md: "300px" }}
          rightIcon={<Icon w={6} h={6} as={PiPlusBold} />}
        >
          <Heading fontSize={"xl"} textAlign={"start"} w={"full"}>
            Add group
          </Heading>
        </Button>
      </HStack>
      <GroupCreator isOpen={createDisc.isOpen} onClose={createDisc.onClose} />
    </VStack>
  );
}

export default GroupList;

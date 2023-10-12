import {
  Button,
  HStack,
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
import TaskList from "./TaskList";
import { useTask } from "@/hooks/useTask";

function GroupCreator({ isOpen, onClose }) {
  const { addGroup } = useTask();
  const [data, setData] = useState({ name: "", task: [] });

  const onSubmit = () => {
    addGroup(data);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setData({ name: "", task: [] });
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent rounded={0}>
        <ModalHeader>Add new task group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <VStack>
              <Text>Name</Text>
              <Input
                rounded={0}
                value={data.name}
                name="name"
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
              />
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onSubmit}>Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

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
      <Button rounded={0} onClick={createDisc.onOpen} variant={"outline"}>
        Add group
      </Button>
      <HStack
        spacing={0}
        w={"full"}
        alignItems={"stretch"}
        overflowX={"auto"}
        flexWrap={"nowrap"}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {data?.map((item) => (
            <TaskList
              key={item.id}
              id={item.id}
              title={item.name}
              w={{ base: "full", md: "300px" }}
              data={item.tasks}
            />
          ))}
        </DragDropContext>
      </HStack>
      <GroupCreator isOpen={createDisc.isOpen} onClose={createDisc.onClose} />
    </VStack>
  );
}

export default GroupList;

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
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import autosize from "autosize";
import { useTask } from "@/hooks/useTask";

const TextareaRef = React.forwardRef((props, ref) => (
  <Textarea {...props} ref={ref}>
    {props.children}
  </Textarea>
));

function TaskCreator({ isOpen, onClose: onCloseFn, groupId }) {
  const { addTask, getGroups } = useTask();
  const [data, setData] = useState({
    group_id: groupId,
    description: "",
    name: "",
    is_done: false,
  });
  const ref = useRef();

  const onClose = () => {
    setData({
      group_id: groupId,
      description: "",
      name: "",
      is_done: false,
    });
    onCloseFn();
  };

  const onSubmit = () => {
    addTask(data);
    getGroups.refetch();
    onCloseFn();
  };

  useEffect(() => {
    autosize(ref.current);
    return () => {
      autosize.destroy(ref.current);
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onCloseFn();
        setData({ name: "" });
      }}
    >
      <ModalOverlay />
      <ModalContent rounded={0}>
        <ModalHeader>Add new task</ModalHeader>
        <ModalCloseButton rounded={0} />
        <ModalBody>
          <VStack w={"full"}>
            <VStack w={"full"} alignItems={"start"}>
              <Text>Task</Text>
              <Input
                variant={"outline"}
                rounded={0}
                name="name"
                autoComplete="false"
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
              />
            </VStack>
            <VStack w={"full"} alignItems={"start"}>
              <Text>Description</Text>
              <TextareaRef
                variant={"outline"}
                rounded={0}
                name="description"
                ref={ref}
                autoComplete={"false"}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
              />
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button rounded={0} onClick={onClose}>
              Cancel
            </Button>
            <Button
              rounded={0}
              bg={"yellow.600"}
              color={"white"}
              onClick={onSubmit}
            >
              Add
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TaskCreator;

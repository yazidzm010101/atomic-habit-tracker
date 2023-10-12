import {
  Button,
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useTask } from "@/hooks/useTask";

function GroupCreator({ isOpen, onClose }) {
  const { addGroup } = useTask();
  const [data, setData] = useState({ name: "", tasks: [] });

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

export default GroupCreator;

import {
  Button,
  Fade,
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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import FocusMode from "./FocusMode";
import autosize from "autosize";
import { useTask } from "@/hooks/useTask";

const TextareaRef = React.forwardRef((props, ref) => (
  <Textarea {...props} ref={ref}>
    {props.children}
  </Textarea>
));

function TaskDetail({ isOpen, onClose: onCloseFn, data: initialData }) {
  const { updateTaskById, getTaskById, removeTaskById, getGroups } = useTask();

  const [data, setData] = useState({
    name: "",
    is_done: false,
    description: "",
  });

  const [editMode, setEditMode] = useState(false);
  const deleteDisc = useDisclosure();
  const focusModeDisc = useDisclosure();
  const ref = useRef();

  const onSubmit = () => {
    updateTaskById(data, data.id);
    getGroups.refetch();
    onClose();
  };

  const onClose = () => {
    focusModeDisc.onClose();
    setEditMode(false);
    setData({});
    onCloseFn();
  };

  const onRemove = () => {
    removeTaskById(data.id);
    getGroups.refetch();
    deleteDisc.onClose();
    onClose();
  };

  useEffect(() => {
    autosize(ref.current);
    return () => {
      autosize.destroy(ref.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen && initialData?.id) {
      getTaskById(initialData.id).then((success) => setData(success));
    }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded={0}>
          <ModalHeader>{(editMode && "Update habit") || "Detail"}</ModalHeader>
          <ModalCloseButton rounded={0} />
          <ModalBody>
            <VStack w={"full"}>
              <VStack w={"full"} alignItems={"start"}>
                <Text>Task</Text>
                <Input
                  variant={"outline"}
                  rounded={0}
                  name="name"
                  value={data.name || ""}
                  disabled={!editMode}
                  _disabled={{ opacity: 1 }}
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
                  value={data.description || ""}
                  disabled={!editMode}
                  _disabled={{ opacity: 1 }}
                  ref={ref}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                />
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            {(editMode && (
              <HStack as={Fade} w={"full"} in={editMode} unmountOnExit>
                <Button
                  rounded={0}
                  onClick={deleteDisc.onOpen}
                  mr={"auto"}
                  colorScheme="red"
                  variant={"outline"}
                >
                  Remove
                </Button>
                <Button
                  rounded={0}
                  variant={"outline"}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  rounded={0}
                  bg={"yellow.600"}
                  color={"white"}
                  onClick={onSubmit}
                  colorScheme="yellow"
                  variant={"solid"}
                >
                  Update
                </Button>
              </HStack>
            )) || (
              <HStack w={"full"}>
                <Button rounded={0} mr={"auto"} onClick={focusModeDisc.onOpen}>
                  Focus Mode
                </Button>
                <Button
                  rounded={0}
                  bg={"yellow.600"}
                  color={"white"}
                  colorScheme="yellow"
                  variant={"solid"}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              </HStack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={deleteDisc.isOpen} onClose={deleteDisc.onClose}>
        <ModalOverlay />
        <ModalContent rounded={0}>
          <ModalBody>Are you sure want to remove this item?</ModalBody>
          <ModalFooter>
            <HStack>
              <Button rounded={0} onClick={deleteDisc.onClose}>
                Cancel
              </Button>
              <Button
                rounded={0}
                bg={"yellow.600"}
                color={"white"}
                onClick={onRemove}
              >
                Remove
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <FocusMode
        id={data.id}
        isOpen={focusModeDisc.isOpen}
        onClose={focusModeDisc.onClose}
      />
    </>
  );
}

export default TaskDetail;

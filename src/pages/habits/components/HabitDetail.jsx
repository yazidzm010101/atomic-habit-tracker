import { useHabits } from "@/hooks/useHabits";
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
  Portal,
  ScaleFade,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import autosize from "autosize";
import React, { useEffect, useRef, useState } from "react";

const TextareaRef = React.forwardRef((props, ref) => (
  <Textarea {...props} ref={ref}>
    {props.children}
  </Textarea>
));

function HabitDetail({ isOpen, onClose, data: initialData }) {
  const { updateHabitById, getHabitById, removeHabitById, getHabits } =
    useHabits();
  const [data, setData] = useState({
    name: "",
    base_score: 1,
    description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const deleteDisc = useDisclosure();
  const ref = useRef();

  const onSubmit = () => {
    updateHabitById(data, data.id);
    getHabits.refetch();
    onClose();
  };

  const onRemove = () => {
    removeHabitById(data.id);
    getHabits.refetch();
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
    if (!!initialData && !!initialData.id) {
      getHabitById(initialData.id).then((resp) => setData(resp));
    }
  }, [initialData]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setData({ category });
        }}
      >
        <ModalOverlay />
        <ModalContent rounded={0}>
          <ModalHeader>{(editMode && "Update habit") || "Detail"}</ModalHeader>
          <ModalCloseButton rounded={0} />
          <ModalBody>
            <VStack w={"full"}>
              <VStack w={"full"} alignItems={"start"}>
                <Text>Habit</Text>
                <Input
                  variant={"outline"}
                  rounded={0}
                  name="name"
                  value={data.name}
                  disabled={!editMode}
                  _disabled={{ opacity: 1 }}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                />
              </VStack>
              <VStack w={"full"} alignItems={"start"}>
                <Text>Base Score</Text>
                <Input
                  type="number"
                  min={1}
                  variant={"outline"}
                  rounded={0}
                  name="base_score"
                  value={data.base_score}
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
                  value={data.description}
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
              <HStack as={Fade} w={"full"} in={!editMode} unmountOnExit>
                <Button
                  rounded={0}
                  ml={"auto"}
                  variant={"outline"}
                  onClick={() => {
                    deleteDisc.onClose();
                    onClose();
                  }}
                >
                  Cancel
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
    </>
  );
}

export default HabitDetail;

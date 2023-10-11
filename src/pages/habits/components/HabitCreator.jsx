import { useHabits } from "@/hooks/useHabits";
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
  Portal,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import autosize from "autosize";
import React, { useEffect, useRef, useState } from "react";

const TextareaRef = React.forwardRef((props, ref) => (
  <Textarea {...props} ref={ref}>
    {props.children}
  </Textarea>
));

function HabitCreator({ isOpen, onClose, category }) {
  const { addHabit, getHabits } = useHabits();
  const [data, setData] = useState({ category });
  const ref = useRef();

  console.log(data);

  const onSubmit = () => {
    addHabit(data);
    getHabits.refetch();
    onClose();
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
        onClose();
        setData({ category });
      }}
    >
      <ModalOverlay />
      <ModalContent rounded={0}>
        <ModalHeader>Add new habit</ModalHeader>
        <ModalCloseButton rounded={0} />
        <ModalBody>
          <VStack w={"full"}>
            <VStack w={"full"} alignItems={"start"}>
              <Text>Habit</Text>
              <Input
                variant={"outline"}
                rounded={0}
                name="name"
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

export default HabitCreator;

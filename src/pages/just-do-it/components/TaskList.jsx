import {
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { Draggable } from "react-beautiful-dnd";
import DroppableStrict from "@/components/DroppableStrict";
import { PiPlus } from "react-icons/pi";
import TaskCreator from "./TaskCreator";
import TaskDetail from "./TaskDetail";
import TaskItem from "./TaskItem";
import { useState } from "react";

function TaskList({ id, title, data, ...rest }) {
  const [detail, setDetail] = useState({});
  const createDisc = useDisclosure();
  const detailDisc = useDisclosure();

  return (
    <>
      <VStack px={3} spacing={3} w={"full"} {...rest} pos={"relative"}>
        <Heading fontSize={"xl"} alignSelf={"flex-start"} mb={3} as={"h5"}>
          {title}
        </Heading>
        <DroppableStrict droppableId={String(id)}>
          {(droppableProvided) => (
            <VStack
              spacing={3}
              w={"full"}
              flexGrow={1}
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              pb={12}
            >
              {data?.map((item, i) => (
                <Draggable
                  key={item.id}
                  draggableId={String(item.id)}
                  index={i}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <TaskItem
                      id={item.id}
                      name={item.name}
                      isDone={item.is_done}
                      onClick={() => {
                        setDetail(item);
                        detailDisc.onOpen();
                      }}
                      {...draggableProvided.dragHandleProps}
                      {...draggableProvided.draggableProps}
                      ref={draggableProvided.innerRef}
                      pointerEvents={item.is_loading && "none"}
                      opacity={item.is_loading && 0.5}
                    />
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
              <HStack
                cursor={"pointer"}
                py={2}
                w={"full"}
                border={"1px dashed"}
                borderColor={"gray.300"}
                minW={"full"}
                px={4}
                justifyContent={"center"}
                onClick={createDisc.onOpen}
              >
                <Icon as={PiPlus} w={4} h={4} />
                <Text maxW={"max-content"}>Add new task</Text>
              </HStack>
            </VStack>
          )}
        </DroppableStrict>
      </VStack>
      <TaskCreator
        category={title}
        groupId={id}
        onClose={createDisc.onClose}
        isOpen={createDisc.isOpen}
      />
      <TaskDetail
        data={detail}
        onClose={detailDisc.onClose}
        isOpen={detailDisc.isOpen}
      />
    </>
  );
}

export default TaskList;

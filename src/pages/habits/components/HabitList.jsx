import React, { useEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { PiPlus } from "react-icons/pi";
import { Draggable } from "react-beautiful-dnd";
import DroppableStrict from "@/components/DroppableStrict";
import HabitItem from "./HabitItem";
import HabitCreator from "./HabitCreator";
import HabitDetail from "./HabitDetail";

function HabitList({ title, data, ...rest }) {
  const id = title.split(/\s+/g).join("-");
  const [detail, setDetail] = useState({});
  const createDisc = useDisclosure();
  const detailDisc = useDisclosure();

  return (
    <>
      <VStack px={3} spacing={3} w={"full"} {...rest} pos={"relative"}>
        <Heading fontSize={"xl"} alignSelf={"flex-start"} mb={3} as={"h5"}>
          {title}
        </Heading>
        <DroppableStrict droppableId={id}>
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
                    <HabitItem
                      name={item.name}
                      category={item.category}
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
                <Text maxW={"max-content"}>Add new habit</Text>
              </HStack>
            </VStack>
          )}
        </DroppableStrict>
      </VStack>
      <HabitCreator
        category={title}
        onClose={createDisc.onClose}
        isOpen={createDisc.isOpen}
      />
      <HabitDetail
        data={detail}
        onClose={detailDisc.onClose}
        isOpen={detailDisc.isOpen}
      />
    </>
  );
}

export default HabitList;

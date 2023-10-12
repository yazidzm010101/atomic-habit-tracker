import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  Portal,
  ScaleFade,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { PiCheckBold, PiPlayBold, PiStopBold, PiX } from "react-icons/pi";
import { useEffect, useState } from "react";

import { convertMsToTime } from "@/libs/timer";
import { useTask } from "@/hooks/useTask";

function FocusMode({ isOpen, onClose, id }) {
  const { updateTaskById, getTaskById } = useTask();
  const [data, setData] = useState({});
  const [timer, setTimer] = useState(
    data?.timer || {
      status: "stopped",
      duration: 0,
      data: [],
    },
  );
  const screen = useFullScreenHandle();

  // on button start
  // update UI state
  // & update indexed DB
  const handleStart = () => {
    let new_data = {
      ...timer,
      status: "running",
      data: [
        ...timer.data,
        {
          start: Date.now(),
          end: Date.now(),
        },
      ],
    };
    new_data.duration = new_data.data.reduce((store, timer_record) => {
      store += timer_record.end - timer_record.start;
      return store;
    }, 0);
    setTimer(new_data);
    updateTaskById({ ...data, timer: new_data }, data.id);
  };

  // on button stop
  // update UI state
  // & update indexed DB
  const handleStop = () => {
    let new_data = {
      ...timer,
      status: "stopped",
      data: [
        ...timer.data.slice(0, timer.data.length - 1),
        {
          ...timer.data[timer.data.length - 1],
          end: Date.now(),
        },
      ],
    };
    new_data.duration = new_data.data.reduce((store, timer_record) => {
      store += timer_record.end - timer_record.start;
      return store;
    }, 0);
    setTimer(new_data);
    updateTaskById({ ...data, timer: new_data }, data.id);
  };

  // on button done
  // update UI state
  // & mark done in indexed db
  const handleDone = () => {
    let new_data = {
      ...timer,
      status: "done",
    };
    new_data.duration = new_data.data.reduce((store, timer_record) => {
      store += timer_record.end - timer_record.start;
      return store;
    }, 0);
    setTimer(new_data);
    updateTaskById({ ...data, is_done: true, timer: new_data }, data.id).then(
      () => {
        onClose();
      },
    );
  };

  useEffect(() => {
    if (isOpen) {
      getTaskById(id).then((newData) => {
        setData(newData);
        setTimer(
          newData?.timer || {
            status: "stopped",
            duration: 0,
            data: [],
          },
        );
      });
      screen.enter();
    } else {
      if (screen.active) {
        screen.exit();
      }
      setData({});
      setTimer({
        status: "stopped",
        duration: 0,
        data: [],
      });
    }
  }, [isOpen]);

  useEffect(() => {
    let intervalId;
    if (timer.status == "running") {
      intervalId = setInterval(() => {
        let new_data = {
          ...timer,
          data: [
            ...timer.data.slice(0, timer.data.length - 1),
            {
              ...(timer.data[timer.data.length - 1] || Date.now()),
              end: Date.now(),
            },
          ],
        };
        new_data.duration = new_data.data.reduce((store, timer_record) => {
          store += timer_record.end - timer_record.start;
          return store;
        }, 0);
        setTimer(new_data);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [timer.status]);

  // console.log(currTimer)
  const { hours, minutes, seconds } = convertMsToTime(timer.duration);

  return (
    <Portal>
      <FullScreen handle={screen}>
        <Box
          unmountOnExit
          as={ScaleFade}
          in={isOpen}
          pos={"fixed"}
          top={0}
          left={0}
          h={"full"}
          w={"full"}
          bg={"white"}
          zIndex={2000}
        >
          <Button
            onClick={onClose}
            variant={"ghost"}
            rounded={0}
            px={1}
            py={1}
            pos={"absolute"}
            top={4}
            right={4}
          >
            <Icon as={PiX} h={6} w={6} />
          </Button>
          <VStack justifyContent={"center"} h={"full"} pb={20}>
            <Heading userSelect={"none"} fontSize={"6xl"} textAlign={"center"}>
              {data?.name}
            </Heading>
            <HStack userSelect={"none"} fontSize={"7xl"}>
              <Text>{("00" + hours).slice(-2)}</Text>
              <Text>:</Text>
              <Text>{("00" + minutes).slice(-2)}</Text>
              <Text>:</Text>
              <Text>{("00" + seconds).slice(-2)}</Text>
            </HStack>
            <HStack spacing={4}>
              <Button
                isDisabled={["running", "done"].indexOf(timer.status) > -1}
                onClick={handleStart}
                rounded={0}
                variant={"ghost"}
                leftIcon={<Icon as={PiPlayBold} />}
              >
                Start
              </Button>
              <Button
                isDisabled={["stopped", "done"].indexOf(timer.status) > -1}
                onClick={handleStop}
                rounded={0}
                variant={"ghost"}
                leftIcon={<Icon as={PiStopBold} />}
              >
                Stop
              </Button>
              <Button
                isDisabled={timer.status == "done"}
                onClick={handleDone}
                rounded={0}
                variant={"ghost"}
                leftIcon={<Icon as={PiCheckBold} />}
              >
                Done
              </Button>
            </HStack>
            <VStack w={"400px"} spacing={0} my={10}>
              {[...timer?.data].reverse().map((timer_record, i) => (
                <>
                  <HStack w={"full"}>
                    <Text w={4} flexShrink={0}>
                      {timer.data.length - i}
                    </Text>
                    <Text flexGrow={1} textAlign={"center"}>
                      {
                        convertMsToTime(timer_record.end - timer_record.start)
                          .fulltext
                      }
                    </Text>
                  </HStack>
                  {i != timer.data.length - 1 && <Spacer as="hr" my={2} />}
                </>
              ))}
            </VStack>
          </VStack>
        </Box>
      </FullScreen>
    </Portal>
  );
}

export default FocusMode;

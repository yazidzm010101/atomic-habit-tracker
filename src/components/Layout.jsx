import { getLocalizedString } from "@/hooks/useLocale";
import { usePreferences } from "@/hooks/usePreferences";
import { Box, HStack, Link, Text } from "@chakra-ui/react";
import React from "react";
import { Outlet, Link as ReactLink } from "react-router-dom";
import route from "@/configs/route";

function Layout() {
  return (
    <>
      <Box
        bg={"white"}
        boxShadow={"0 4px 8px white"}
        pos={"fixed"}
        top={0}
        left={0}
        w={"full"}
        h={16}
        px={6}
      >
        <HStack spacing={8} w={"full"} h={"full"}>
          <HStack spacing={0} fontWeight={"black"}>
            <Text color={"gold"}>Atomic</Text>
            <Text>Habit Tracker</Text>
          </HStack>
          <HStack spacing={4}>
            <Link as={ReactLink} to={route.habits}>
              {getLocalizedString("title_habit")}
            </Link>
            <Link as={ReactLink} to={route.just_do_it}>
              {getLocalizedString("title_just_do_it")}
            </Link>
            <Link as={ReactLink} to={route.achievements}>
              {getLocalizedString("title_achievements")}
            </Link>
            <Link as={ReactLink} to={route.progress_tracker}>
              {getLocalizedString("title_progress_tracker")}
            </Link>
          </HStack>
        </HStack>
      </Box>
      <Box pt={16}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;

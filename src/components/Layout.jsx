import React from "react";

import {
  Box,
  Container,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Outlet, Link as ReactLink, useLocation } from "react-router-dom";
import {
  PiHandFist,
  PiUserList,
  PiMedal,
  PiChartBar,
  PiUserListDuotone,
  PiHandFistDuotone,
  PiMedalDuotone,
  PiChairDuotone,
} from "react-icons/pi";

import route from "@/configs/route";
import { getLocalizedString } from "@/hooks/useLocale";

function Layout() {
  return (
    <>
      <Navbar />
      <Box py={6} pl={"300px"}>
        <Container maxW={"container.xl"}>
          <Outlet />
        </Container>
      </Box>
    </>
  );
}

function Navbar() {
  return (
    <Box
      bg={"white"}
      boxShadow={"0 4px 20px white"}
      borderRight={"1px solid"}
      borderColor={"gray.200"}
      pos={"fixed"}
      top={0}
      left={0}
      w={"300px"}
      maxW={"full"}
      h={"100vh"}
      zIndex={999}
    >
      <VStack spacing={8} w={"full"}>
        <HStack
          spacing={0}
          px={8}
          py={4}
          justifyContent={"center"}
          fontWeight={"black"}
          w={"full"}
          borderBottom={"2px dotted"}
          borderColor={"gray.200"}
        >
          <Text color={"yellow.500"}>Atomic</Text>
          <Text>Habit Tracker</Text>
        </HStack>
        <VStack
          w={"full"}
          spacing={2}
          fontWeight={"medium"}
          fontSize={"1rem"}
          alignItems={"flex-start"}
        >
          <NavbarItem
            href={route.habits}
            icon={PiUserList}
            activeIcon={PiUserListDuotone}
          >
            {getLocalizedString("title_habit")}
          </NavbarItem>
          <NavbarItem
            href={route.just_do_it}
            icon={PiHandFist}
            activeIcon={PiHandFistDuotone}
          >
            {getLocalizedString("title_just_do_it")}
          </NavbarItem>
          <NavbarItem
            href={route.achievements}
            icon={PiMedal}
            activeIcon={PiMedalDuotone}
          >
            {getLocalizedString("title_achievements")}
          </NavbarItem>
          <NavbarItem
            href={route.progress_tracker}
            icon={PiChartBar}
            activeIcon={PiChairDuotone}
          >
            {getLocalizedString("title_progress_tracker")}
          </NavbarItem>
        </VStack>
      </VStack>
    </Box>
  );
}

function NavbarItem({ children, href, icon, activeIcon }) {
  const { pathname } = useLocation();
  const isActive = pathname == href;
  return (
    <Link
      as={ReactLink}
      to={href}
      px={4}
      py={3}
      w={"full"}
      bg={isActive && "gray.100"}
      borderRight={isActive && "5px solid"}
      borderColor={isActive && "gray.800"}
      color={isActive && "yellow.600"}
      fontWeight={isActive && "black"}
    >
      <HStack>
        {icon && (
          <Icon mr={2} h={5} w={5} as={(isActive && activeIcon) || icon} />
        )}
        <Text>{children}</Text>
      </HStack>
    </Link>
  );
}

export default Layout;

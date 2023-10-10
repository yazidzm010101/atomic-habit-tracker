import { Route, Routes, Navigate } from "react-router-dom";
import route from "@/configs/route";

import React from "react";
import Layout from "@/components/Layout";
import Habits from "@/pages/habits/Habits";

function Router() {
  return (
    <Routes>
      <Route path={"/"} element={<Layout />}>
        <Route index element={<Navigate to={route.habits} />} />
        <Route path={route.habits} element={<Habits />} />
      </Route>
    </Routes>
  );
}

export default Router;

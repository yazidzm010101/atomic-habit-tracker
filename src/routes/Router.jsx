import { Navigate, Route, Routes } from "react-router-dom";

import Habits from "@/pages/habits/Habits";
import JustDoIt from "@/pages/just-do-it/JustDoIt";
import Layout from "@/components/Layout";
import route from "@/configs/route";

function Router() {
  return (
    <Routes>
      <Route path={"/"} element={<Layout />}>
        <Route index element={<Navigate to={route.habits} />} />
        <Route path={route.habits} element={<Habits />} />
        <Route path={route.just_do_it} element={<JustDoIt />} />
      </Route>
    </Routes>
  );
}

export default Router;

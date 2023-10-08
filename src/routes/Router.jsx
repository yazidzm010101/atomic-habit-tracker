import { Route, Routes } from "react-router-dom";
import route from "@/configs/route"

import React from "react";
import Layout from "@/components/Layout";

function Router() {
  return (
    <Routes>
      <Route path={"/"} element={<Layout/>}/>
    </Routes>
  );
}

export default Router;

import React from "react";
import Global from "./components/global";
import Fancy from "./components/fancy";
import { create, all } from 'mathjs';

const config = {}
export const math = create(all, config);

function App() {
  return (
    <Global>
      <Fancy />
    </Global >
  )
}

export default App

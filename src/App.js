import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { Routers } from "./Router/Routers";

export const AppHome = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </React.StrictMode>
  );
}
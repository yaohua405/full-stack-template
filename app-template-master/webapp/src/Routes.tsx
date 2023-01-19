import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Test from "./components/Test"

const MyRoutes = () => {
  return (
    <BrowserRouter basename={process.env.SERVER_URL_PREFIX__S || "" + process.env.APP_PATH__S}>
      <Routes>
        <Route index element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}
export default MyRoutes

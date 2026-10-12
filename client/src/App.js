import React, { Component } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToHash from "./components/pageState/ScrollToHash";
import LinkedPage from "./components/pageState/LinkedPage";
import JoinUs from "./pages/JoinUs";
import Apply from "./pages/Apply";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<LinkedPage />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/join-us/:roleId/apply" element={<Apply />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

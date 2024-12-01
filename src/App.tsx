import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import { Quizview } from "./pages/Quizview";
import Quizzes from "./pages/Quizzes";
import { Playquiz } from "./pages/Playquiz";
import { Scoreboard } from "./pages/Scoreboard";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";


function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/:quizId" element={<Quizview />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:quizId" element={<Playquiz />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

"use client";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Boxbutton } from "./buttons/Boxbutton";
import { Primarybutton } from "./buttons/Primarybutton";

export const Appbar = () => {
  const navigate=useNavigate();
  return (
    <div className="border-b flex justify-between px-8 py-4">
      <div className="font-extrabold text-2xl cursor-pointer" onClick={() => navigate("/dashboard")}>
        Quizzer
      </div>
      <div className="flex gap-2">
        <Boxbutton lable={"Contact sales"} />
        <Boxbutton lable={"Log in"} />
        <Primarybutton
          lable={"Sign up"}
          type={"small"}
          onClick={() => <Link to="/signup" />}
        />
      </div>
    </div>
  );
};

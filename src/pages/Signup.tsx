import { Link, useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Input2box } from "../components/Input2box";
import { Inputbox } from "../components/Inputbox";
import { Primarybutton } from "../components/buttons/Primarybutton";
import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();

  return (
    <div>
      <Appbar token={null}/>
      <div className="grid md:grid-cols-2 lg:px-40 py-20">
        <div className="col-span-1 hidden md:block">
          <div className="h-1/5">
            <img
              src="https://media.istockphoto.com/id/873137910/vector/quiz-concept.jpg?s=612x612&w=0&k=20&c=6YKue8udV7Dm_hyeL1UV6G4avHCNcDe8iAq4Lc-MypU="
              alt=""
            />
          </div>
        </div>

        <div className="col-span-1 px-10 ">
          <div className="px-6 py-6 border  rounded-lg border-2 flex-col items-center justify-items-center">
            <Input2box
              lable={"* Work email"}
              placeholder={"Email"}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="flex gap-4">
              <Input2box
                lable={"* Name"}
                placeholder={"Name"}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Input2box
                lable={"* Password"}
                placeholder={"Password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div className="pb-3 text-md">
              By signing up, you agree to YBMQuiz{" "}
              <Link
                to={
                  "https://www.termsfeed.com/blog/privacy-policy-url/#What_S_A_Privacy_Policy"
                }
                className="text-sky-600 underline"
              >
                terms of service and privacy policy.
              </Link>
            </div>
            <Primarybutton
              lable={"Get started for free"}
              type="big"
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/signup",
                  {
                    name: name,
                    email: email,
                    password: password,
                  }
                );

                console.log(response);

                if (response) {
                  navigate("/signin");
                }
              }}
            />
            <div className="pt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/signin")}
                className="text-sky-600 underline"
              >
                Log in
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

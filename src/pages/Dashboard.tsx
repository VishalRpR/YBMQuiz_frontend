import { Link, useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Primarybutton } from "../components/buttons/Primarybutton";
import { useEffect, useState } from "react";
import axios from "axios";

interface quiz {
  title: string;
  description: string;
  createdAt: string;
  id: string;
}

const Dashboard = () => {
  const token=localStorage.getItem("token")
  const navigate = useNavigate();
  const [allquizes, setAllquizes] = useState<quiz[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");

  useEffect(() => {
    async function getQuiz() {
      const quizes = await axios.get("http://localhost:3000/api/v1/quiz/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      setAllquizes(quizes.data.quizes);
    }
    getQuiz();
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/quiz/",
        {
          title: quizTitle,
          description: quizDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      setAllquizes((prevQuizes) => [
        ...prevQuizes,
        {
          title: quizTitle,
          description: quizDescription,
          createdAt: new Date().toISOString(),
          id: response.data.quizId,
        },
      ]);
      setShowModal(false); // Close the modal after creating quiz
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div>
      <Appbar token={token} />
      <div className="flex justify-center gap-5 items-center">
        <div className="text-3xl font-extrabold text-center py-9">
          Make your own Quiz
        </div>
        <div className="max-w-lg">
          <Primarybutton
            lable="+ Create"
            type="big"
            onClick={() => setShowModal(true)} // Open the modal
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Create a New Quiz</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="title">
                Quiz Title
              </label>
              <input
                id="title"
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter quiz title"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="description"
              >
                Quiz Description
              </label>
              <textarea
                id="description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter quiz description"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)} // Close modal without saving
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleCreateQuiz} // Submit the form
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-10 h-screen border-t">
        <div className="col-span-2 border-r">
          <div
            className="text-center py-3 hover:bg-slate-200"
            onClick={() => navigate("/quizzes")}
          >
            Quizzes
          </div>
          <div
            className="text-center py-3 hover:bg-slate-200"
            onClick={() => navigate("/scoreboard")}
          >
            Scoreboard
          </div>
        </div>
        <div className="col-span-8 pl-14">
          <div className="py-3">Your Quiz</div>
          <div className="">
            <div className="p-8 max-w-screen-lg w-full">
              <div className="flex">
                <div className="flex-1">Title</div>
                <div className="flex-1">Description</div>
                <div className="flex-1">Created At</div>
                <div className="flex-1">Code</div>
              </div>

              {allquizes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex border-b border-t py-4 hover:bg-green-100"
                  onClick={() => {
                    navigate(`/quiz/${quiz.id}`);
                  }}
                >
                  <div className="flex-1 ">{quiz.title}</div>
                  <div className="flex-1">{quiz.description}</div>
                  <div className="flex-1"> {quiz.createdAt}</div>
                  <div className="flex-1">{quiz.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

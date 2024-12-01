import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";

const Quizzes = () => {
  const token = localStorage.getItem("token");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(""); // Reset error message before each API call
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Replace with actual token
            },
          }
        );
        setQuizzes(response.data.quizes); // Set fetched quizzes in state
      } catch (err) {
        setError("Failed to fetch quizzes.");
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchQuizzes();
  }, []); // Empty dependency array to run the effect once when the component is mounted

  const handleStartQuiz = (quizId: string) => {
    // Navigate to the quiz details page when the button is clicked
    navigate(`/quizzes/${quizId}`);
  };

  return (
    <div>
      <Appbar token={token} />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Quizzes</h2>
        {loading && <p>Loading quizzes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {quizzes.length === 0 && !loading && !error && (
          <p>No quizzes available.</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border p-4 rounded-md shadow-md">
              <h3 className="text-xl font-bold">{quiz.title}</h3>
              <p>{quiz.description}</p>
              <button
                onClick={() => handleStartQuiz(quiz.id)} // Trigger navigate on button click
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;

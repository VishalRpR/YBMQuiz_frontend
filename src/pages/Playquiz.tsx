import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";

export const Playquiz = () => {
  const token = localStorage.getItem("token");
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [markid, setMarkid] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [score, setScore] = useState<number>(0); // Total score tracking
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Fetching quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/quizzes/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(response.data.question);
      } catch (err) {
        setError("Failed to fetch questions.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  // Post user response
  const postResponse = async (questionId: string, selectedOptionId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/quizzes/${quizId}`,
        {
          questionId,
          markId: markid,
          selectedOptionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      setMarkid(response.data.marker);
     
      if (response.data.result === "CORRECT") {
        setScore((prev) => {
          const newScore = prev + 1;
        
          return newScore;
        });
      }
    } catch (err) {
      console.error("Error submitting response:", err);
    }
  };

  // Submit total marks and navigate to scoreboard
  const submitMarks = async () => {
    try {
     
      await axios.post(
        `http://localhost:3000/api/v1/marks/${quizId}`,
        {
          totalMarks: score,
          markid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      navigate("/scoreboard")
    } catch (err) {
      console.error("Error submitting marks:", err);
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  // Handle next question or submit
  const handleNextOrSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption) {
      await postResponse(currentQuestion.id, selectedOption); // Submit the response
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Go to the next question
      setSelectedOption(null); // Reset selected option
    } else {
      setQuizCompleted(true); // Mark quiz as completed
     
    }
  };


  useEffect(() => {
    if (quizCompleted) {
    
      submitMarks();
    }
  }, [quizCompleted]);


  // Display the current question and options
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Appbar token={token} />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz: {quizId}</h2>
        {loading && <p>Loading questions...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {questions.length === 0 && !loading && !error && (
          <p>No questions available.</p>
        )}

        {!quizCompleted && currentQuestion && (
          <div className="border p-4 rounded-md shadow-md">
            <h3 className="text-xl font-bold mb-4">{currentQuestion.text}</h3>

            {/* Render options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option: any) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name="option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => handleOptionSelect(option.id)}
                    className="mr-2"
                  />
                  <label htmlFor={option.id}>{option.text}</label>
                </div>
              ))}
            </div>

            {/* Next or Submit button */}
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleNextOrSubmit}
                disabled={selectedOption === null}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </div>
        )}

        {quizCompleted && (
          <div className="text-center">
            <h3 className="text-2xl font-bold">Quiz Completed!</h3>
            <p className="text-xl mt-4">Your Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

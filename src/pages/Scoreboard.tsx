import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";

export const Scoreboard = () => {
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedMarkId, setSelectedMarkId] = useState<number | null>(null); // Store the ID of the selected mark

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:3000/api/v1/marks", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMyOTUwNzI3fQ.QZ7hFWtG6ZoVIgH28HPFcCz-gKXhFEWCBGIIRYGRINc`, // Replace with your actual token
          },
        });

        const sortedMarks = response.data.mark.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setMarks(sortedMarks);
        setSelectedMarkId(sortedMarks[0]?.id || null); // Select the latest quiz by default
      } catch (err) {
        setError("Failed to fetch marks.");
        console.error("Error fetching marks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  const handleQuizClick = (markId: number) => {
    setSelectedMarkId(markId); // Set the selected quiz's mark ID
  };

  const selectedMark = marks.find((mark) => mark.id === selectedMarkId); // Get the selected mark details

  return (
    <div>
      <Appbar />

      <div className="flex p-6">
        {/* Left side - Scoreboard */}
        <div className="w-1/3 pr-6 overflow-hidden overflow-y-scroll h-screen">
          <h2 className="text-2xl font-bold mb-4">Scoreboard</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul>
            {marks.map((mark) => (
              <li
                key={mark.id}
                className={`border-b py-6 flex flex-col items-center cursor-pointer ${
                  selectedMarkId === mark.id
                    ? "bg-yellow-100 border-yellow-500 rounded-lg shadow-md"
                    : ""
                }`}
                onClick={() => handleQuizClick(mark.id)}
              >
                <div className="text-lg font-semibold mb-2">
                  {mark.quiz.title}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {mark.quiz.description}
                </div>
                <div className="flex items-center text-3xl font-bold text-blue-600 mb-2">
                  <span>
                    {mark.total} / {mark.quiz.questions.length}
                  </span>
                  <i className="fas fa-trophy text-yellow-500 ml-3"></i>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(mark.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side - Quiz Stats */}
        <div className="w-2/3 px-20">
          {selectedMark ? (
            selectedMark.response.length <
            selectedMark.quiz.questions.length ? (
              // Abandoned test case
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-red-600 mb-4">
                  Abandoned Test
                </h3>
                <p className="text-lg">Score: 0</p>
              </div>
            ) : (
              // Render quiz stats
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Questions for "{selectedMark.quiz.title}"
                </h3>
                <ul>
                  {selectedMark.quiz.questions.map((question: any) => (
                    <li key={question.id} className="border-b py-4">
                      <div className="text-lg font-medium">{question.text}</div>
                      <ul className="mt-4">
                        {question.options.map((option: any) => {
                          // Determine if this option is correct
                          const isCorrect =
                            option.id === question.correctOptionId;

                          // Determine if this option was selected by the user
                          const isSelected = selectedMark.response.some(
                            (response: any) =>
                              response.questionId === question.id &&
                              response.selectedOption.id === option.id
                          );

                          return (
                            <li
                              key={option.id}
                              className={`py-2 px-4 my-2 rounded-md ${
                                isCorrect
                                  ? "bg-green-500 text-white" // Correct option - Green
                                  : isSelected
                                  ? "bg-red-500 text-white" // Incorrectly selected option - Red
                                  : "bg-gray-200" // Neutral
                              }`}
                            >
                              {option.text}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </>
            )
          ) : (
            <p>Select a quiz to view its details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

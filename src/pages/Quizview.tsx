import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Primarybutton } from "../components/buttons/Primarybutton";
import { Inputbox } from "../components/Inputbox";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../../config";

export const Quizview = () => {
  const token = localStorage.getItem("token");
  const [questionText, setQuestionText] = useState("");
  const [allquestion, setAllquestion] = useState<any>([]);
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  ); // State for selected question

  const { quizId } = useParams();

  const handleDelete = async (questionId: number) => {
    if (!quizId) {
      alert("Quiz ID is required!");
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/quiz/${quizId}/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAllQuestions();
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete the question. Please try again.");
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllquestion(response.data.question);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = async () => {
    if (!quizId || !correctOptionId) {
      alert("Please fill all fields correctly.");
      return;
    }
    setIsSubmitting(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/quiz/${quizId}`,
        {
          text: questionText,
          options,
          correctOptionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Question added successfully!");
      resetForm();
      fetchAllQuestions();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add the question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!quizId || !selectedQuestionId || !correctOptionId) {
      alert("Please fill all fields correctly.");
      return;
    }
    setIsSubmitting(true);

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/quiz/${quizId}/${selectedQuestionId}`,
        {
          text: questionText,
          options,
          correctOptionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Question updated successfully!");
      resetForm();
      fetchAllQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update the question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setOptions([
      { id: 1, text: "" },
      { id: 2, text: "" },
    ]);
    setCorrectOptionId(null);
    setSelectedQuestionId(null);
  };

  useEffect(() => {
    if (quizId) {
      fetchAllQuestions(); // Fetch all questions when the component is mounted
    }
  }, [quizId]);

  const handleOptionChange = (id: number, text: string) => {
    setOptions((prev) =>
      prev.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const addOption = () => {
    const newOptionId = options.length + 1;
    setOptions([...options, { id: newOptionId, text: "" }]);
  };

  const handleSelectQuestion = (question: any) => {
    setSelectedQuestionId(question.id);
    setQuestionText(question.text);
    setOptions(
      question.options.map((option: any) => ({
        id: option.id,
        text: option.text,
      }))
    );
    setCorrectOptionId(question.correctOptionId);
  };

  return (
    <div>
      <Appbar token={token} />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              {selectedQuestionId ? "Edit Question" : "Create a New Question"}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
              <Inputbox
                lable="* Question"
                placeholder="Enter your question here"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Options</h3>
                {options.map((option) => (
                  <div key={option.id} className="flex items-center gap-4 mb-4">
                    <Inputbox
                      lable={`Option ${option.id}`}
                      placeholder={`Option ${option.id}`}
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                    />
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionId === option.id}
                      onChange={() => setCorrectOptionId(option.id)}
                      className="h-5 w-5"
                    />
                    <label className="text-sm">Select as correct</label>
                  </div>
                ))}
                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={addOption}
                >
                  Add Option
                </button>
              </div>
              <Primarybutton
                lable={
                  isSubmitting
                    ? "Submitting..."
                    : selectedQuestionId
                    ? "Update Question"
                    : "Submit Question"
                }
                type="big"
                onClick={selectedQuestionId ? handleUpdate : handleSubmit}
              />
              {selectedQuestionId && (
                <button
                  className="mt-4 w-full px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  onClick={resetForm}
                >
                  Reset and Create New Question
                </button>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <h2 className="text-2xl font-semibold mb-4">All Questions</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              {allquestion.map((question: any) => (
                <div
                  key={question.id}
                  className="border-b pb-4 mb-4"
                  onClick={() => handleSelectQuestion(question)}
                >
                  <h3 className="font-medium text-lg">{question.text}</h3>
                  {question.options.map((option: any) => (
                    <div key={option.id} className="text-sm text-gray-700">
                      {option.text}
                    </div>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(question.id);
                    }}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

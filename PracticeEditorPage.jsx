import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPractice = () => {
  // States for Category
  const [category, setCategory] = useState({
    key_name: "",
    label: "",
    description: "",
    color_gradient: "from-blue-500 to-cyan-500",
    count: 0
  });

  // States for Scenario
  const [scenario, setScenario] = useState({
    title: "",
    category: "",
    difficulty: "Easy",
    time_estimate: "",
    description: "",
    tags: "",
    is_featured: false,
    is_active: true,
    questions_count: 0,
    points: 0,
    completion_rate: 0,
    likes: 0,
    views: 0
  });

  // States for Question
  const [question, setQuestion] = useState({
    scenario_id: "",
    question_text: "",
    question_type: "multiple-choice",
    difficulty: "Easy",
    points: 0,
    time_limit: 0,
    options: "",
    correct_answer: "",
    explanation: "",
    code_template: "",
    code_snippet: "",
    scenario_context: "",
    expected_output: "",
    order_index: 0,
    is_active: true
  });

  const [categories, setCategories] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [activeTab, setActiveTab] = useState("category");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories and scenarios for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, scenariosRes] = await Promise.all([
          axios.get("http://localhost:5000/api/practice-categories"),
          axios.get("http://localhost:5000/api/practice-scenarios")
        ]);
        setCategories(categoriesRes.data);
        setScenarios(scenariosRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    try {
      await axios.post("http://localhost:5000/api/categories", category);
      setSuccessMessage("Category added successfully!");
      setCategory({
        key_name: "",
        label: "",
        description: "",
        color_gradient: "from-blue-500 to-cyan-500",
        count: 0
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddScenario = async () => {
    try {
      await axios.post("http://localhost:5000/api/scenarios", {
        ...scenario,
        tags: scenario.tags.split(",").map((tag) => tag.trim()),
      });
      setSuccessMessage("Scenario added successfully!");
      setScenario({
        title: "",
        category: "",
        difficulty: "Easy",
        time_estimate: "",
        description: "",
        tags: "",
        is_featured: false,
        is_active: true,
        questions_count: 0,
        points: 0,
        completion_rate: 0,
        likes: 0,
        views: 0
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding scenario:", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      await axios.post("http://localhost:5000/api/questions", {
        ...question,
        options: question.question_type === "multiple-choice"
          ? question.options.split(",").map((opt) => opt.trim())
          : null,
      });
      setSuccessMessage("Question added successfully!");
      setQuestion({
        scenario_id: "",
        question_text: "",
        question_type: "multiple-choice",
        difficulty: "Easy",
        points: 0,
        time_limit: 0,
        options: "",
        correct_answer: "",
        explanation: "",
        code_template: "",
        code_snippet: "",
        scenario_context: "",
        expected_output: "",
        order_index: 0,
        is_active: true
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const renderCategoryForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Practice Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Key Name (unique identifier)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., python-basics"
            value={category.key_name}
            onChange={(e) => setCategory({ ...category, key_name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Display Label</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., Python Basics"
            value={category.label}
            onChange={(e) => setCategory({ ...category, label: e.target.value })}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Describe this category..."
          rows="3"
          value={category.description}
          onChange={(e) => setCategory({ ...category, description: e.target.value })}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Color Gradient (Tailwind classes)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="from-blue-500 to-cyan-500"
            value={category.color_gradient}
            onChange={(e) => setCategory({ ...category, color_gradient: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Initial Count</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={category.count}
            onChange={(e) => setCategory({ ...category, count: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <button
        onClick={handleAddCategory}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Category
      </button>
    </div>
  );

  const renderScenarioForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Practice Scenario</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Scenario title"
          value={scenario.title}
          onChange={(e) => setScenario({ ...scenario, title: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
  <label className="block text-gray-700 mb-2">Category</label>
  <input
    type="text"
    className="w-full p-2 border border-gray-300 rounded"
    placeholder="Enter category"
    value={scenario.category}
    onChange={(e) => setScenario({ ...scenario, category: e.target.value })}
  />

          <label className="block text-gray-700 mb-2">Difficulty</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={scenario.difficulty}
            onChange={(e) => setScenario({ ...scenario, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Time Estimate</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., 30 mins"
            value={scenario.time_estimate}
            onChange={(e) => setScenario({ ...scenario, time_estimate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Initial Questions Count</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={scenario.questions_count}
            onChange={(e) => setScenario({ ...scenario, questions_count: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Total Points</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={scenario.points}
            onChange={(e) => setScenario({ ...scenario, points: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Completion Rate (%)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
            max="100"
            step="0.01"
            value={scenario.completion_rate}
            onChange={(e) => setScenario({ ...scenario, completion_rate: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Likes</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={scenario.likes}
            onChange={(e) => setScenario({ ...scenario, likes: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Views</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={scenario.views}
            onChange={(e) => setScenario({ ...scenario, views: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Describe this scenario..."
          rows="4"
          value={scenario.description}
          onChange={(e) => setScenario({ ...scenario, description: e.target.value })}
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="e.g., python, basics, variables"
          value={scenario.tags}
          onChange={(e) => setScenario({ ...scenario, tags: e.target.value })}
        />
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={scenario.is_featured}
            onChange={(e) => setScenario({ ...scenario, is_featured: e.target.checked })}
          />
          <span className="ml-2 text-gray-700">Featured Scenario</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={scenario.is_active}
            onChange={(e) => setScenario({ ...scenario, is_active: e.target.checked })}
          />
          <span className="ml-2 text-gray-700">Active</span>
        </label>
      </div>
      
      <button
        onClick={handleAddScenario}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Scenario
      </button>
    </div>
  );

  const renderQuestionForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Practice Question</h2>
      
      <div className="mb-4">
  <label className="block text-gray-700 mb-2">Scenario ID</label>
  <input
    list="scenario-options"
    type="number"
    className="w-full p-2 border border-gray-300 rounded"
    placeholder="Enter or select a scenario ID"
    value={question.scenario_id}
    onChange={(e) =>
      setQuestion({
        ...question,
        scenario_id: parseInt(e.target.value) || "",
      })
    }
  />
  <datalist id="scenario-options">
    {scenarios.map((s) => (
      <option key={s.id} value={s.id}>
        {s.title}
      </option>
    ))}
  </datalist>
</div>

      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Question Text</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter the question..."
          rows="3"
          value={question.question_text}
          onChange={(e) => setQuestion({ ...question, question_text: e.target.value })}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Question Type</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={question.question_type}
            onChange={(e) => setQuestion({ ...question, question_type: e.target.value })}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="coding">Coding</option>
            <option value="scenario">Scenario</option>
            <option value="practical">Practical</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Difficulty</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={question.difficulty}
            onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Points</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={question.points}
            onChange={(e) => setQuestion({ ...question, points: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Time Limit (minutes)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={question.time_limit}
            onChange={(e) => setQuestion({ ...question, time_limit: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      {question.question_type === "multiple-choice" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Options (comma separated)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Option 1, Option 2, Option 3, Option 4"
            value={question.options}
            onChange={(e) => setQuestion({ ...question, options: e.target.value })}
          />
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Correct Answer</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter correct answer"
          value={question.correct_answer}
          onChange={(e) => setQuestion({ ...question, correct_answer: e.target.value })}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Explanation</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Explain why this is the correct answer..."
          rows="3"
          value={question.explanation}
          onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
        ></textarea>
      </div>
      
      {(question.question_type === "coding" || question.question_type === "practical") && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Code Template</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded font-mono"
              placeholder="Enter initial code template..."
              rows="5"
              value={question.code_template}
              onChange={(e) => setQuestion({ ...question, code_template: e.target.value })}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Expected Output</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded font-mono"
              placeholder="What should the code output?"
              rows="3"
              value={question.expected_output}
              onChange={(e) => setQuestion({ ...question, expected_output: e.target.value })}
            ></textarea>
          </div>
        </>
      )}
      
      {question.question_type === "practical" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Code Snippet</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded font-mono"
            placeholder="Enter code snippet for practical question..."
            rows="5"
            value={question.code_snippet}
            onChange={(e) => setQuestion({ ...question, code_snippet: e.target.value })}
          ></textarea>
        </div>
      )}
      
      {question.question_type === "scenario" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Scenario Context</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Provide additional context for scenario questions..."
            rows="4"
            value={question.scenario_context}
            onChange={(e) => setQuestion({ ...question, scenario_context: e.target.value })}
          ></textarea>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Order Index</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={question.order_index}
            onChange={(e) => setQuestion({ ...question, order_index: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={question.is_active}
              onChange={(e) => setQuestion({ ...question, is_active: e.target.checked })}
            />
            <span className="ml-2 text-gray-700">Active Question</span>
          </label>
        </div>
      </div>
      
      <button
        onClick={handleAddQuestion}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Question
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Practice Content Management</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "category" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("category")}
        >
          Add Category
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "scenario" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("scenario")}
        >
          Add Scenario
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "question" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("question")}
        >
          Add Question
        </button>
      </div>
      
      {activeTab === "category" && renderCategoryForm()}
      {activeTab === "scenario" && renderScenarioForm()}
      {activeTab === "question" && renderQuestionForm()}
    </div>
  );
};

export default AddPractice;
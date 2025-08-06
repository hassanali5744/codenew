import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PracticeAdmin() {
  const [search, setSearch] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/practice/scenarios"); // ✅ Correct endpoint
      const data = await res.json();
      if (data.success) {
        setScenarios(data.data); // ✅ Use `data.data` from backend response
      } else {
        console.error("Failed to fetch scenarios:", data.message);
      }
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    }
  };

  const handleAdd = () => {
    navigate("/admin/practice/new");
  };

  const handleEdit = (scenario) => {
    navigate(`/admin/practice/edit/${scenario.id}`, { state: { scenario } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scenario?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/practice/scenarios/${id}`, {
          method: "DELETE",
        });
  
        const result = await res.json();
        if (result.success) {
          fetchScenarios(); // Refresh the list after successful deletion
        } else {
          console.error("Failed to delete scenario:", result.message);
          alert("Failed to delete scenario.");
        }
      } catch (error) {
        console.error("Error deleting scenario:", error);
        alert("An error occurred while deleting the scenario.");
      }
    }
  };
  

  const filtered = scenarios.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Practice Sets</h2>
          <p className="text-gray-500">Manage MCQ practice sets for your users.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          onClick={handleAdd}
        >
          <FaPlus /> Add Practice
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search practice sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-left">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Difficulty</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scenario) => (
              <tr key={scenario.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium text-blue-800">{scenario.title}</td>
                <td className="p-4">{scenario.category}</td>
                <td className="p-4">{scenario.difficulty}</td>
                <td className="p-4 flex gap-3 justify-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit"
                    onClick={() => handleEdit(scenario)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete"
                    onClick={() => handleDelete(scenario.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No practice sets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

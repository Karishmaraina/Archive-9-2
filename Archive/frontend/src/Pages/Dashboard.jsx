import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/dashboard/Sidebar";
import axios from "axios";

const mockNestedData = {
  HR: [
    {
      name: "Employee Management",
      children: [
        {
          name: "Add Employee",
          children: [
            { name: "Basic Info" },
            { name: "Document Upload" }         
          ]
        },
        { name: "Employee List" }
      ]
    },
    {
      name: "Payroll",
      children: [
        { name: "Salary Structure" },
        { name: "Deductions" }
      ]
    }
  ]
};

const Dashboard = () => {
  const [modulesData, setModulesData] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSubmodules, setSelectedSubmodules] = useState(new Set());
  const navigate = useNavigate();
  //const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/get-modules");
        setModulesData(res.data.selectedModules); // Use data from backend
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  const handleCheckboxChange = (submodule) => {
    setSelectedSubmodules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(submodule)) {
        newSet.delete(submodule);
      } else {
        newSet.add(submodule);
      }
      return newSet;
    });
  };

  const savePreferences = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/save-modules", {
        selectedModules: Array.from(selectedSubmodules)
      });
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const renderSubmodules = (submodules, level = 0) => {
    return (
      <div className={`ml-${level * 4} border-l-2 border-gray-300 pl-4 space-y-2`}> 
        {submodules?.map((submodule, index) => (
          <div key={`${level}-${index}`} className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSubmodules.has(submodule.name)}
                onChange={() => handleCheckboxChange(submodule.name)}
                className="w-4 h-4"
              />
              <span className="text-lg font-medium">{submodule.name}</span>
            </label>
            {submodule.children && renderSubmodules(submodule.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar selectedModule={selectedModule} setSelectedModule={setSelectedModule} />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {selectedModule ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{selectedModule} Module</h2>
            {modulesData[selectedModule] ? (
              <div>
                {renderSubmodules(modulesData[selectedModule])}
                <button
                  onClick={savePreferences}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            ) : (
              <p className="text-gray-600">No sub-modules available.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Please select a module from the sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
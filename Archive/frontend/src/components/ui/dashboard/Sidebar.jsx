import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedModule, setSelectedModule }) => {
  const navigate = useNavigate();
  const [modules] = useState([
    { name: "HR", icon: "👥" },
    { name: "Finance", icon: "💰" },
    { name: "Inventory", icon: "📦" },
    { name: "ChatBox", icon: "💬" },
  ]);

  const handleModuleClick = (module) => {
    setSelectedModule(module.name);
    if (module.name === "ChatBox") {
      navigate("/chatbox2");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      {modules.map((module) => (
        <div
          key={module.name}
          className={`flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer ${
            selectedModule === module.name ? "bg-gray-700" : ""
          }`}
          onClick={() => handleModuleClick(module)}
        >
          <span>{module.icon}</span>
          <span>{module.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

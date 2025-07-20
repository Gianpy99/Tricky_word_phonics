import React from "react";

const TestApp: React.FC = () => {
  console.log("TestApp is rendering");

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Menu</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestApp;

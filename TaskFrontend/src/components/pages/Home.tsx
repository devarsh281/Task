import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Add from "./Add";
import Display from "./Display";
import { useState } from "react";

const queryClient = new QueryClient();

export default function Home() {
  const [showAdd, setShowAdd] = useState(true);

  return (
    <div className="bg-green-500">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Task Manager
            </h1>
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  showAdd ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => setShowAdd(true)}
              >
                Add Task
              </button>
              <button
                className={`ml-2 px-4 py-2 rounded-md font-medium ${
                  !showAdd ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => setShowAdd(false)}
              >
                View Tasks
              </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              {showAdd ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Add New Task
                  </h2>
                  <Add />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Task List
                  </h2>
                  <Display />
                </>
              )}
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
}

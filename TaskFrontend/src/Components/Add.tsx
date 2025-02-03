import type React from "react";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {  CheckCircle, AlertCircle, CircleX, CircleCheck } from "lucide-react";

interface Task {
  title: string;
  description: string;
  category: string;
}

const createTask = async (task: Task) => {
  const response = await fetch("http://localhost:8085/trpc/task.createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response.json();
};

const Add: React.FC = () => {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    category: "",
  });

  const { mutate, isError, error, isSuccess } = useMutation({
    mutationFn: createTask,
    onSuccess: (data: Task[]) => {
      console.log("Task created successfully:", data);
    },
    onError: (error: Error) => {
      console.error("Error creating task:", error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!task.title || !task.description || !task.category) {
      // alert("Please fill out all fields.");
      return;
    }
    mutate(task);
  };

  const handleReset = () => {
    setTask({ title: "", description: "", category: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gray-800 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Task</h2>
          {/* <PlusCircle className="w-6 h-6" /> */}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Name
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={task.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter task name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={task.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              value={task.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            >
              <option value="">Select Category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex-1 !bg-emerald-600 !text-white py-2 px-2 rounded-md hover:!bg-emerald-800 transition-colors duration-300 flex items-center justify-center"
            >
              <CircleCheck className="w-5 h-5 mr-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              type="button"
              className="flex-1 !bg-red-500  !text-white py-2 px-2 rounded-md hover:!bg-red-800 transition-colors duration-300 flex items-center justify-center"
            >
              <CircleX className="w-5 h-5 mr-2" />
            </motion.button>
          </div>
        </form>

        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <p>Task created successfully!</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Add;

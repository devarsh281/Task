import React, { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";

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

  const { mutate, isError, error } = useMutation({
    mutationFn: createTask,
    onSuccess: (data: Task[]) => {
      console.log("Task created successfully:", data);
    },
    onError: (error: []) => {
      console.error("Error creating task:", error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.category) {
      alert("Please fill out all fields.");
      return;
    }

    mutate(task);
  };

  const handleCancel = () => {
    setTask({
      title: "",
      description: "",
      category: "",
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-blue-800">Add Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-red-700 mb-1"
          >
            Task Name
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={task.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border text-green-800 bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter task name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-red-700 mb-1 "
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={task.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-white text-green-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border bg-white text-green-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="flex flex-col space-y-3 w-full">
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black/70 hover:bg-black/70 rounded-md transition-colors !bg-black/70 !hover:bg-black/70"
          >
            Submit
          </button>
          <button
            onClick={handleCancel}
            type="button"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black/70 hover:bg-black/70 rounded-md transition-colors !bg-black/70 !hover:bg-black/70"
          >
            Reset
          </button>
        </div>
      </form>

      {isError && (
        <div className="mt-4 text-red-500">
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}
    </div>
  );
};

export default Add;

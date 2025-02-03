import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
}

const fetchTasks = async (): Promise<any> => {
  const response = await fetch("http://localhost:8085/trpc/task.getAllTasks", {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export default function Display() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const getTasks = async () => {
      const tasksData = await fetchTasks();
      setTasks(tasksData?.result?.data);
    };
    getTasks();
  }, []);

  const columnHelper = createColumnHelper<Task>();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("title", {
      header: "Title",
    }),
    columnHelper.accessor("description", {
      header: "Description",
    }),
    columnHelper.accessor("category", {
      header: "Category",
    }),
    columnHelper.accessor("Actions", {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original.id)}
            className="!text-blue-500 hover:!text-blue-700 !bg-green-100 hover:!bg-green-300"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-500 hover:text-red-700 !bg-red-100 hover:!bg-red-400"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (id: number) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setNewTitle(taskToEdit.title);
      setNewDescription(taskToEdit.description);
      setNewCategory(taskToEdit.category);
    }
  };

  const handleEditSubmit = async (updatedTask: Task): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:8085/trpc/task.updateTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: updatedTask.id, task: updatedTask }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Task Updated Sucessfully", data);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:8085/trpc/task.deleteTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Task deleted:", data);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Tasks</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 bg-gray-100 font-medium text-gray-600 border-b"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTask && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">
              Edit Task
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedTask = {
                  id: editingTask.id,
                  title: newTitle,
                  description: newDescription,
                  category: newCategory,
                };
                handleEditSubmit(updatedTask);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-red-700 mb-1"
                >
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border text-green-800 bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
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
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-green-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter task description"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-red-700 mb-1 "
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-green-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <button
                    type="submit"
                    className="  !bg-black/70 text-white rounded hover:!bg-black"
                  >
                    Save
                  </button>
                </div>
                <div className="w-1/2">
                  <button
                    onClick={() => setEditingTask(null)}
                    className="  !bg-black/70 text-white/100 rounded hover:!bg-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

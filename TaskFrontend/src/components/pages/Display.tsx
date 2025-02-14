import { useState } from "react";

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { trpc } from "../../utils/trpc";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
}

export default function Display() {
  const { data, refetch } = trpc.task.getAllTasks.useQuery();
  const tasks: Task[] = (data as Task[]) || [];
  const updateTaskMutation = trpc.task.updateTask.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteTaskMutation = trpc.task.deleteTask.useMutation({
    onSuccess: () => refetch(),
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const columnHelper = createColumnHelper<Task>();
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("title", { header: "Title" }),
    columnHelper.accessor("description", { header: "Description" }),
    columnHelper.accessor("category", { header: "Category" }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
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

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewCategory(task.category);
  };

  const handleEditSubmit = () => {
    if (!editingTask) return;
  
    updateTaskMutation.mutate({
      id: editingTask.id,
      title: newTitle,
      description: newDescription,
      category: newCategory,
    });
  
    setEditingTask(null);
  };
  
  const handleDelete = (id: number) => {
    deleteTaskMutation.mutate({ id });
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
                handleEditSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-red-700 mb-1">
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
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-green-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Category
                </label>
                <select
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
                <button
                  type="submit"
                  className="!bg-black/70 text-white rounded hover:!bg-black"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="!bg-black/70 text-white rounded hover:!bg-black"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

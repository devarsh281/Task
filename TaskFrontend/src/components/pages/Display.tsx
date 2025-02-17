import { useState } from "react";
import { motion } from "framer-motion";
import { CircleX, CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";
import { getQueryKey } from "@trpc/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
}

const categories = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "urgent", label: "Urgent" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

export default function Display() {
  const queryClient = useQueryClient();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { data } = trpc.task.getAllTasks.useQuery<Task[]>();
  const tasks: Task[] = data || [];

  const updateTaskMutation = trpc.task.updateTask.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(getQueryKey(trpc.task.getAllTasks));
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = trpc.task.deleteTask.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(getQueryKey(trpc.task.getAllTasks));
    },
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
            className="text-emerald-500 hover:text-white bg-gray-200 px-6 py-2 rounded-lg hover:bg-emerald-500 font-bold"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-500 hover:text-white bg-gray-200 px-6 py-2 rounded-lg hover:bg-red-500 font-bold"
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
    if (!newTitle || !newDescription || !newCategory) {
      setIsAlertVisible(true);
      return;
    }
    if (!editingTask) return;

    updateTaskMutation.mutate({
      id: editingTask.id,
      title: newTitle,
      description: newDescription,
      category: newCategory,
    });
  };

  const handleDelete = (id: number) => {
    deleteTaskMutation.mutate({ id });
  };

  const handleChange = (name: keyof Task, value: string) => {
    if (name === "title") setNewTitle(value);
    else if (name === "description") setNewDescription(value);
    else if (name === "category") setNewCategory(value);
  
    if (newTitle.trim() || newDescription.trim() || newCategory.trim()) {
      setIsAlertVisible(false);
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
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No tasks added.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingTask && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">
              Edit Task
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-red-600"
                >
                  Task Name
                </label>
                <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}>
                  <Input
                    type="text"
                    id="title"
                    value={newTitle}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter task name"
                    className={`transition-all duration-300 ${
                      newTitle ? "" : "animate-shake"
                    }`}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-red-600"
                >
                  Description
                </label>
                <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Enter task description"
                    className={`transition-all duration-300 ${
                      newDescription ? "" : "animate-shake"
                    }`}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-red-600"
                >
                  Category
                </label>
                <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}>
                  <Select
                    value={newCategory}
                    onValueChange={(value: string) =>
                      handleChange("category", value)
                    }
                    className="transition-all duration-300"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-md">
                      {categories.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                          className="hover:bg-gray-200"
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                className="flex space-x-2 mt-2"
              >
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <CircleCheck className="w-5 h-5 mr-2" />
                  <span>Edit</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  <CircleX className="w-5 h-5 mr-2" />
                  <span>Reset</span>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex space-x-2 text-red-500 mt-3"
              >
                {isAlertVisible && (
                  <Alert variant="destructive" className=" border-red-500">
                    <CircleX></CircleX>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Please fill all fields.</AlertDescription>
                  </Alert>
                )}
              </motion.div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

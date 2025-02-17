import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CircleX, CircleCheck, Loader2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "../../utils/trpc";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Task {
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

export default function AddTaskForm() {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { toast } = useToast();

  const createTask = trpc.task.createTask.useMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.category) {
      setIsAlertVisible(true);
      return;
    }
    setIsLoading(true);
    try {
      await createTask.mutateAsync(task);
      toast({
        title: "Success",
        description: "Task created successfully!",
        variant: "success",
      });
      setTask({ title: "", description: "", category: "" });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () =>
    setTask({ title: "", description: "", category: "" });

  const handleChange = (name: keyof Task, value: string) => {
    setTask((prevTask) => {
      const updatedTask = { ...prevTask, [name]: value };

      if (
        updatedTask.title &&
        updatedTask.description &&
        updatedTask.category
      ) {
        setIsAlertVisible(false);
      }

      return updatedTask;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-400">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold">Create New Task</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-red-600">
              Task Name
            </label>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Input
                type="text"
                id="title"
                value={task.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task name"
                disabled={isLoading}
                className={`transition-all duration-300 ${
                  task.title ? "" : "animate-shake"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Textarea
                id="description"
                value={task.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter task description"
                disabled={isLoading}
                className={`transition-all duration-300 ${
                  task.description ? "" : "animate-shake"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Select
                value={task.category}
                onValueChange={(value: string) =>
                  handleChange("category", value)
                }
                disabled={isLoading}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex space-x-2"
          >
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <CircleCheck className="w-5 h-5 mr-2" />
              )}
              <span>{isLoading ? "Creating..." : "Create"}</span>
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
              disabled={isLoading}
            >
              <CircleX className="w-5 h-5 mr-2" />
              <span>Reset</span>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex space-x-2 text-red-500"
          >
            {isAlertVisible && (
              <Alert
                variant="destructive"
                className=" border-red-500"
                // onClose={() => setIsAlertVisible(false)}
              >
                <CircleX></CircleX>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Please fill all fields.</AlertDescription>
              </Alert>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

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
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!task.title || !task.description || !task.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Task created successfully:", task);
      setTask({ title: "", description: "", category: "" });
      toast({
        title: "Success",
        description: "Task created successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTask({ title: "", description: "", category: "" });
  };

  const handleChange = (name: keyof Task, value: string) => {
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold">Create New Task</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-red-700">
              Task Name
            </label>
            <Input
              type="text"
              id="title"
              value={task.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter task description"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <Select
              value={task.category}
              onValueChange={(value) => handleChange("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
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
          </div>
        </form>
      </motion.div>
    </div>
  );
}

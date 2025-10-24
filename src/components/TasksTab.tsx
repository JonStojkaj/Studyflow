import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Plus, X } from "lucide-react";
import type { Task } from "../App";

interface TasksTabProps {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
}

export function TasksTab({ tasks, addTask, toggleTask, removeTask }: TasksTabProps) {
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText("");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4">My Tasks</h2>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <Button onClick={handleAddTask} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                selectedTaskId === task.id
                  ? "bg-purple-50 border-purple-200"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTaskId(task.id)}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {selectedTaskId && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm text-center">
            Selected task will be tracked during your next study session
          </div>
        )}
      </Card>
    </div>
  );
}

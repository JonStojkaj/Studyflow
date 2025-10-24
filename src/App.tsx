import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Home, BarChart3, Users, CheckSquare, Settings } from "lucide-react";
import { HomeTab } from "./components/HomeTab";
import { StatsTab } from "./components/StatsTab";
import { SocialTab } from "./components/SocialTab";
import { TasksTab } from "./components/TasksTab";
import { SettingsTab } from "./components/SettingsTab";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  taskIds: string[];
  completedBy: string[];
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Complete Math Assignment", completed: false },
    { id: "2", text: "Study Biology Chapter 5", completed: true },
    { id: "3", text: "Read History Textbook", completed: false },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Study 100 hours this month",
      description: "Team goal for January",
      target: "100 hours",
      taskIds: ["1", "2"],
      completedBy: ["Sarah Miller", "You", "Alex Chen"],
    },
    {
      id: "2",
      title: "Maintain 30-day streak",
      description: "Group challenge",
      target: "30 days",
      taskIds: ["3"],
      completedBy: ["Sarah Miller"],
    },
  ]);

  const addTask = (text: string) => {
    setTasks([
      ...tasks,
      { id: Date.now().toString(), text, completed: false },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id: string) => {
    // Remove task from tasks list
    setTasks(tasks.filter((task) => task.id !== id));
    
    // Remove task from all goals that contain it
    setGoals(
      goals.map((goal) => ({
        ...goal,
        taskIds: goal.taskIds.filter((taskId) => taskId !== id),
      }))
    );
  };

  const addGoal = (title: string, description: string, target: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      target,
      taskIds: [],
      completedBy: ["You"],
    };
    setGoals([newGoal, ...goals]);
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  };

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  const addTasksToGoal = (goalId: string, taskIds: string[]) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, taskIds: [...new Set([...goal.taskIds, ...taskIds])] }
          : goal
      )
    );
  };

  const removeTaskFromGoal = (goalId: string, taskId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, taskIds: goal.taskIds.filter((id) => id !== taskId) }
          : goal
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-20">
      <div className="container max-w-4xl mx-auto p-4">
        <header className="text-center py-6">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            StudyFlow
          </h1>
        </header>

        <Tabs defaultValue="home" className="w-full">
          <TabsContent value="home" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <HomeTab />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <TasksTab 
              tasks={tasks}
              addTask={addTask}
              toggleTask={toggleTask}
              removeTask={removeTask}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <StatsTab />
          </TabsContent>

          <TabsContent value="social" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <SocialTab 
              tasks={tasks}
              toggleTask={toggleTask}
              goals={goals}
              addGoal={addGoal}
              updateGoal={updateGoal}
              removeGoal={removeGoal}
              addTasksToGoal={addTasksToGoal}
              removeTaskFromGoal={removeTaskFromGoal}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <SettingsTab />
          </TabsContent>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-0 left-0 right-0 grid w-full grid-cols-5 h-16 rounded-none border-t bg-background">
            <TabsTrigger value="home" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-100">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-100">
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-100">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-100">
              <Users className="w-5 h-5" />
              <span className="text-xs">Social</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-100">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  Trophy,
  Medal,
  Link2,
  UserPlus,
  ArrowLeft,
  Crown,
  Calendar,
  Users as UsersIcon,
  Plus,
  Target,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { Task, Goal } from "../App";

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  participants: number;
  isActive: boolean;
  prize?: string;
}

interface Friend {
  id: string;
  name: string;
  points: number;
  rank: number;
  initials: string;
  color: string;
}

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Sarah Miller",
    points: 2450,
    rank: 1,
    initials: "SM",
    color: "bg-purple-500",
  },
  {
    id: "2",
    name: "You",
    points: 2180,
    rank: 2,
    initials: "ME",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Alex Chen",
    points: 1950,
    rank: 3,
    initials: "AC",
    color: "bg-green-500",
  },
  {
    id: "4",
    name: "Emma Wilson",
    points: 1820,
    rank: 4,
    initials: "EW",
    color: "bg-pink-500",
  },
  {
    id: "5",
    name: "Jake Thompson",
    points: 1650,
    rank: 5,
    initials: "JT",
    color: "bg-orange-500",
  },
  {
    id: "6",
    name: "Lisa Park",
    points: 1480,
    rank: 6,
    initials: "LP",
    color: "bg-teal-500",
  },
];

interface SocialTabProps {
  tasks: Task[];
  toggleTask: (id: string) => void;
  goals: Goal[];
  addGoal: (title: string, description: string, target: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  removeGoal: (goalId: string) => void;
  addTasksToGoal: (goalId: string, taskIds: string[]) => void;
  removeTaskFromGoal: (goalId: string, taskId: string) => void;
}

export function SocialTab({ 
  tasks, 
  toggleTask,
  goals,
  addGoal,
  updateGoal,
  removeGoal,
  addTasksToGoal,
  removeTaskFromGoal,
}: SocialTabProps) {
  const [selectedSeason, setSelectedSeason] =
    useState<Season | null>(null);
  const [selectedGoal, setSelectedGoal] =
    useState<Goal | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([
    {
      id: "1",
      name: "Winter Challenge 2025",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      participants: 156,
      isActive: true,
      prize: "$100 Amazon Gift Card",
    },
    {
      id: "2",
      name: "Fall Finals Push",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      participants: 203,
      isActive: false,
      prize: "Premium Study Resources",
    },
    {
      id: "3",
      name: "Spring Study Sprint",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      participants: 89,
      isActive: false,
    },
  ]);
  const [joinedSeasons, setJoinedSeasons] = useState<string[]>([
    "1",
    "2",
  ]);
  const [inviteDialogOpen, setInviteDialogOpen] =
    useState(false);
  const [inviteLink] = useState(
    "https://studyflow.app/invite/abc123xyz",
  );
  const [isGoalsMode, setIsGoalsMode] = useState(false);

  // Season Dialog
  const [createSeasonDialogOpen, setCreateSeasonDialogOpen] =
    useState(false);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [newSeasonStartDate, setNewSeasonStartDate] =
    useState("");
  const [newSeasonEndDate, setNewSeasonEndDate] = useState("");
  const [newSeasonPrize, setNewSeasonPrize] = useState("");

  // Goal Dialog
  const [createGoalDialogOpen, setCreateGoalDialogOpen] =
    useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] =
    useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  
  // Add Tasks to Goal Dialog
  const [addTasksDialogOpen, setAddTasksDialogOpen] = useState(false);
  const [selectedTaskIdsForGoal, setSelectedTaskIdsForGoal] = useState<string[]>([]);

  const handleLeaveSeason = (seasonId: string) => {
    setJoinedSeasons(
      joinedSeasons.filter((id) => id !== seasonId),
    );
    if (selectedSeason?.id === seasonId) {
      setSelectedSeason(null);
    }
    toast.success("Left season");
  };

  const handleLeaveGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
    }
    toast.success("Left goal");
  };

  const handleCreateSeason = () => {
    if (
      !newSeasonName ||
      !newSeasonStartDate ||
      !newSeasonEndDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newSeason: Season = {
      id: Date.now().toString(),
      name: newSeasonName,
      startDate: newSeasonStartDate,
      endDate: newSeasonEndDate,
      participants: 1,
      isActive:
        new Date(newSeasonStartDate) <= new Date() &&
        new Date(newSeasonEndDate) >= new Date(),
      prize: newSeasonPrize || undefined,
    };

    setSeasons([newSeason, ...seasons]);
    setJoinedSeasons([newSeason.id, ...joinedSeasons]);

    // Reset form
    setNewSeasonName("");
    setNewSeasonStartDate("");
    setNewSeasonEndDate("");
    setNewSeasonPrize("");
    setCreateSeasonDialogOpen(false);

    toast.success("Season created successfully!");
  };

  const handleCreateGoal = () => {
    if (!newGoalTitle || !newGoalDescription || !newGoalTarget) {
      toast.error("Please fill in all required fields");
      return;
    }

    addGoal(newGoalTitle, newGoalDescription, newGoalTarget);

    // Reset form
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalTarget("");
    setCreateGoalDialogOpen(false);

    toast.success("Goal created successfully!");
  };

  const handleAddTasksToGoal = () => {
    if (selectedGoal && selectedTaskIdsForGoal.length > 0) {
      addTasksToGoal(selectedGoal.id, selectedTaskIdsForGoal);
      
      // Update selectedGoal to reflect the changes
      const updatedSelectedGoal = goals.find((g) => g.id === selectedGoal.id);
      if (updatedSelectedGoal) {
        setSelectedGoal({
          ...updatedSelectedGoal,
          taskIds: [...new Set([...updatedSelectedGoal.taskIds, ...selectedTaskIdsForGoal])],
        });
      }
      
      setSelectedTaskIdsForGoal([]);
      setAddTasksDialogOpen(false);
      toast.success("Tasks added to goal!");
    }
  };

  const handleRemoveTaskFromGoal = (goalId: string, taskId: string) => {
    removeTaskFromGoal(goalId, taskId);
    
    // Update selectedGoal to reflect the changes
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal({
        ...selectedGoal,
        taskIds: selectedGoal.taskIds.filter((id) => id !== taskId),
      });
    }
    
    toast.success("Task removed from goal");
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  const toggleMode = () => {
    setIsGoalsMode(!isGoalsMode);
  };

  // Goal Detail View
  if (selectedGoal) {
    const goalTasks = tasks.filter((t) => selectedGoal.taskIds.includes(t.id));
    const completedTasks = goalTasks.filter((t) => t.completed).length;
    const totalTasks = goalTasks.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedGoal(null)}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Button>
          <div className="space-y-6">
            <div>
              <h2 className="mb-4">{selectedGoal.title}</h2>
              <p className="text-muted-foreground mb-4">
                {selectedGoal.description}
              </p>
              
              {/* Target */}
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Target className="w-5 h-5" />
                <span>Target: {selectedGoal.target}</span>
              </div>
              
              {/* Progress Section */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Task Progress</span>
                  <span className="text-lg">
                    {completedTasks} / {totalTasks} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  {Math.round(progressPercentage)}% completed
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tasks Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Tasks</h3>
            <Dialog open={addTasksDialogOpen} onOpenChange={setAddTasksDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTaskIdsForGoal([])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tasks
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Tasks to Goal</DialogTitle>
                  <DialogDescription>
                    Select tasks from your task list to add to this goal
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-4 max-h-80 overflow-y-auto">
                  {tasks
                    .filter((task) => !selectedGoal.taskIds.includes(task.id))
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (selectedTaskIdsForGoal.includes(task.id)) {
                            setSelectedTaskIdsForGoal(
                              selectedTaskIdsForGoal.filter((id) => id !== task.id)
                            );
                          } else {
                            setSelectedTaskIdsForGoal([...selectedTaskIdsForGoal, task.id]);
                          }
                        }}
                      >
                        <Checkbox
                          checked={selectedTaskIdsForGoal.includes(task.id)}
                          onCheckedChange={() => {}}
                        />
                        <span className="flex-1">{task.text}</span>
                      </div>
                    ))}
                  {tasks.filter((task) => !selectedGoal.taskIds.includes(task.id)).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      All tasks are already added to this goal
                    </p>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setAddTasksDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTasksToGoal}>
                    Add Selected
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {goalTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks added yet. Click "Add Tasks" to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {goalTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
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
                    size="sm"
                    onClick={() => handleRemoveTaskFromGoal(selectedGoal.id, task.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Participants */}
        <Card className="p-6">
          <h3 className="mb-4">Participants</h3>
          <div className="space-y-3">
            {selectedGoal.completedBy.map((name, index) => {
              const friend = mockFriends.find(f => f.name === name) || {
                id: `temp-${index}`,
                name: name,
                points: 0,
                rank: index + 1,
                initials: name.split(' ').map(n => n[0]).join(''),
                color: "bg-gray-500"
              };
              
              return (
                <div
                  key={friend.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    friend.name === "You"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${friend.color} flex items-center justify-center text-white`}>
                    {friend.initials}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <div>{friend.name}</div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-xl text-purple-600">{friend.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Invite Friends */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Invite Friends</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Share your invite link with friends
              </p>
            </div>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Friends</DialogTitle>
                  <DialogDescription>
                    Share this link with your friends to invite them to this goal
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 mt-4">
                  <Input value={inviteLink} readOnly />
                  <Button onClick={copyInviteLink}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Leave Goal */}
        <Card className="p-6 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3>Leave Goal</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You will no longer participate in this goal
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleLeaveGoal(selectedGoal.id)}
            >
              Leave
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (selectedSeason) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedSeason(null)}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Seasons
          </Button>
          <div className="space-y-6">
            <div>
              <h2 className="mb-4">{selectedSeason.name}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(
                      selectedSeason.startDate,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(
                      selectedSeason.endDate,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <UsersIcon className="w-5 h-5" />
                  <span>
                    {selectedSeason.participants} participants
                  </span>
                </div>
                {selectedSeason.prize && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Trophy className="w-5 h-5" />
                    <span>{selectedSeason.prize}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Badge
                variant={
                  selectedSeason.isActive
                    ? "default"
                    : "secondary"
                }
                className="text-xs px-3 py-1"
              >
                {selectedSeason.isActive ? "Active" : "Ended"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="p-6">
          <h3 className="mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  friend.name === "You"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* Rank Badge */}
                <div className="flex items-center justify-center w-10">
                  {friend.rank === 1 && (
                    <Crown className="w-7 h-7 text-yellow-500" />
                  )}
                  {friend.rank === 2 && (
                    <Medal className="w-7 h-7 text-gray-400" />
                  )}
                  {friend.rank === 3 && (
                    <Medal className="w-7 h-7 text-orange-700" />
                  )}
                  {friend.rank > 3 && (
                    <span className="text-xl text-muted-foreground">
                      {friend.rank}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <div>{friend.name}</div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-xl text-purple-600">
                    {friend.points}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Invite Friends */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Invite Friends</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Share your invite link with friends
              </p>
            </div>
            <Dialog
              open={inviteDialogOpen}
              onOpenChange={setInviteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Friends</DialogTitle>
                  <DialogDescription>
                    Share this link with your friends to invite
                    them to your study group
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 mt-4">
                  <Input value={inviteLink} readOnly />
                  <Button onClick={copyInviteLink}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Leave Season */}
        <Card className="p-6 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3>Leave Season</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You will lose all progress in this season
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() =>
                handleLeaveSeason(selectedSeason.id)
              }
            >
              Leave
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <div className="flex items-center gap-3">
            {isGoalsMode ? (
              <Target className="w-8 h-8" />
            ) : (
              <Trophy className="w-8 h-8" />
            )}
            <div>
              <h2>{isGoalsMode ? "Goals" : "Seasons"}</h2>
            </div>
          </div>
        </Card>

        {/* Mode Toggle Button */}
        <div className="relative w-full h-12 bg-gray-200 rounded-full p-1">
          <div
            className="absolute top-1 bottom-1 w-1/2 bg-purple-600 rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: isGoalsMode ? "50%" : "4px",
              right: isGoalsMode ? "4px" : "50%",
            }}
          />
          <div className="relative z-10 grid grid-cols-2 h-full">
            <button
              onClick={toggleMode}
              className={`flex items-center justify-center rounded-full transition-colors ${
                !isGoalsMode ? "text-white" : "text-gray-700"
              } cursor-pointer`}
            >
              Seasons
            </button>
            <button
              onClick={toggleMode}
              className={`flex items-center justify-center rounded-full transition-colors ${
                isGoalsMode ? "text-white" : "text-gray-700"
              } cursor-pointer`}
            >
              Goals
            </button>
          </div>
        </div>

        {/* Content based on mode */}
        {!isGoalsMode ? (
          /* Seasons List */
          <div className="space-y-3">
            {seasons
              .filter((season) =>
                joinedSeasons.includes(season.id),
              )
              .map((season) => (
                <Card
                  key={season.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSeason(season)}
                >
                  <div className="space-y-3">
                    <div>
                      <h3>{season.name}</h3>
                    </div>
                    {season.prize && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>{season.prize}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-end">
                      <Badge
                        variant={
                          season.isActive
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs px-2 py-1"
                      >
                        {season.isActive ? "Active" : "Expired"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          /* Goals List */
          <div className="space-y-3">
            {goals.map((goal) => {
              const goalTasks = tasks.filter((t) => goal.taskIds.includes(t.id));
              const completedTasks = goalTasks.filter((t) => t.completed).length;
              const totalTasks = goalTasks.length;
              const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

              return (
                <Card 
                  key={goal.id} 
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedGoal(goal)}
                >
                  <div className="space-y-4">
                    <div>
                      <h3>{goal.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>{goal.target}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Task Progress
                        </span>
                        <span>
                          {completedTasks} / {totalTasks} tasks
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {goal.completedBy.length} participant
                        {goal.completedBy.length !== 1 ? "s" : ""}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {goal.completedBy.map((name, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Button
        size="icon"
        onClick={() => {
          if (isGoalsMode) {
            setCreateGoalDialogOpen(true);
          } else {
            setCreateSeasonDialogOpen(true);
          }
        }}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Season Dialog */}
      <Dialog
        open={createSeasonDialogOpen}
        onOpenChange={setCreateSeasonDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Season</DialogTitle>
            <DialogDescription>
              Set up a new study season with your friends
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="season-name">Season Name *</Label>
              <Input
                id="season-name"
                placeholder="e.g., Summer Study Challenge"
                value={newSeasonName}
                onChange={(e) =>
                  setNewSeasonName(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={newSeasonStartDate}
                onChange={(e) =>
                  setNewSeasonStartDate(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={newSeasonEndDate}
                onChange={(e) =>
                  setNewSeasonEndDate(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="season-prize">
                Prize (Optional)
              </Label>
              <Input
                id="season-prize"
                placeholder="e.g., $50 Gift Card"
                value={newSeasonPrize}
                onChange={(e) =>
                  setNewSeasonPrize(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateSeasonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateSeason}>
              Create Season
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog
        open={createGoalDialogOpen}
        onOpenChange={setCreateGoalDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set up a new study goal for your group
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title *</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Study 100 hours this month"
                value={newGoalTitle}
                onChange={(e) =>
                  setNewGoalTitle(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">
                Description *
              </Label>
              <Textarea
                id="goal-description"
                placeholder="e.g., Team goal for January"
                value={newGoalDescription}
                onChange={(e) =>
                  setNewGoalDescription(e.target.value)
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-target">
                Target *
              </Label>
              <Input
                id="goal-target"
                type="text"
                placeholder="e.g., 100 hours, 50 pages, 30 days"
                value={newGoalTarget}
                onChange={(e) =>
                  setNewGoalTarget(e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Enter your goal target (e.g., "100 hours", "50 pages", "30 days")
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateGoalDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateGoal}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
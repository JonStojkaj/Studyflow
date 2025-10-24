import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Flame, Play, Pause, Square } from "lucide-react";

export function HomeTab() {
  const [streak, setStreak] = useState(7);
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false); // Track if timer has been started (running or paused)
  const [timeLeft, setTimeLeft] = useState(studyMinutes * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(studyMinutes * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, breakMinutes, studyMinutes]);

  const handleStart = () => {
    setIsRunning(true);
    setIsStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(studyMinutes * 60);
    setIsStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentMinutes = isBreakMode ? breakMinutes : studyMinutes;
  const setCurrentMinutes = (value: number) => {
    if (isBreakMode) {
      setBreakMinutes(value);
      if (!isRunning && isBreak) setTimeLeft(value * 60);
    } else {
      setStudyMinutes(value);
      if (!isRunning && !isBreak) setTimeLeft(value * 60);
    }
  };

  const progress = isBreak
    ? ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100
    : ((studyMinutes * 60 - timeLeft) / (studyMinutes * 60)) * 100;

  const updateAngleFromEvent = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = clientX - rect.left - centerX;
    const clickY = clientY - rect.top - centerY;

    // Calculate angle from top (12 o'clock position)
    let angle = Math.atan2(clickX, -clickY) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    const minutes = Math.round((angle / 360) * 115) + 5;
    const finalMinutes = Math.max(5, Math.min(120, minutes));
    
    setCurrentMinutes(finalMinutes);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isRunning) return;
    setIsDragging(true);
    updateAngleFromEvent(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateAngleFromEvent(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const angle = ((currentMinutes - 5) / 115) * 360;

  const toggleMode = () => {
    if (!isRunning) {
      setIsBreakMode(!isBreakMode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
        <div className="flex items-center justify-center gap-3">
          <Flame className="w-8 h-8" />
          <div className="text-center">
            <div className="text-4xl">{streak}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </Card>

      {/* Timer Card */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Mode Toggle Button */}
          <div className="relative w-full h-12 bg-gray-200 rounded-full p-1">
            <div
              className="absolute top-1 bottom-1 w-1/2 bg-purple-600 rounded-full transition-all duration-300 ease-in-out"
              style={{
                left: isBreakMode ? "50%" : "4px",
                right: isBreakMode ? "4px" : "50%",
              }}
            />
            <div className="relative z-10 grid grid-cols-2 h-full">
              <button
                onClick={toggleMode}
                disabled={isRunning}
                className={`flex items-center justify-center rounded-full transition-colors ${
                  !isBreakMode ? "text-white" : "text-gray-700"
                } ${isRunning ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                Study Time
              </button>
              <button
                onClick={toggleMode}
                disabled={isRunning}
                className={`flex items-center justify-center rounded-full transition-colors ${
                  isBreakMode ? "text-white" : "text-gray-700"
                } ${isRunning ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                Break Time
              </button>
            </div>
          </div>

          {/* Circular Timer with Selector */}
          <div className="flex justify-center items-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg
                ref={svgRef}
                className="w-64 h-64 cursor-pointer select-none"
                viewBox="0 0 256 256"
                onMouseDown={handleMouseDown}
              >
                {/* Background Circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress Circle */}
                {isStarted && (
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke={isBreak ? "#10b981" : "#8b5cf6"}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 110}`}
                    strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '128px 128px' }}
                  />
                )}
                {/* Selector Circle */}
                {!isStarted && (
                  <>
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke={isBreakMode ? "#10b981" : "#8b5cf6"}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 110}`}
                      strokeDashoffset={`${2 * Math.PI * 110 * (1 - angle / 360)}`}
                      strokeLinecap="round"
                      className="transition-all duration-150"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '128px 128px' }}
                    />
                    <circle
                      cx={128 + 110 * Math.sin((angle) * (Math.PI / 180))}
                      cy={128 - 110 * Math.cos((angle) * (Math.PI / 180))}
                      r="14"
                      fill={isBreakMode ? "#10b981" : "#8b5cf6"}
                      className="cursor-grab active:cursor-grabbing"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-5xl">{isStarted ? formatTime(timeLeft) : currentMinutes}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {isStarted ? (isBreak ? "Break Time" : "Study Time") : "minutes"}
                </div>
              </div>
            </div>
          </div>

          {/* Start/Pause/Stop Buttons */}
          {!isStarted ? (
            <Button onClick={handleStart} className="w-full transition-all duration-200" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Start
            </Button>
          ) : (
            <div className="flex gap-2 transition-all duration-200">
              {!isRunning ? (
                <Button onClick={handleStart} className="flex-1 transition-all duration-200" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={handlePause} className="flex-1 transition-all duration-200" size="lg" variant="outline">
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={handleStop} className="flex-1 transition-all duration-200" size="lg" variant="destructive">
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
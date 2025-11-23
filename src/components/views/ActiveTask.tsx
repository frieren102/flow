'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
  duration: number; // in minutes
  isDaily: boolean;
  completed: boolean;
}

export default function GamifiedTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDuration, setTaskDuration] = useState(25); // default 25 mins
  const [isDaily, setIsDaily] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTaskId !== null && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (activeTaskId !== null && secondsLeft === 0) {
      // Task completed
      const task = tasks.find((t) => t.id === activeTaskId);
      if (task && !task.completed) {
        setXp((prev) => prev + 10); // award 10 XP per task
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeTaskId ? { ...t, completed: true } : t
          )
        );
      }
      setActiveTaskId(null);
    }
    return () => clearInterval(timer);
  }, [activeTaskId, secondsLeft, tasks]);

  const handleAddTask = () => {
    if (!taskName.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      duration: taskDuration,
      isDaily,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskName('');
    setTaskDuration(25);
    setIsDaily(false);
  };

  const handleStartTask = (task: Task) => {
    if (activeTaskId !== null) return; // one task at a time
    setActiveTaskId(task.id);
    setSecondsLeft(task.duration * 60);
  };

  const handleStopTask = () => {
    setActiveTaskId(null);
    setSecondsLeft(0); // no XP awarded
  };

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4">Gamified Task Manager</h2>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={1}
            value={taskDuration}
            onChange={(e) => setTaskDuration(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
          <span>minutes</span>
          <label className="flex items-center space-x-1 ml-4">
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
            />
            <span>Daily</span>
          </label>
          <button
            onClick={handleAddTask}
            className="ml-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tasks</h3>
        {tasks.length === 0 && <p className="text-gray-500">No tasks added</p>}
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-2 border rounded ${
                task.completed ? 'bg-green-100' : 'bg-gray-50'
              }`}
            >
              <div>
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-gray-500">
                  {task.duration} min {task.isDaily ? '| Daily' : ''}
                </p>
              </div>
              {activeTaskId === task.id ? (
                <button
                  onClick={handleStopTask}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Stop
                </button>
              ) : task.completed ? (
                <span className="text-green-600 font-semibold">Completed</span>
              ) : (
                <button
                  onClick={() => handleStartTask(task)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Start
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {activeTaskId !== null && (
        <div className="mb-4 text-center text-xl font-semibold">
          Timer: {formatTime(secondsLeft)}
        </div>
      )}

      <div className="text-right font-semibold">XP: {xp}</div>
    </div>
  );
}

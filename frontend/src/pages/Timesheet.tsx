import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Clock, Plus, MoreHorizontal, Play, Pause } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const Timesheet = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [timeEntries, setTimeEntries] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [taskInput, setTaskInput] = useState("");
  
  // Fetch timesheets from backend
  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/timesheets", { withCredentials: true });
        setTimeEntries(response.data);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };

    fetchTimesheets();
  }, []);

  // Add a new time entry
  const addTimeEntry = async () => {
    if (!selectedProject || !taskInput) {
      alert("Please select a project and enter a task.");
      return;
    }

    try {
      const newEntry = {
        project: selectedProject,
        task: taskInput,
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00", // Example start time
        endTime: "11:00",   // Example end time
        duration: "2h 00m",
      };

      const response = await axios.post("http://localhost:5000/api/timesheets", newEntry, { withCredentials: true });

      if (response.data) {
        setTimeEntries((prevEntries) => [...prevEntries, response.data]);
      }
    } catch (error) {
      console.error("Error adding time entry:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTracking(true);
    const id = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    setIsTracking(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Timesheet</h1>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
          <Button onClick={addTimeEntry} className="gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">New Entry</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="Dashboard">Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Input value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="What are you working on?" />
            </div>
            <div className="flex items-center gap-3">
              <div className="font-mono text-lg w-24">{formatTime(elapsedTime)}</div>
              <Button variant={isTracking ? "destructive" : "default"} size="icon" onClick={isTracking ? stopTimer : startTimer}>
                {isTracking ? <Pause size={16} /> : <Play size={16} />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.map((entry: any) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.project}</TableCell>
                  <TableCell>{entry.tasks}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.startTime}</TableCell>
                  <TableCell>{entry.endTime}</TableCell>
                  <TableCell>{entry.duration}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timesheet;

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Plus, Calendar as CalendarIcon } from "lucide-react";

const TaskCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState("week");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock events data
  const events = [
    { id: 1, title: "Team Meeting", date: new Date(), startTime: "10:00", endTime: "11:30", type: "meeting" },
    { id: 2, title: "Project Deadline", date: addDays(new Date(), 2), startTime: "09:00", endTime: "18:00", type: "deadline" },
    { id: 3, title: "Client Call", date: addDays(new Date(), 1), startTime: "14:00", endTime: "15:00", type: "call" },
    { id: 4, title: "Review Designs", date: addDays(new Date(), 3), startTime: "13:00", endTime: "14:30", type: "task" },
    { id: 5, title: "Weekly Report", date: addDays(new Date(), 4), startTime: "16:00", endTime: "17:00", type: "task" },
  ];

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(date, event.date));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-700 border-blue-300";
      case "deadline": return "bg-red-100 text-red-700 border-red-300";
      case "call": return "bg-green-100 text-green-700 border-green-300";
      case "task": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={setView} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-[240px]">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                <span className="hidden sm:inline">Add Event</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label>Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input id="start-time" type="time" defaultValue="09:00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" defaultValue="10:00" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" placeholder="Add description" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {view === "month" ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">{format(date, "MMMM yyyy")}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
                month={date}
              />
            </div>
          ) : view === "week" ? (
            <div>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium">
                  Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(prev => addDays(prev, -7))}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(prev => addDays(prev, 7))}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-7 border-b">
                {weekDays.map((day, i) => (
                  <div key={i} className="p-2 text-center border-r last:border-r-0">
                    <div className="text-sm font-medium">{format(day, "EEE")}</div>
                    <div className={`flex items-center justify-center h-8 w-8 mx-auto rounded-full ${
                      isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : ""
                    }`}>
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 min-h-[300px]">
                {weekDays.map((day, i) => (
                  <div key={i} className="p-2 border-r last:border-r-0 h-full min-h-[300px] overflow-y-auto">
                    {getEventsForDate(day).map(event => (
                      <div
                        key={event.id}
                        className={`mb-2 p-2 rounded text-sm border ${getEventColor(event.type)}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Clock size={12} className="mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium">{format(date, "EEEE, MMMM d, yyyy")}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(prev => addDays(prev, -1))}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(prev => addDays(prev, 1))}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">MORNING</h3>
                  <Separator />
                  {getEventsForDate(date)
                    .filter(e => parseInt(e.startTime.split(':')[0]) < 12)
                    .map(event => (
                      <div
                        key={event.id}
                        className={`p-3 my-2 rounded-md ${getEventColor(event.type)}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Clock size={12} className="mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">AFTERNOON</h3>
                  <Separator />
                  {getEventsForDate(date)
                    .filter(e => parseInt(e.startTime.split(':')[0]) >= 12 && parseInt(e.startTime.split(':')[0]) < 17)
                    .map(event => (
                      <div
                        key={event.id}
                        className={`p-3 my-2 rounded-md ${getEventColor(event.type)}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Clock size={12} className="mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">EVENING</h3>
                  <Separator />
                  {getEventsForDate(date)
                    .filter(e => parseInt(e.startTime.split(':')[0]) >= 17)
                    .map(event => (
                      <div
                        key={event.id}
                        className={`p-3 my-2 rounded-md ${getEventColor(event.type)}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Clock size={12} className="mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendar;

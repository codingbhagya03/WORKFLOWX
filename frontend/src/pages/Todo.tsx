import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = "http://localhost:5000/api/tasks";

interface Task {
  _id?: string;
  title: string;
  projects: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  assignedUser: string;
  createdAt?: string;
}

const users = ["Alice", "Bob", "Charlie", "David", "Eve"];

const TaskManager: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchTasks();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:5000/check-auth", { withCredentials: true });
      if (!response.data.isAuthenticated) {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };

 const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setTasks(response.data);
    } catch (error) {
      setError("Failed to fetch tasks");
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTask) {
      setIsLoading(true);
      setError(null);
      try {
        const config = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        if (currentTask._id) {
          await axios.put(`${API_URL}/${currentTask._id}`, currentTask, config);
        } else {
          await axios.post(API_URL, currentTask, config);
        }
        await fetchTasks();
        setOpen(false);
        setCurrentTask(null);
      } catch (error) {
        setError("Error saving task");
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await fetchTasks();
    } catch (error) {
      setError("Error deleting task");
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-3 max-w-7xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Task Manager</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" className="flex-1">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            onClick={() => { 
              setCurrentTask({ 
                title: "", 
                projects: "", 
                status: "Pending", 
                priority: "medium", 
                assignedUser: "",
                startDate: "",
                dueDate: "" 
              }); 
              setOpen(true); 
            }}
          >
            Add Task
          </Button>
        </div>

        {isLoading && <div className="text-center py-4">Loading tasks...</div>}
        {error && <div className="text-red-500 py-4">{error}</div>}

        {!isLoading && !error && tasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">No tasks available. Click "Add Task" to create one.</p>
        )}

        {!isLoading && !error && tasks.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.projects}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.dueDate || "N/A"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" onClick={() => { setCurrentTask(task); setOpen(true); }}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(task._id!)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentTask?._id ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                type="text" 
                value={currentTask?.title || ""} 
                onChange={e => setCurrentTask({ ...currentTask, title: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Input 
                type="text" 
                value={currentTask?.projects || ""} 
                onChange={e => setCurrentTask({ ...currentTask, projects: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={currentTask?.status || "Pending"} 
                onValueChange={value => setCurrentTask({ ...currentTask, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={currentTask?.priority || "Medium"} 
                onValueChange={value => setCurrentTask({ ...currentTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input 
                type="date" 
                value={currentTask?.dueDate || ""} 
                onChange={e => setCurrentTask({ ...currentTask, dueDate: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned User</Label>
              <Select 
                value={currentTask?.assignedUser || ""} 
                onValueChange={value => setCurrentTask({ ...currentTask, assignedUser: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : (currentTask?._id ? "Update Task" : "Add Task")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskManager;
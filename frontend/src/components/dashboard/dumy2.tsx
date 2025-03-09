import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/projects";

interface Project {
    _id?: string;
    name: string;
    description: string;
    teamMembers: string;
    startDate: string;
    endDate: string;
    status: string;
    budget: number;
}

const ProjectManager: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
        fetchProjects();
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

    const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            setProjects(response.data);
        } catch (error) {
            setError("Failed to fetch projects");
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(currentProject, "jhbjgujgjgjg")
        if (currentProject) {
            setIsLoading(true);
            setError(null);
            try {
                const config = {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                };
                if (currentProject._id) {
                    await axios.put(`${API_URL}/${currentProject._id}`, currentProject, config);
                } else {
                    await axios.post(API_URL, currentProject, config);
                }
                await fetchProjects();
                setOpen(false);
                setCurrentProject(null);
            } catch (error) {
                setError("Error saving project");
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
            await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
            await fetchProjects();
        } catch (error) {
            setError("Error deleting project");
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
                <CardTitle>Project Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={() => {
                    setCurrentProject({ name: "", description: "", teamMembers: "", startDate: "", endDate: "", status: "Not Started", budget: 0 });
                    setOpen(true);
                }}>
                    Add Project
                </Button>
                {isLoading && <div className="text-center py-4">Loading projects...</div>}
                {error && <div className="text-red-500 py-4">{error}</div>}

                <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Team Members</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">End Date</th>
                            <th className="border p-2">Budget</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project._id} className="border">
                                <td className="border p-2">{project.name}</td>
                                <td className="border p-2">{project.description}</td>
                                <td className="border p-2">{Array.isArray(project.teamMembers) ? project.teamMembers.join(", ") : project.teamMembers}</td>

                                <td className="border p-2">{project.startDate}</td>
                                <td className="border p-2">{project.endDate}</td>
                                <td className="border p-2">${project.budget}</td>
                                <td className="border p-2 space-x-2">
                                    <Button variant="outline" onClick={() => { setCurrentProject(project); setOpen(true); }}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(project._id!)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{currentProject?._id ? "Edit Project" : "New Project"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Label>Name</Label>
                        <Input type="text" value={currentProject?.name || ""} onChange={e => setCurrentProject({ ...currentProject, name: e.target.value })} required />

                        <Label>Description</Label>
                        <Input type="text" value={currentProject?.description || ""} onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })} />

                        <Label>Team Members</Label>
                        <Input type="text" value={currentProject?.teamMembers || ""} onChange={e => setCurrentProject({ ...currentProject, teamMembers: e.target.value })} />

                        <Label>Start Date</Label>
                        <Input type="date" value={currentProject?.startDate || ""} onChange={e => setCurrentProject({ ...currentProject, startDate: e.target.value })} required />

                        <Label>End Date</Label>
                        <Input type="date" value={currentProject?.endDate || ""} onChange={e => setCurrentProject({ ...currentProject, endDate: e.target.value })} required />

                        <Label>Budget</Label>
                        <Input type="number" value={currentProject?.budget || "0"} onChange={e => setCurrentProject({ ...currentProject, budget: Number(e.target.value) })} required />

                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : (currentProject?._id ? "Update Project" : "Add Project")}</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default ProjectManager;
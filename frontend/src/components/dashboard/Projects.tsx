import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = "http://localhost:5000/api/projects";

interface Project {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    budget: number;
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            setProjects(response.data);
        } catch (error) {
            setError("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-3 max-w-7xl w-full mx-auto mt-6">
            <CardHeader>
                <CardTitle>Project List</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <div className="text-center py-4">Loading projects...</div>}
                {error && <div className="text-red-500 py-4">{error}</div>}

                <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">End Date</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project._id} className="border">
                                <td className="border p-2">{project.name}</td>
                                <td className="border p-2">{project.description}</td>
                                <td className="border p-2">{project.startDate}</td>
                                <td className="border p-2">{project.endDate}</td>
                                <td className="border p-2">{project.status}</td>
                                <td className="border p-2">${project.budget}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};

export default Projects;
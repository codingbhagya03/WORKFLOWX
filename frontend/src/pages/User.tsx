import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/members";

interface Member {
    _id?: string;
    name: string;
    role: string;
    email: string;
    timeToday: number;
    timeThisWeek: number;
    // projects: string[];
}

const User: React.FC = () => {
    const navigate = useNavigate();
    const [Members, setMembers] = useState<Member[]>([]);
    const [open, setOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState<Partial<Member> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Members
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            setMembers(response.data);
        } catch (error) {
            setError("Failed to fetch members");
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentMember) {
            setIsLoading(true);
            setError(null);
            try {
                const config = {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                };
                if (currentMember._id) {
                    await axios.put(`${API_URL}/${currentMember._id}`, currentMember, config);
                } else {
                    await axios.post(API_URL, currentMember, config);
                }
                await fetchMembers();
                setOpen(false);
                setCurrentMember(null);
            } catch (error) {
                setError("Error saving member");
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
            await fetchMembers();
        } catch (error) {
            setError("Error deleting member");
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-3 max-w-7xl mx-auto mt-6">
            <div className="flex justify-between items-center">
                <CardHeader>
                    <CardTitle>User Manager</CardTitle>
                </CardHeader>
                <Button className="me-7" onClick={() => {
                    setCurrentMember({ name: "", role: "", email: "", timeToday: 0, timeThisWeek: 0 });
                    setOpen(true);
                }}>
                    Add User
                </Button>
            </div>
            <CardContent>
                {isLoading && <div className="text-center py-4">Loading Members...</div>}
                {error && <div className="text-red-500 py-4">{error}</div>}

                {!isLoading && !error && Members.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {Members.map(Member => (
                                <TableRow key={Member._id}>
                                    <TableCell>{Member.name}</TableCell>
                                    <TableCell>{Member.role}</TableCell>
                                    <TableCell>{Member.email}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" onClick={() => { setCurrentMember(Member); setOpen(true); }}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDelete(Member._id!)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* Dialog for Add/Edit Member */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{currentMember?._id ? "Edit Member" : "New Member"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={currentMember?.name || ""}
                            onChange={e => setCurrentMember({ ...currentMember, name: e.target.value })}
                            required
                        />

                        <Label>Role</Label>
                        <Input
                            type="text"
                            value={currentMember?.role || ""}
                            onChange={e => setCurrentMember({ ...currentMember, role: e.target.value })}
                            required
                        />

                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={currentMember?.email || ""}
                            onChange={e => setCurrentMember({ ...currentMember, email: e.target.value })}
                            required
                        />

                        {/* <Label>Projects</Label>
                        <Input
                            type="text"
                            value={currentMember?.projects.join(", ") || ""}
                            onChange={e => setCurrentMember({ ...currentMember, projects: e.target.value.split(", ") })}
                        /> */}

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : (currentMember?._id ? "Update Member" : "Add Member")}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default User;

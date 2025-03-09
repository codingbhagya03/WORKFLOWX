<table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Email</th>
                            {/* <th className="border p-2">Projects</th> */}
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Members.map(Member => (
                            <tr key={Member._id} className="border">
                                <td className="border p-2">{Member.name}</td>
                                <td className="border p-2">{Member.role}</td>
                                <td className="border p-2">{Member.email}</td>
                                {/* <td className="border p-2">{Member.projects.length} Projects</td> */}
                                <td className="border p-2 space-x-2">
                                    <Button variant="outline" onClick={() => { setCurrentMember(Member); setOpen(true); }}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(Member._id!)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
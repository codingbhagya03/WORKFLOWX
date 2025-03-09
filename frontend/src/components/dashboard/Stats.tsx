
import React from "react";
import { Calendar, Clock, Folder } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";

const Stats: React.FC = () => {
  const { weeklyActivity, weeklyTime, projectCount } = useTaskContext();
  
  // Format time from minutes to HH:MM:SS
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = 0; // We don't track seconds in our data
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat-card animate-fade-in [animation-delay:100ms]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Weekly Activity</h3>
          <div className="w-10 h-10 rounded-md bg-yellow-50 flex items-center justify-center">
            <Calendar size={20} className="text-yellow-500" />
          </div>
        </div>
        <p className="text-4xl font-bold">{weeklyActivity}%</p>
      </div>
      
      <div className="stat-card animate-fade-in [animation-delay:200ms]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Worked This Week</h3>
          <div className="w-10 h-10 rounded-md bg-yellow-50 flex items-center justify-center">
            <Clock size={20} className="text-yellow-500" />
          </div>
        </div>
        <p className="text-4xl font-bold">{formatTime(weeklyTime)}</p>
      </div>
      
      <div className="stat-card animate-fade-in [animation-delay:300ms]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Project Worked</h3>
          <div className="w-10 h-10 rounded-md bg-yellow-50 flex items-center justify-center">
            <Folder size={20} className="text-yellow-500" />
          </div>
        </div>
        <p className="text-4xl font-bold">{projectCount < 10 ? `0${projectCount}` : projectCount}</p>
      </div>
    </div>
  );
};

export default Stats;

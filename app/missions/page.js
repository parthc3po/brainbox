'use client';

import { useState, useEffect } from 'react';
import MissionCard from '@/components/features/MissionCard';
import NewMissionForm from '@/components/features/NewMissionForm';

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/missions');
      const data = await res.json();
      setMissions(data);
    } catch (error) {
      console.error('Failed to load missions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleMissionCreated = (newMission) => {
    setMissions([newMission, ...missions]);
  };

  const handleCompleteMission = async (id) => {
    try {
      const res = await fetch(`/api/missions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      if (res.ok) {
        // Update local state
        setMissions(missions.map(m =>
          m.id === id ? { ...m, status: 'COMPLETED', completedAt: new Date().toISOString() } : m
        ));
        // In a real app, trigger confetti or sound here
      }
    } catch (error) {
      console.error("Failed to complete mission", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Daily Tasks</h1>
        <p className="text-muted-foreground">Complete tasks to earn XP and level up!</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {missions.length > 0 ? (
            missions.map(mission => (
              <MissionCard key={mission.id} mission={mission} onUpdate={fetchMissions} />
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400">
              No active tasks. Time to relax!
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <NewMissionForm onMissionCreated={handleMissionCreated} />

          <div className="bg-muted/10 rounded-lg p-6 border border-border">
            <h4 className="font-bold text-secondary mb-4 text-xs uppercase tracking-wider">Your Stats</h4>
            <div className="space-y-4 text-sm font-medium text-gray-600">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active</span>
                <span className="text-foreground">{missions.filter(m => m.status !== 'COMPLETED').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="text-foreground">{missions.filter(m => m.status === 'COMPLETED').length}</span>
              </div>
              <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-primary h-full w-[30%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

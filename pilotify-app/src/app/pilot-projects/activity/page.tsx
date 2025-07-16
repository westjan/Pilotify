import ActivityFeed from '@/components/ActivityFeed';

export default function ActivityPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Activity</h1>
      <ActivityFeed />
    </div>
  );
}

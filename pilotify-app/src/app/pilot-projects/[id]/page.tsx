'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Role } from '@/generated/prisma';

interface PilotProject {
  id: string;
  title: string;
  description?: string;
  corporate: { id: string; name: string };
  innovator: { id: string; name: string };
  status: string;
  goals?: string;
  milestones?: any; // JSON type
  kpis?: any; // JSON type
  startDate?: string;
  endDate?: string;
  comments: Comment[];
  bookmarks: Bookmark[];
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  user: { name: string; email: string; profilePictureUrl?: string };
  createdAt: string;
  reactions: Reaction[];
}

interface Reaction {
  id: string;
  userId: string;
  user: { name: string; profilePictureUrl?: string };
  type: string; // e.g., 'like', 'heart'
}

interface Bookmark {
  id: string;
  userId: string;
  pilotProjectId?: string;
  offerId?: string;
}

export default function PilotProjectDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pilotProject, setPilotProject] = useState<PilotProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    const fetchPilotProject = async () => {
      if (status === 'loading') return;
      if (!session) {
        setError('You must be logged in to view pilot projects.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pilot-projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPilotProject(data);
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch pilot project.');
        }
      } catch (err) {
        console.error('Error fetching pilot project:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPilotProject();
  }, [id, session, status]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pilot project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pilot-projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/pilot-projects');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete pilot project.');
      }
    } catch (err) {
      console.error('Error deleting pilot project:', err);
      setError('An unexpected error occurred during deletion.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!session?.user?.id) {
      setError('You must be logged in to comment.');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotProjectId: id,
          userId: session.user.id,
          text: newCommentText,
        }),
      });

      if (response.ok) {
        setNewCommentText('');
        // Re-fetch pilot project to update comments
        const updatedProjectResponse = await fetch(`/api/pilot-projects/${id}`);
        if (updatedProjectResponse.ok) {
          const updatedProject = await updatedProjectResponse.json();
          setPilotProject(updatedProject);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add comment.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('An unexpected error occurred while adding comment.');
    }
  };

  const handleAddReaction = async (commentId: string, type: string) => {
    if (!session?.user?.id) {
      setError('You must be logged in to react.');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          type,
        }),
      });

      if (response.ok) {
        // Re-fetch pilot project to update reactions
        const updatedProjectResponse = await fetch(`/api/pilot-projects/${id}`);
        if (updatedProjectResponse.ok) {
          const updatedProject = await updatedProjectResponse.json();
          setPilotProject(updatedProject);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add reaction.');
      }
    } catch (err) {
      console.error('Error adding reaction:', err);
      setError('An unexpected error occurred while adding reaction.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pilot project...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!pilotProject) {
    return <div className="text-center py-8 text-gray-500">Pilot project not found.</div>;
  }

  const isParticipant = session?.user?.id === pilotProject.corporate.id || session?.user?.id === pilotProject.innovator.id;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{pilotProject.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{pilotProject.description || 'No description provided.'}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Corporate:</strong> {pilotProject.corporate.name}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Innovator:</strong> {pilotProject.innovator.name}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Status:</strong> {pilotProject.status}</p>

        {pilotProject.goals && <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Goals:</strong> {pilotProject.goals}</p>}
        {pilotProject.milestones && <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Milestones:</strong> {JSON.stringify(pilotProject.milestones)}</p>}
        {pilotProject.kpis && <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>KPIs:</strong> {JSON.stringify(pilotProject.kpis)}</p>}
        {pilotProject.startDate && <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Start Date:</strong> {new Date(pilotProject.startDate).toLocaleDateString()}</p>}
        {pilotProject.endDate && <p className="text-gray-700 dark:text-gray-300 mb-4"><strong>End Date:</strong> {new Date(pilotProject.endDate).toLocaleDateString()}</p>}

        {isParticipant && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => router.push(`/pilot-projects/${id}/edit`)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Project
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Project
            </button>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Comments</h2>
          <div className="space-y-4">
            {pilotProject.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {comment.user.profilePictureUrl && (
                    <img src={comment.user.profilePictureUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover mr-2" />
                  )}
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{comment.user.name || comment.user.email}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                <div className="flex items-center mt-2 space-x-4">
                  {comment.reactions.map((reaction) => (
                    <span key={reaction.id} className="text-sm text-gray-600 dark:text-gray-400">
                      {reaction.type} ({reaction.user.name})
                    </span>
                  ))}
                  {session?.user?.id && (
                    <button
                      onClick={() => handleAddReaction(comment.id, '👍')}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      👍
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {session?.user?.id && (
            <form onSubmit={handleAddComment} className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                rows={3}
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Comment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

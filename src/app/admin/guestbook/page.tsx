"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, X } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminGuestbookPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      // In a real app we'd need an admin GET route that returns all comments,
      // including unapproved. For simplicity, since this is client-side, 
      // let's assume we create one.
      const res = await fetch("/api/admin/guestbook", { cache: "no-store" });
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/guestbook/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await fetch(`/api/admin/guestbook/${id}`, {
        method: "DELETE",
      });
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Guestbook Comments</h1>
        <p className="text-sm text-stone-500">
          Manage messages left by your guests on the public site.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Message</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                  No comments yet.
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-stone-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {comment.name}
                  </td>
                  <td className="px-6 py-4 text-stone-600 max-w-md truncate">
                    {comment.message}
                  </td>
                  <td className="px-6 py-4">
                    {comment.isApproved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <Check className="size-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        Pending Review
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => toggleApproval(comment.id, comment.isApproved)}
                      className={`inline-flex items-center justify-center rounded-lg p-2 text-stone-500 hover:bg-stone-100 ${
                        comment.isApproved ? "hover:text-amber-600" : "hover:text-emerald-600"
                      }`}
                      title={comment.isApproved ? "Hide comment" : "Approve comment"}
                    >
                      {comment.isApproved ? <X className="size-4" /> : <Check className="size-4" />}
                    </button>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-stone-500 hover:bg-rose-50 hover:text-rose-600"
                      title="Delete comment"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

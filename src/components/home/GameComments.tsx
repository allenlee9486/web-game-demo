"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface Comment {
  id: number | string;
  author: string;
  avatarColor: string;
  timeAgo: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
}

interface GameCommentsProps {
  slug: string;
}

export const GameComments = ({ slug }: GameCommentsProps) => {
  // Mock data for UI (Static comments visible to everyone)
  const staticComments: Comment[] = [
    {
      id: 1,
      author: "BusStopGamer",
      avatarColor: "bg-blue-600",
      timeAgo: "1 years ago",
      rating: 4.8,
      content: "This is a solid time-killer for my commute! Easy to pick up and play a round or two. Wish there was a bit more variety in the poker modes, tho. Still, really fun!",
      likes: 12,
      dislikes: 1
    },
    {
      id: 2,
      author: "HighRollerHank",
      avatarColor: "bg-green-600",
      timeAgo: "1 years ago",
      rating: 4.9,
      content: "The leaderboard is where it's at! Been grinding to get into the top 10. The AI can be a bit predictable at times, but the thrill of going all-in is real.",
      likes: 8,
      dislikes: 0
    }
  ];

  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5.0);

  // Load local comments on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`comments_${slug}`);
      if (saved) {
        try {
          setLocalComments(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse comments", e);
        }
      }
    }
  }, [slug]);

  const handleSubmit = () => {
    if (!name.trim() || !content.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: name,
      avatarColor: `bg-${['red', 'yellow', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 5)]}-500`,
      timeAgo: "Just now",
      rating: rating,
      content: content,
      likes: 0,
      dislikes: 0
    };

    const updatedComments = [newComment, ...localComments];
    setLocalComments(updatedComments);
    localStorage.setItem(`comments_${slug}`, JSON.stringify(updatedComments));

    // Reset form
    setName("");
    setContent("");
    setRating(5.0);
  };

  const allComments = mounted ? [...localComments, ...staticComments] : staticComments;

  return (
    <div className="bg-gray-200 dark:bg-gray-800/50 p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments ({allComments.length})</h2>
      
      {/* Rating Input */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Rating:</span>
        <div className="flex text-blue-500 cursor-pointer">
           {[1, 2, 3, 4, 5].map((star) => (
             <Star 
               key={star} 
               className={`w-5 h-5 ${star <= rating ? "fill-current text-blue-500" : "text-gray-300"}`}
               onClick={() => setRating(star)}
             />
           ))}
        </div>
        <span className="text-sm text-gray-500 ml-2">{rating.toFixed(1)}</span>
      </div>

      {/* Comment Form */}
      <div className="space-y-3 mb-8">
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <textarea 
          placeholder="Write your comment..." 
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        />
        <button 
          onClick={handleSubmit}
          disabled={!name.trim() || !content.trim()}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="rotate-[-45deg] relative top-[-1px]">➤</span> Post Comment
        </button>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {allComments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
             <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${comment.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                   {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-400">{comment.timeAgo}</span>
                   </div>
                   
                   <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= Math.round(comment.rating) ? "text-blue-500 fill-blue-500" : "text-gray-300"}`} />
                      ))}
                      <span className="text-xs text-gray-500 font-medium ml-1">{comment.rating}</span>
                   </div>

                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed break-words">
                      {comment.content}
                   </p>

                   <div className="flex items-center gap-4 text-gray-400">
                      <button className="flex items-center gap-1 text-xs hover:text-blue-500">
                        <ThumbsUp className="w-3 h-3" /> {comment.likes} Like
                      </button>
                      <button className="flex items-center gap-1 text-xs hover:text-red-500">
                        <ThumbsDown className="w-3 h-3" /> {comment.dislikes} Dislike
                      </button>
                      <button className="flex items-center gap-1 text-xs hover:text-gray-600 dark:hover:text-gray-200">
                        <MessageSquare className="w-3 h-3" /> Reply
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

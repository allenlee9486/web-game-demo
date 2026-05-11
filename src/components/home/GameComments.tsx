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
      timeAgo: "2 months ago",
      rating: 4.8,
      content: "This is a solid time-killer for my commute! Easy to pick up and play a round or two. The mechanics are simple yet addictive. Definitely worth a try!",
      likes: 12,
      dislikes: 1
    },
    {
      id: 2,
      author: "HighRollerHank",
      avatarColor: "bg-green-600",
      timeAgo: "3 months ago",
      rating: 4.9,
      content: "The leaderboard is where it's at! Been grinding to get into the top 10. The thrill of going all-in is real, and the graphics are quite polished.",
      likes: 8,
      dislikes: 0
    },
    {
      id: 3,
      author: "ShadowNinja",
      avatarColor: "bg-purple-600",
      timeAgo: "1 month ago",
      rating: 4.5,
      content: "Great game! I love the strategy involved. It's more than just luck, you really have to think ahead. A few more levels would be nice though.",
      likes: 5,
      dislikes: 0
    },
    {
      id: 4,
      author: "PixelMaster",
      avatarColor: "bg-amber-600",
      timeAgo: "2 weeks ago",
      rating: 5.0,
      content: "Absolutely amazing! The art style is unique and the gameplay is smooth as butter. I've been playing for 3 hours straight and can't put it down.",
      likes: 15,
      dislikes: 0
    },
    {
      id: 5,
      author: "StrategyQueen",
      avatarColor: "bg-pink-600",
      timeAgo: "1 week ago",
      rating: 4.7,
      content: "Very well-designed game. The progression system feels rewarding and the difficulty curve is just right. Highly recommend to anyone who likes a challenge.",
      likes: 7,
      dislikes: 1
    },
    {
      id: 6,
      author: "CasualJoe",
      avatarColor: "bg-indigo-600",
      timeAgo: "4 days ago",
      rating: 4.2,
      content: "Perfect for a quick break. Doesn't require too much commitment but keeps you engaged. Will be playing this more often!",
      likes: 3,
      dislikes: 0
    },
    {
      id: 7,
      author: "KlifurFanatic",
      avatarColor: "bg-red-500",
      timeAgo: "5 days ago",
      rating: 5.0,
      content: "The physics in Klifur are so unique! It feels like real climbing but with a hilarious twist. Level 10 is driving me crazy but I love it.",
      likes: 22,
      dislikes: 0
    },
    {
      id: 8,
      author: "MountainMan",
      avatarColor: "bg-emerald-600",
      timeAgo: "6 days ago",
      rating: 4.9,
      content: "As a real rock climber, this game actually captures the decision making process of finding the right holds. Super impressed!",
      likes: 18,
      dislikes: 2
    },
    {
      id: 9,
      author: "ZenMaster",
      avatarColor: "bg-sky-400",
      timeAgo: "1 week ago",
      rating: 4.6,
      content: "The lack of music makes it so relaxing. Just me and the wall. Very meditative experience until you fall off lol.",
      likes: 9,
      dislikes: 0
    },
    {
      id: 10,
      author: "SpeedRunnerX",
      avatarColor: "bg-orange-500",
      timeAgo: "1 week ago",
      rating: 4.8,
      content: "Trying to beat the developer's best route in every stage. Some of these stars are incredibly hard to get. Great challenge!",
      likes: 31,
      dislikes: 1
    },
    {
      id: 11,
      author: "BoulderingBabe",
      avatarColor: "bg-rose-400",
      timeAgo: "2 weeks ago",
      rating: 4.7,
      content: "The character's floppy arms are so funny. I spend half my time just laughing at the falls. But clearing a hard route feels so good.",
      likes: 14,
      dislikes: 0
    },
    {
      id: 12,
      author: "PhysicsGeek",
      avatarColor: "bg-teal-500",
      timeAgo: "2 weeks ago",
      rating: 4.5,
      content: "The squishy physics engine is actually quite sophisticated. The way weight shifts and momentum carries is spot on. Quality work.",
      likes: 11,
      dislikes: 0
    },
    {
      id: 13,
      author: "IndieLover",
      avatarColor: "bg-violet-600",
      timeAgo: "3 weeks ago",
      rating: 5.0,
      content: "Torfi has done it again. Such a simple concept executed with so much personality. This is why I love indie games.",
      likes: 25,
      dislikes: 0
    },
    {
      id: 14,
      author: "GamerDad",
      avatarColor: "bg-slate-700",
      timeAgo: "3 weeks ago",
      rating: 4.3,
      content: "My kids and I take turns trying to beat levels. It's easy enough for them to understand but hard enough to keep me engaged too.",
      likes: 6,
      dislikes: 0
    },
    {
      id: 15,
      author: "CoffeeBreakGamer",
      avatarColor: "bg-amber-800",
      timeAgo: "1 month ago",
      rating: 4.6,
      content: "Perfect game to play while drinking my morning coffee. Quick levels, satisfying progress, and runs perfectly in the browser.",
      likes: 10,
      dislikes: 0
    },
    {
      id: 16,
      author: "HardcoreHenry",
      avatarColor: "bg-zinc-800",
      timeAgo: "1 month ago",
      rating: 4.1,
      content: "Level 12 is absolute madness. Took me over 100 attempts but I finally made it. The sense of achievement is real.",
      likes: 19,
      dislikes: 3
    },
    {
      id: 17,
      author: "ArtEnthusiast",
      avatarColor: "bg-cyan-500",
      timeAgo: "1 month ago",
      rating: 4.9,
      content: "I love the color palette. It's so clean and modern. The minimalist design really lets the physics shine.",
      likes: 7,
      dislikes: 0
    },
    {
      id: 18,
      author: "MobileGamer99",
      avatarColor: "bg-lime-500",
      timeAgo: "1 month ago",
      rating: 4.4,
      content: "Works surprisingly well on my phone's browser. Touch controls are intuitive. Great for killing time in waiting rooms.",
      likes: 4,
      dislikes: 0
    },
    {
      id: 19,
      author: "PuzzleSolver",
      avatarColor: "bg-fuchsia-600",
      timeAgo: "2 months ago",
      rating: 4.7,
      content: "It's more of a puzzle game than an action game. You have to figure out the right sequence of moves. Very clever level design.",
      likes: 13,
      dislikes: 0
    },
    {
      id: 20,
      author: "RetroFan",
      avatarColor: "bg-orange-600",
      timeAgo: "2 months ago",
      rating: 4.8,
      content: "Reminds me of some of those old Flash physics games but with modern polish. A breath of fresh air in today's mobile market.",
      likes: 16,
      dislikes: 0
    },
    {
      id: 21,
      author: "CouchPotato",
      avatarColor: "bg-stone-500",
      timeAgo: "2 months ago",
      rating: 4.2,
      content: "Sometimes the limbs get stuck in weird ways, but it usually just adds to the comedy. Fun little game for free.",
      likes: 5,
      dislikes: 1
    },
    {
      id: 22,
      author: "GamerGirl92",
      avatarColor: "bg-pink-400",
      timeAgo: "3 months ago",
      rating: 5.0,
      content: "Obsessed with Klifur! I've already shared it with all my friends. We're competing to see who can get all the stars first.",
      likes: 28,
      dislikes: 0
    },
    {
      id: 23,
      author: "NewbieClimber",
      avatarColor: "bg-yellow-500",
      timeAgo: "3 months ago",
      rating: 4.5,
      content: "Just started playing today and I'm already on level 5. It's very easy to get into but I can see it getting much harder!",
      likes: 2,
      dislikes: 0
    }
  ];

  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  
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
  
  // Pagination logic
  const totalPages = Math.ceil(allComments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top of comments section
    const element = document.getElementById("comments-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="comments-section" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({allComments.length})</h2>
      
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
        {currentComments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-50">
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
                      <button className="flex items-center gap-1 text-xs hover:text-blue-500 transition-colors">
                        <ThumbsUp className="w-3 h-3" /> {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors">
                        <ThumbsDown className="w-3 h-3" /> {comment.dislikes}
                      </button>
                      <button className="flex items-center gap-1 text-xs hover:text-gray-600 transition-colors dark:hover:text-gray-200">
                        <MessageSquare className="w-3 h-3" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs">Prev</span>
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  currentPage === page 
                    ? "bg-blue-500 text-white shadow-md shadow-blue-200" 
                    : "border border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs">Next</span>
          </button>
        </div>
      )}
    </div>
  );
};

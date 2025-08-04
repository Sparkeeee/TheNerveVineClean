"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SaveArticleButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export default function SaveArticleButton({ slug, title, className = "" }: SaveArticleButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if article is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!session) return;
      
      try {
        const response = await fetch("/api/user/saved-items");
        if (response.ok) {
          const data = await response.json();
          const isItemSaved = data.articles?.some((article: any) => article.slug === slug);
          setIsSaved(isItemSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkIfSaved();
  }, [session, slug]);

  const handleSave = async () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    console.log("SaveArticleButton: Attempting to save article", { slug, isSaved, session: session.user });
    setIsLoading(true);
    
    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch("/api/user/save-item", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "article", slug }),
      });

      console.log("SaveArticleButton: API response", { status: response.status, ok: response.ok });
      
      if (response.ok) {
        const data = await response.json();
        console.log("SaveArticleButton: API response data", data);
        setIsSaved(!isSaved);
      } else {
        const errorData = await response.json();
        console.error("Failed to save article:", errorData);
      }
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <button
        onClick={handleSave}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Save to Library
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`${
          isSaved 
            ? "bg-blue-700 hover:bg-blue-800" 
            : "bg-blue-600 hover:bg-blue-700"
        } text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isSaved ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
        {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save to Library"}
      </button>
      
      {/* Only show View Library button if article is actually saved */}
      {isSaved && (
        <a
          href="/my-list"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          View Library
        </a>
      )}
    </div>
  );
} 
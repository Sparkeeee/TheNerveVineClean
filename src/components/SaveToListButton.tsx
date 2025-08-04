"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SaveToListButtonProps {
  type: "herb" | "supplement";
  slug: string;
  name: string;
  className?: string;
}

export default function SaveToListButton({ type, slug, name, className = "" }: SaveToListButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if item is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!session) return;
      
      try {
        const response = await fetch("/api/user/saved-items");
        if (response.ok) {
          const data = await response.json();
          const savedItems = type === "herb" ? data.herbs : data.supplements;
          const isItemSaved = savedItems.some((item: any) => item.slug === slug);
          setIsSaved(isItemSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkIfSaved();
  }, [session, type, slug]);

  const handleSave = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    
    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch("/api/user/save-item", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      } else {
        console.error("Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <button
        onClick={handleSave}
        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Save to My List
      </button>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`${
        isSaved 
          ? "bg-green-700 hover:bg-green-800" 
          : "bg-green-600 hover:bg-green-700"
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
      {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save to My List"}
    </button>
  );
} 
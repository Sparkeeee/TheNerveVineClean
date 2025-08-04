"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SavedItem {
  slug: string;
  name: string;
  description: string;
  type: "herb" | "supplement" | "article";
}

export default function MyListPage() {
  const { data: session, status } = useSession();
  const [savedHerbs, setSavedHerbs] = useState<SavedItem[]>([]);
  const [savedSupplements, setSavedSupplements] = useState<SavedItem[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      window.location.href = "/login";
      return;
    }

    fetchSavedItems();
  }, [session, status]);

  const fetchSavedItems = async () => {
    try {
      const response = await fetch("/api/user/saved-items");
      if (response.ok) {
        const data = await response.json();
        setSavedHerbs(data.herbs || []);
        setSavedSupplements(data.supplements || []);
        setSavedArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Error fetching saved items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (type: "herb" | "supplement" | "article", slug: string) => {
    try {
      const response = await fetch("/api/user/save-item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });

      if (response.ok) {
        // Refresh the list
        fetchSavedItems();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Saved Items</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Saved Herbs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Saved Herbs</h2>
            {savedHerbs.length === 0 ? (
              <p className="text-gray-500">No herbs saved yet. Browse our herbs to get started!</p>
            ) : (
              <div className="space-y-4">
                {savedHerbs.map((herb) => (
                  <div key={herb.slug} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          <Link href={`/herbs/${herb.slug}`} className="text-green-700 hover:text-green-800">
                            {herb.name}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {herb.description.length > 150 
                            ? `${herb.description.substring(0, 150)}...` 
                            : herb.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem("herb", herb.slug)}
                        className="text-red-600 hover:text-red-800 ml-2"
                        title="Remove from saved items"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Supplements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Saved Supplements</h2>
            {savedSupplements.length === 0 ? (
              <p className="text-gray-500">No supplements saved yet. Browse our supplements to get started!</p>
            ) : (
              <div className="space-y-4">
                {savedSupplements.map((supplement) => (
                  <div key={supplement.slug} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          <Link href={`/supplements/${supplement.slug}`} className="text-blue-700 hover:text-blue-800">
                            {supplement.name}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {supplement.description.length > 150 
                            ? `${supplement.description.substring(0, 150)}...` 
                            : supplement.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem("supplement", supplement.slug)}
                        className="text-red-600 hover:text-red-800 ml-2"
                        title="Remove from saved items"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Articles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Research Library</h2>
            {savedArticles.length === 0 ? (
              <p className="text-gray-500">No research articles saved yet. Browse comprehensive info documents to build your library!</p>
            ) : (
              <div className="space-y-4">
                {savedArticles.map((article) => (
                  <div key={article.slug} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          <Link href={`/herbs/${article.slug}/research`} className="text-purple-700 hover:text-purple-800">
                            {article.name}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {article.description.length > 150 
                            ? `${article.description.substring(0, 150)}...` 
                            : article.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem("article", article.slug)}
                        className="text-red-600 hover:text-red-800 ml-2"
                        title="Remove from research library"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/herbs"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors duration-200"
          >
            Browse Herbs
          </Link>
          <Link
            href="/supplements"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-200"
          >
            Browse Supplements
          </Link>
        </div>
      </div>
    </div>
  );
} 
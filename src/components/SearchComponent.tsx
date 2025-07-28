"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Search data types
interface SearchItem {
  id: string;
  title: string;
  description: string;
  type: 'herb' | 'supplement' | 'symptom';
  slug: string;
  tags: string[];
  benefits?: string[];
  symptoms?: string[];
}

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search data from database on component mount
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const response = await fetch('/api/search');
        const data = await response.json();
        
        if (data.success) {
          setSearchData(data.data);
        } else {
          setSearchData([]);
        }
      } catch (error) {
        setSearchData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (query.trim() === "" || isLoading) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredResults = searchData.filter(item => {
      const matchesQuery = 
        (item.title && typeof item.title === 'string' && item.title.toLowerCase().includes(searchTerm)) ||
        (item.description && typeof item.description === 'string' && item.description.toLowerCase().includes(searchTerm)) ||
        (item.tags && Array.isArray(item.tags) && item.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(searchTerm))) ||
        (item.benefits && Array.isArray(item.benefits) && item.benefits.some(benefit => typeof benefit === 'string' && benefit.toLowerCase().includes(searchTerm))) ||
        (item.symptoms && Array.isArray(item.symptoms) && item.symptoms.some(symptom => typeof symptom === 'string' && symptom.toLowerCase().includes(searchTerm)));

      return matchesQuery;
    });

    // Sort by relevance (exact title matches first, then description, then tags)
    filteredResults.sort((a, b) => {
      const aTitleMatch = a.title && typeof a.title === 'string' && a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title && typeof b.title === 'string' && b.title.toLowerCase().includes(searchTerm);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return (a.title || '').localeCompare(b.title || '');
    });

    setResults(filteredResults.slice(0, 8)); // Limit to 8 results
  }, [query, searchData, isLoading]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'herb': return '🌿';
      case 'supplement': return '💊';
      case 'symptom': return '🩺';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'herb': return 'text-lime-600 bg-lime-50';
      case 'supplement': return 'text-blue-600 bg-blue-50';
      case 'symptom': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          id="search-input"
          name="search"
          placeholder={isLoading ? "Loading search data..." : "Search herbs, supplements, symptoms..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={isLoading}
          className="w-full px-3 py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-600 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <svg className="h-4 w-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.slug}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  {item.benefits && item.benefits.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-medium">Benefits:</p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {item.benefits.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}
                  {item.symptoms && item.symptoms.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-medium">Symptoms:</p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {item.symptoms.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() !== "" && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-gray-500 text-center">
            No results found for &quot;{query}&quot;
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Try searching for herbs, supplements, or symptoms
          </p>
        </div>
      )}

      {/* Loading State */}
      {isOpen && isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-gray-500 text-center">
            Loading search data...
          </p>
        </div>
      )}
    </div>
  );
} 
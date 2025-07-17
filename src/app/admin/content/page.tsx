"use client";

import { useEffect, useState } from "react";

const TABS = ["Herbs", "Supplements", "Symptoms"];

export default function AdminContentDashboard() {
  const [tab, setTab] = useState("Herbs");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<any>({ name: "", description: "" });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [tab]);

  async function fetchData() {
    setLoading(true);
    setError("");
    let url = "/api/" + tab.toLowerCase();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch " + tab);
      const items = await res.json();
      setData(items);
    } catch (e: any) {
      setError(e.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setFormMode("add");
    setFormData({ name: "", description: "" });
    setShowForm(true);
  }

  function openEditForm(item: any) {
    setFormMode("edit");
    setFormData({ ...item });
    setShowForm(true);
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");
    let url = "/api/" + tab.toLowerCase();
    let method = formMode === "add" ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save " + tab.slice(0, -1));
      setShowForm(false);
      await fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setLoading(true);
    setError("");
    let url = "/api/" + tab.toLowerCase();
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete " + tab.slice(0, -1));
      await fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Content Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${tab === t ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <div>Loading {tab}...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            onClick={openAddForm}
          >
            + Add New {tab.slice(0, -1)}
          </button>
          <table className="w-full text-left border border-gray-700 rounded bg-gray-800">
            <thead>
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-gray-700">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.description || <span className="text-gray-500">(none)</span>}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => openEditForm(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">No {tab.toLowerCase()} found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <form
                className="bg-gray-800 p-8 rounded shadow-lg min-w-[320px] max-w-[90vw]"
                onSubmit={handleFormSubmit}
              >
                <h2 className="text-xl font-bold mb-4">{formMode === "add" ? "Add New" : "Edit"} {tab.slice(0, -1)}</h2>
                <div className="mb-4">
                  <label className="block mb-1">Name</label>
                  <input
                    className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Description</label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                    value={formData.description || ""}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
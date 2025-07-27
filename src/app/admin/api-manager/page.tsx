"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface MerchantApi {
  id: string;
  name: string;
  affiliatePercent: number;
  minPayout: number;
  freeLimit?: number;
  included: boolean;
}

const fetchMerchantApis = async (): Promise<MerchantApi[]> => {
  const res = await fetch("/api/merchant-apis");
  if (!res.ok) throw new Error("Failed to fetch merchant APIs");
  return res.json();
};

const updateMerchantApi = async (api: MerchantApi) => {
  await fetch(`/api/merchant-apis/${api.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(api),
  });
};

const MOCK_APIS: MerchantApi[] = [
  {
    id: "herbalco",
    name: "HerbalCo",
    affiliatePercent: 10,
    minPayout: 50,
    freeLimit: 1000,
    included: true,
  },
  {
    id: "supplemart",
    name: "SuppleMart",
    affiliatePercent: 8,
    minPayout: 25,
    freeLimit: 500,
    included: false,
  },
  {
    id: "naturedirect",
    name: "NatureDirect",
    affiliatePercent: 12,
    minPayout: 100,
    freeLimit: 2000,
    included: true,
  },
];

export default function ApiManagerPage() {
  const [apis, setApis] = useState<MerchantApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchantApis()
      .then(setApis)
      .catch(() => setApis(MOCK_APIS))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (id: string, field: keyof MerchantApi, value: string | number | boolean) => {
    setApis((prev) =>
      prev.map((api) =>
        api.id === id ? { ...api, [field]: value } : api
      )
    );
  };

  const handleSave = async (api: MerchantApi) => {
    setLoading(true);
    try {
      await updateMerchantApi(api);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-extrabold text-black mb-6">API Manager</h1>
      <div className="mb-4 flex gap-4">
        <Link href="/admin" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900 font-semibold transition">Back to Admin</Link>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">API Name</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Affiliate %</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Min Payout ($)</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Free API Limit</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Included</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apis.map((api) => (
              <tr key={api.id}>
                <td className="px-4 py-2 font-semibold text-gray-900">{api.name}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={api.affiliatePercent}
                    onChange={(e) => handleChange(api.id, "affiliatePercent", Number(e.target.value))}
                    className="w-20 p-1 border border-gray-300 rounded text-black bg-white"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min={0}
                    value={api.minPayout}
                    onChange={(e) => handleChange(api.id, "minPayout", Number(e.target.value))}
                    className="w-24 p-1 border border-gray-300 rounded text-black bg-white"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min={0}
                    value={api.freeLimit ?? ""}
                    onChange={(e) => handleChange(api.id, "freeLimit", Number(e.target.value))}
                    className="w-24 p-1 border border-gray-300 rounded text-black bg-white"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={api.included}
                    onChange={(e) => handleChange(api.id, "included", e.target.checked)}
                    className="accent-blue-600 w-5 h-5"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleSave(api)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-semibold transition"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
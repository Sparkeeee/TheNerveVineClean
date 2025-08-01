"use client";

import { useEffect, useState } from "react";
import React from 'react';
import Link from 'next/link';

// TypeScript interfaces
interface Herb {
  id: number;
  name: string;
  latinName?: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: string[];
  cautions?: string;
  productFormulations?: Array<{
    type: string;
    qualityCriteria: string;
    tags: string[];
    affiliateLink: string;
    price: string;
  }>;
  references?: Array<{
    type: string;
    value: string;
  }>;
  indications?: string[];
  traditionalUses?: string[];
}

interface Supplement {
  id: number;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: string[];
  cautions?: string;
  productFormulations?: Array<{
    type: string;
    qualityCriteria: string;
    tags: string[];
    affiliateLink: string;
    price: string;
  }>;
  references?: Array<{
    type: string;
    value: string;
  }>;
  indications?: string[];
  traditionalUses?: string[];
}

interface Symptom {
  id: number;
  slug: string;
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  articles?: unknown;
  associatedSymptoms?: unknown;
  cautions?: string;
  variants?: unknown;
  references?: unknown;
  variantDescriptions?: unknown;
  products?: unknown[];
}

// Add interface for SymptomVariant
interface SymptomVariant {
  id: number;
  parentSymptomId: number;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  cautions?: string;
  references?: unknown;
  herbs?: Herb[];
  supplements?: Supplement[];
}

// Add interface for Indication
interface Indication {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  herbs?: Herb[];
  supplements?: Supplement[];
}

// Define ProductFormulation type for clarity
interface ProductFormulation {
  name?: string;
  type: string;
  qualityCriteria: string;
  tags?: string[];
  affiliateLink?: string;
  price?: string;
}

type Article = {
  title: string;
  adminNote: string;
  uploadDate: string;
  content: string | ArrayBuffer | null;
  fileName: string | null;
};

const TABS = ["Herbs", "Supplements", "Symptoms", "Indications", "Blog"];

const HERB_FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "latinName", label: "Latin Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "cautions", label: "Cautions" },
  { key: "heroImageUrl", label: "Hero Image URL" },
  { key: "cardImageUrl", label: "Card Image URL" },
  { key: "galleryImages", label: "Gallery Images (JSON)" },
  { key: "metaTitle", label: "Meta Title" },
  { key: "metaDescription", label: "Meta Description" },
  { key: "productFormulations", label: "Product Formulations (JSON)" },
  { key: "references", label: "References (JSON)" },
];

const SUPPLEMENT_FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "cautions", label: "Cautions" },
  { key: "heroImageUrl", label: "Hero Image URL" },
  { key: "cardImageUrl", label: "Card Image URL" },
  { key: "galleryImages", label: "Gallery Images (JSON)" },
  { key: "metaTitle", label: "Meta Title" },
  { key: "metaDescription", label: "Meta Description" },
  { key: "productFormulations", label: "Product Formulations (JSON)" },
  { key: "references", label: "References (JSON)" },
  { key: "organic", label: "Organic" },
  { key: "strength", label: "Strength" },
  { key: "formulation", label: "Formulation" },
  { key: "affiliatePercentage", label: "Affiliate %" },
  { key: "customerReviews", label: "Customer Reviews" },
];

const SYMPTOM_FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "metaTitle", label: "Meta Title" },
  { key: "metaDescription", label: "Meta Description" },
  { key: "cautions", label: "Cautions" },
  { key: "articles", label: "Articles (JSON)" },
  { key: "associatedSymptoms", label: "Associated Symptoms (JSON)" },
  { key: "variants", label: "Variants (JSON)" },
  { key: "references", label: "References (JSON)" },
  { key: "variantDescriptions", label: "Variant Descriptions (JSON)" },
  { key: "products", label: "Products" },
];

function getFormattedDate() {
  return new Date().toISOString().slice(0, 10);
}

function getHerbFieldValue(herb: Herb, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(herb, key)) {
    return (herb as unknown as Record<string, unknown>)[key];
  }
  return undefined;
}
function getSupplementFieldValue(supp: Supplement, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(supp, key)) {
    return (supp as unknown as Record<string, unknown>)[key];
  }
  return undefined;
}

function getSymptomFieldValue(symptom: Symptom, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(symptom, key)) {
    return (symptom as unknown as Record<string, unknown>)[key];
  }
  return undefined;
}

export default function AdminContentPage() {
  // Blog/article upload state
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Add variant management state
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [variants, setVariants] = useState<SymptomVariant[]>([]);
  const [variantFormData, setVariantFormData] = useState<Partial<SymptomVariant>>({});
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantFormMode, setVariantFormMode] = useState<"add" | "edit">("add");

  // Add indications management state
  const [indications, setIndications] = useState<Indication[]>([]);
  const [showIndicationForm, setShowIndicationForm] = useState(false);
  const [indicationFormMode, setIndicationFormMode] = useState<"add" | "edit">("add");
  const [indicationFormData, setIndicationFormData] = useState<Partial<Indication>>({});


  // Handle file upload and/or text entry
  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setArticles((prev) => [
          ...prev,
          {
            title,
            adminNote,
            uploadDate: new Date().toLocaleString(),
            content: event.target?.result ?? null,
            fileName: file ? file.name : null,
          },
        ]);
      };
      reader.readAsText(file);
    } else if (textContent.trim()) {
      setArticles((prev) => [
        ...prev,
        {
          title,
          adminNote,
          uploadDate: getFormattedDate(),
          content: textContent,
          fileName: null,
        },
      ]);
    }
    setTitle("");
    setAdminNote("");
    setFile(null);
    setTextContent("");
  };

  // Handle edit save
  const handleEditSave = (idx: number) => {
    setArticles((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, content: editContent } : a))
    );
    setEditingIndex(null);
    setEditContent("");
  };

  // Handle article delete
  const handleArticleDelete = (idx: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    setArticles((prev) => prev.filter((_, i) => i !== idx));
  };

  const [tab, setTab] = useState("Herbs");
  const [data, setData] = useState<Herb[] | Supplement[] | Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  type HerbForm = {
    name?: string;
    latinName?: string;
    slug?: string;
    description?: string;
    cautions?: string;
    heroImageUrl?: string;
    cardImageUrl?: string;
    galleryImages?: string;
    metaTitle?: string;
    metaDescription?: string;
    productFormulations?: ProductFormulation[];
    references?: string;
    indications?: string[];
    [key: string]: unknown;
  };
  type SupplementForm = {
    name?: string;
    slug?: string;
    description?: string;
    cautions?: string;
    heroImageUrl?: string;
    cardImageUrl?: string;
    galleryImages?: string;
    metaTitle?: string;
    metaDescription?: string;
    productFormulations?: ProductFormulation[];
    references?: string;
    strength?: string;
    formulation?: string;
    affiliatePercentage?: string;
    customerReviews?: string;
    organic?: boolean;
    indications?: string[];
    [key: string]: unknown;
  };
  type SymptomForm = {
    title?: string;
    slug?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    cautions?: string;
    articles?: string;
    associatedSymptoms?: string;
    variants?: string;
    references?: string;
    variantDescriptions?: string;
    selectedHerbs?: number[];
    selectedSupplements?: number[];
    [key: string]: unknown;
  };
  type FormDataType = HerbForm | SupplementForm | SymptomForm | Record<string, unknown>;
  const [formData, setFormData] = useState<FormDataType>({});
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  // Add state for allHerbs and allSupplements
  const [allHerbs, setAllHerbs] = useState<Herb[]>([]);
  const [allSupplements, setAllSupplements] = useState<Supplement[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  // Fetch all herbs and supplements when Symptoms tab is active
  useEffect(() => {
    if (tab === "Symptoms") {
      fetchAllHerbs();
      fetchAllSupplements();
    }
    if (tab === "Indications") {
      fetchIndications();
      fetchAllHerbs();
      fetchAllSupplements();
    }
     
  }, [tab]);

  useEffect(() => {
    if (tab === "Herbs") {
      fetchSymptoms();
    }
     
  }, [tab]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [tab]);

  async function fetchSymptoms() {
    try {
      const res = await fetch("/api/symptoms");
      if (!res.ok) throw new Error("Failed to fetch symptoms");
      const response = await res.json();
      // Handle the response structure: { success: true, data: { symptoms: [...], pagination: {...} } }
      const symptomsArray = response.data?.symptoms || response.symptoms || response || [];
      if (!Array.isArray(symptomsArray)) {
        console.error('Symptoms data is not an array:', symptomsArray);
        setAllSymptoms([]);
      } else {
        setAllSymptoms(symptomsArray);
      }
    } catch {
      setAllSymptoms([]);
    }
  }

  async function fetchAllHerbs() {
    try {
      const res = await fetch("/api/herbs");
      if (!res.ok) throw new Error("Failed to fetch herbs");
      const response = await res.json();
      // Handle the response structure: { success: true, data: { herbs: [...], pagination: {...} } }
      const herbsArray = response.data?.herbs || response.herbs || response || [];
      if (!Array.isArray(herbsArray)) {
        console.error('Herbs data is not an array:', herbsArray);
        setAllHerbs([]);
      } else {
        setAllHerbs(herbsArray);
      }
    } catch {
      setAllHerbs([]);
    }
  }

  async function fetchAllSupplements() {
    try {
      const res = await fetch("/api/supplements");
      if (!res.ok) throw new Error("Failed to fetch supplements");
      const response = await res.json();
      // Handle the response structure: { success: true, data: { supplements: [...], pagination: {...} } }
      const supplementsArray = response.data?.supplements || response.supplements || response || [];
      if (!Array.isArray(supplementsArray)) {
        console.error('Supplements data is not an array:', supplementsArray);
        setAllSupplements([]);
      } else {
        setAllSupplements(supplementsArray);
      }
    } catch {
      setAllSupplements([]);
    }
  }

  async function fetchIndications() {
    try {
      const res = await fetch("/api/indications");
      if (!res.ok) throw new Error("Failed to fetch indications");
      const response = await res.json();
      const indicationsArray = response.data?.indications || response.indications || response || [];
      if (!Array.isArray(indicationsArray)) {
        console.error('Indications data is not an array:', indicationsArray);
        setIndications([]);
      } else {
        setIndications(indicationsArray);
      }
    } catch {
      setIndications([]);
    }
  }

  async function fetchData() {
    setLoading(true);
    setError("");
    const url = "/api/" + tab.toLowerCase();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch " + tab);
      const response = await res.json();
      
      // Handle the API response structure: { herbs: [...], pagination: {...} }
      let items: Herb[] | Supplement[] | Symptom[] | Indication[] = [];
      if (response.data) {
        // New API structure
        items = response.data[tab.toLowerCase()] || response.data || [];
      } else if (response[tab.toLowerCase()]) {
        // Alternative structure
        items = response[tab.toLowerCase()];
      } else {
        // Direct array (old structure)
        items = response;
      }
      
      // Ensure items is an array
      if (!Array.isArray(items)) {
        console.error('Items is not an array:', items);
        items = [];
      }
      
      setData(items);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }



  // Open variant management modal
  async function openVariantModal(symptom: Symptom) {
    setSelectedSymptom(symptom);
    setShowVariantModal(true);
    await fetchVariants(symptom.id);
  }

  // Fetch variants for a symptom
  async function fetchVariants(symptomId: number) {
    try {
      const res = await fetch(`/api/symptoms/${symptomId}/variants`);
      if (!res.ok) throw new Error("Failed to fetch variants");
      const variantsData: SymptomVariant[] = await res.json();
      setVariants(variantsData);
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    }
  }

  // Open variant form (add or edit)
  function openVariantForm(mode: "add" | "edit", variant?: SymptomVariant) {
    setVariantFormMode(mode);
    if (mode === "edit" && variant) {
      setVariantFormData(variant);
    } else {
      setVariantFormData({
        parentSymptomId: selectedSymptom?.id || 0,
        name: "",
        slug: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        cautions: "",
        references: []
      });
    }
    setShowVariantForm(true);
  }

  // Handle variant form submission
  async function handleVariantFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSymptom) return;

    try {
      const url = `/api/symptoms/${selectedSymptom.id}/variants`;
      const method = variantFormMode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variantFormData),
      });

      if (!res.ok) throw new Error("Failed to save variant");
      
      setShowVariantForm(false);
      await fetchVariants(selectedSymptom.id);
    } catch (error) {
      console.error('Error saving variant:', error);
      setError('Failed to save variant');
    }
  }

  // Handle variant deletion
  async function handleVariantDelete(variantId: number) {
    if (!selectedSymptom || !window.confirm("Are you sure you want to delete this variant?")) return;

    try {
      const res = await fetch(`/api/symptoms/${selectedSymptom.id}/variants/${variantId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete variant");
      
      await fetchVariants(selectedSymptom.id);
    } catch (error) {
      console.error('Error deleting variant:', error);
      setError('Failed to delete variant');
    }
  }

  // Indication management functions
  function openIndicationForm(mode: "add" | "edit", indication?: Indication) {
    setIndicationFormMode(mode);
    if (mode === "edit" && indication) {
      setIndicationFormData(indication);
    } else {
      setIndicationFormData({
        name: "",
        slug: "",
        description: "",
        color: "blue"
      });
    }
    setShowIndicationForm(true);
  }

  async function handleIndicationFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      const url = "/api/indications";
      const method = indicationFormMode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(indicationFormData),
      });

      if (!res.ok) throw new Error("Failed to save indication");
      
      setShowIndicationForm(false);
      await fetchIndications();
    } catch (error) {
      console.error('Error saving indication:', error);
      setError('Failed to save indication');
    }
  }

  async function handleIndicationDelete(indicationId: number) {
    if (!window.confirm("Are you sure you want to delete this indication?")) return;

    try {
      const res = await fetch(`/api/indications/${indicationId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete indication");
      
      await fetchIndications();
    } catch (error) {
      console.error('Error deleting indication:', error);
      setError('Failed to delete indication');
    }
  }

  function openAddForm() {
    setFormMode("add");
    if (tab === "Indications") {
      setIndicationFormData({
        name: "",
        slug: "",
        description: "",
        color: "blue"
      });
      setShowIndicationForm(true);
    } else {
      setFormData({});
      setShowForm(true);
    }
  }

  function openEditForm(item: Herb | Supplement | Symptom | Indication) {
    if (tab === "Indications") {
      setIndicationFormMode("edit");
      setIndicationFormData(item as Indication);
      setShowIndicationForm(true);
      return;
    }
    
    setFormMode("edit");
    
    // Parse JSON fields that come from the database
    const processedItem = { ...item } as Record<string, unknown>;
    
    // Handle indications field - it comes as JSON from database but needs to be an array
    if (processedItem.indications && typeof processedItem.indications === 'string') {
      try {
        processedItem.indications = JSON.parse(processedItem.indications as string);
      } catch {
        processedItem.indications = [];
      }
    } else if (!processedItem.indications) {
      processedItem.indications = [];
    }
    
    // Handle other JSON fields similarly
    if (processedItem.productFormulations && typeof processedItem.productFormulations === 'string') {
      try {
        processedItem.productFormulations = JSON.parse(processedItem.productFormulations as string);
      } catch {
        processedItem.productFormulations = [];
      }
    } else if (!processedItem.productFormulations) {
      processedItem.productFormulations = [];
    }
    
    if (processedItem.references && typeof processedItem.references === 'string') {
      try {
        processedItem.references = JSON.parse(processedItem.references as string);
      } catch {
        processedItem.references = [];
      }
    } else if (!processedItem.references) {
      processedItem.references = [];
    }
    
    setFormData(processedItem);
    setShowForm(true);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = "/api/" + tab.toLowerCase();
    const method = formMode === "add" ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save " + tab.slice(0, -1));
      setShowForm(false);
      await fetchData();
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setLoading(true);
    setError("");
    
    if (tab === "Indications") {
      try {
        const res = await fetch(`/api/indications/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete indication");
        await fetchIndications();
      } catch {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    const url = "/api/" + tab.toLowerCase();
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete " + tab.slice(0, -1));
      await fetchData();
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Render fields for herbs or fallback to old logic for other tabs
  function renderTableHeaders() {
    if (tab === "Herbs") {
      return (
        <tr>
          <th className="px-2 py-1 text-xs">Actions</th>
          <th className="px-2 py-1 text-xs">ID</th>
          {HERB_FIELDS.map((f) => (
            <th key={f.key} className="px-2 py-1 text-xs">{f.label}</th>
          ))}
          <th className="px-2 py-1 text-xs">Indications</th>
        </tr>
      );
    }
    if (tab === "Supplements") {
      return (
        <tr>
          <th className="px-2 py-1 text-xs">Actions</th>
          <th className="px-2 py-1 text-xs">ID</th>
          {SUPPLEMENT_FIELDS.map((f) => (
            <th key={f.key} className="px-2 py-1 text-xs">{f.label}</th>
          ))}
        </tr>
      );
    }
    if (tab === "Indications") {
      return (
        <tr>
          <th className="px-2 py-1 text-xs">Actions</th>
          <th className="px-2 py-1 text-xs">ID</th>
          <th className="px-2 py-1 text-xs">Name</th>
          <th className="px-2 py-1 text-xs">Slug</th>
          <th className="px-2 py-1 text-xs">Description</th>
          <th className="px-2 py-1 text-xs">Color</th>
          <th className="px-2 py-1 text-xs">Associated Herbs</th>
          <th className="px-2 py-1 text-xs">Associated Supplements</th>
        </tr>
      );
    }
    // Fallback for other tabs (Symptoms)
    return (
      <tr>
        <th className="px-2 py-1 text-xs">Actions</th>
        <th className="px-2 py-1 text-xs">ID</th>
        {SYMPTOM_FIELDS.map((f) => (
          <th key={f.key} className="px-2 py-1 text-xs">{f.label}</th>
        ))}
      </tr>
    );
  }

  const toggleDescription = (id: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDescriptions(newExpanded);
  };
  
  const renderDescription = (description: string | undefined, id: number) => {
    if (!description) return <span className="text-gray-500">(none)</span>;
    
    const isExpanded = expandedDescriptions.has(id);
    const truncatedText = description.length > 100 ? description.substring(0, 100) + '...' : description;
    
    return (
      <div className="text-xs">
        <span className={isExpanded ? '' : 'line-clamp-2'}>
          {isExpanded ? description : truncatedText}
        </span>
        {description.length > 100 && (
          <button
            onClick={() => toggleDescription(id)}
            className="ml-2 text-blue-400 hover:text-blue-300 text-xs underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  function renderTableRow(item: Herb | Supplement | Symptom, index: number) {
    let itemAny: unknown;
    const isEven = index % 2 === 0;
    const rowBgClass = isEven ? "bg-gray-800" : "bg-gray-900";
    
    if (tab === "Herbs") {
      const herbItem = item as Herb;
      return (
        <tr key={item.id} className={`border-t border-gray-700 ${rowBgClass}`}>
          <td className="px-2 py-1">
            <div className="flex gap-1">
              <button
                className="px-1.5 py-0.5 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-colors"
                onClick={() => openEditForm(item)}
              >
                Edit
              </button>
              <button
                className="px-1.5 py-0.5 bg-red-500 rounded text-xs hover:bg-red-600 transition-colors"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </td>
          <td className="px-2 py-1 text-xs">{item.id}</td>
          {HERB_FIELDS.map((f) => {
            const value = getHerbFieldValue(herbItem, f.key);
            return (
              <td key={f.key} className="px-2 py-1 text-xs max-w-[180px] truncate">
                {f.key === "name"
                  ? herbItem.name || '—'
                  : (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
                    ? value
                    : '—'}
              </td>
            );
          })}
          <td className="px-2 py-1">
            {herbItem.indications && herbItem.indications.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                {herbItem.indications.map((sym: string) => (
                  <span key={sym} className="bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded text-xs border border-blue-700 whitespace-nowrap flex-shrink-0">
                    {sym}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 text-xs">(none)</span>
            )}
          </td>
        </tr>
      );
    }
    if (tab === "Supplements") {
      itemAny = item as Supplement;
      return (
        <tr key={item.id} className={`border-t border-gray-700 ${rowBgClass}`}>
          <td className="px-2 py-1">
            <div className="flex gap-1">
              <button
                className="px-1.5 py-0.5 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-colors"
                onClick={() => openEditForm(item)}
              >
                Edit
              </button>
              <button
                className="px-1.5 py-0.5 bg-red-500 rounded text-xs hover:bg-red-600 transition-colors"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </td>
          <td className="px-2 py-1 text-xs">{item.id}</td>
          {SUPPLEMENT_FIELDS.map((f) => {
            const value = getSupplementFieldValue(itemAny as Supplement, f.key);
            return (
              <td key={f.key} className="px-2 py-1 text-xs max-w-[180px] truncate">
                {(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
                  ? value
                  : value === true ? 'Yes' : value === false ? 'No' : '—'}
              </td>
            );
          })}
        </tr>
      );
    }
    if (tab === "Indications") {
      const indicationItem = item as Indication;
      return (
        <tr key={item.id} className={`border-t border-gray-700 ${rowBgClass}`}>
          <td className="px-2 py-1">
            <div className="flex gap-1">
              <button
                className="px-1.5 py-0.5 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-colors"
                onClick={() => openIndicationForm("edit", indicationItem)}
              >
                Edit
              </button>
              <button
                className="px-1.5 py-0.5 bg-red-500 rounded text-xs hover:bg-red-600 transition-colors"
                onClick={() => handleIndicationDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </td>
          <td className="px-2 py-1 text-xs">{item.id}</td>
          <td className="px-2 py-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{indicationItem.name}</span>
              <div 
                className={`w-3 h-3 rounded-full bg-${indicationItem.color || 'blue'}-500`}
                style={{ backgroundColor: indicationItem.color || '#3b82f6' }}
              ></div>
            </div>
          </td>
          <td className="px-2 py-1 text-xs text-gray-400">{indicationItem.slug}</td>
          <td className="px-2 py-1 text-xs max-w-[200px] truncate">
            {renderDescription(indicationItem.description, item.id)}
          </td>
          <td className="px-2 py-1 text-xs">
            <div className="flex items-center gap-2">
              <div 
                className={`w-4 h-4 rounded-full bg-${indicationItem.color || 'blue'}-500`}
                style={{ backgroundColor: indicationItem.color || '#3b82f6' }}
              ></div>
              <span className="capitalize">{indicationItem.color || 'blue'}</span>
            </div>
          </td>
          <td className="px-2 py-1 text-xs">
            {indicationItem.herbs && indicationItem.herbs.length > 0 ? (
              <div className="max-w-[150px]">
                <div className="font-semibold text-green-300">{indicationItem.herbs.length} herb(s)</div>
                <div className="text-xs text-gray-400 max-h-12 overflow-y-auto">
                  {indicationItem.herbs.slice(0, 3).map(herb => (
                    <div key={herb.id} className="truncate">• {herb.name}</div>
                  ))}
                  {indicationItem.herbs.length > 3 && (
                    <div className="text-gray-500">... and {indicationItem.herbs.length - 3} more</div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">No herbs</span>
            )}
          </td>
          <td className="px-2 py-1 text-xs">
            {indicationItem.supplements && indicationItem.supplements.length > 0 ? (
              <div className="max-w-[150px]">
                <div className="font-semibold text-blue-300">{indicationItem.supplements.length} supplement(s)</div>
                <div className="text-xs text-gray-400 max-h-12 overflow-y-auto">
                  {indicationItem.supplements.slice(0, 3).map(supplement => (
                    <div key={supplement.id} className="truncate">• {supplement.name}</div>
                  ))}
                  {indicationItem.supplements.length > 3 && (
                    <div className="text-gray-500">... and {indicationItem.supplements.length - 3} more</div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">No supplements</span>
            )}
          </td>
        </tr>
      );
    }
    // Fallback for other tabs (Symptoms)
    const symptomItem = item as Symptom;
    
    return (
      <tr key={item.id} className={`border-t border-gray-700 ${rowBgClass}`}>
        <td className="px-2 py-1">
          <div className="flex gap-1">
            <button
              className="px-1.5 py-0.5 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-colors"
              onClick={() => openEditForm(item)}
            >
              Edit
            </button>
                    <button
          className="px-1.5 py-0.5 bg-red-500 rounded text-xs hover:bg-red-600 transition-colors"
          onClick={() => handleDelete(item.id)}
        >
          Delete
        </button>
        <button
          className="px-1.5 py-0.5 bg-green-500 rounded text-xs hover:bg-green-600 transition-colors"
          onClick={() => openVariantModal(symptomItem)}
        >
          Variants
        </button>
          </div>
        </td>
        <td className="px-2 py-1 text-xs">{item.id}</td>
        {SYMPTOM_FIELDS.map((f) => {
          const value = getSymptomFieldValue(symptomItem, f.key);
          return (
            <td key={f.key} className="px-2 py-1 text-xs max-w-[180px] truncate">
              {f.key === "title"
                ? symptomItem.title || '—'
                : f.key === "description"
                ? renderDescription(symptomItem.description, item.id)
                : f.key === "products"
                ? symptomItem.products && symptomItem.products.length > 0
                  ? `${symptomItem.products.length} product(s)`
                  : '—'
                : (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
                  ? value
                  : value === true ? 'Yes' : value === false ? 'No' : '—'}
            </td>
          );
        })}
      </tr>
    );
  }

  function renderFormFields() {
    if (tab === "Herbs") {
      const herbForm = formData as HerbForm;
      return <>
        {HERB_FIELDS.map((f) => {
          if (f.key === "description" || f.key === "cautions") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                <textarea
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  value={herbForm[f.key] || ""}
                  onChange={e => setFormData({ ...herbForm, [f.key]: e.target.value })}
                />
                <input
                  type="file"
                  accept=".txt,.html,.md"
                  className="mt-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    const text = file.text();
                    setFormData({ ...herbForm, [f.key]: text });
                  }}
                />
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
              </div>
            );
          }
          return (
            <div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <input
                className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                value={String(herbForm[f.key] ?? '')}
                onChange={e => setFormData({ ...herbForm, [f.key]: e.target.value })}
                required={!!f.required}
              />
            </div>
          );
        })}
        <div className="mb-4">
          <label className="block mb-1">Indications (Symptoms)</label>
          <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {Array.isArray(allSymptoms) ? allSymptoms.map(sym => (
              <div key={sym.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={(herbForm.indications || []).includes(sym.id.toString())}
                  onChange={() => {
                    const currentIndications = herbForm.indications || [];
                    const isSelected = currentIndications.includes(sym.id.toString());
                    const newIndications = isSelected
                      ? currentIndications.filter(id => id !== sym.id.toString())
                      : [...currentIndications, sym.id.toString()];
                    setFormData({ ...herbForm, indications: newIndications });
                  }}
                />
                <span className="ml-2 font-bold text-gray-100">{sym.title}</span>
              </div>
            )) : <div className="text-gray-400">Loading symptoms...</div>}
          </div>
          {Array.isArray(herbForm.indications) && herbForm.indications.length > 0 && Array.isArray(allSymptoms) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {herbForm.indications.map((id: string) => {
                const sym = allSymptoms.find(s => s.id === Number(id));
                return sym ? (
                  <span key={id} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700">
                    {sym.title}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </>;
    }
    if (tab === "Supplements") {
      const supplementForm = formData as SupplementForm;
      return <>
        {SUPPLEMENT_FIELDS.map((f) => {
          if (f.key === "description" || f.key === "cautions") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                <textarea
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  value={supplementForm[f.key] || ""}
                  onChange={e => setFormData({ ...supplementForm, [f.key]: e.target.value })}
                />
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={() => document.getElementById(`supplement-file-${f.key}`)?.click()}
                >
                  Import from File
                </button>
                <input
                  id={`supplement-file-${f.key}`}
                  type="file"
                  accept=".txt,.html,.md"
                  className="hidden"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    const text = file.text();
                    setFormData({ ...supplementForm, [f.key]: text });
                  }}
                />
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
              </div>
            );
          }
          if (f.key === "organic") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}</label>
                <select
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  value={supplementForm[f.key] === true ? 'true' : supplementForm[f.key] === false ? 'false' : ''}
                  onChange={e => setFormData({ ...supplementForm, [f.key]: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            );
          }
          return (
            <div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <input
                className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                value={String(supplementForm[f.key] ?? '')}
                onChange={e => setFormData({ ...supplementForm, [f.key]: e.target.value })}
                required={!!f.required}
              />
            </div>
          );
        })}
        {((tab as string) === "Herbs" || (tab as string) === "Supplements") && (
          <div className="mb-4">
            <label className="block mb-1">Product Formulations</label>
            {(supplementForm.productFormulations || []).map((form: ProductFormulation, index: number) => (
              <div key={index} className="border border-gray-600 rounded p-3 mb-2 bg-gray-900">
                <input
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  placeholder="Name"
                  value={form.name || ""}
                  onChange={e => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr[index].name = e.target.value;
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                />
                <input
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  placeholder="Type (e.g. tincture, extract, cream)"
                  value={form.type || ""}
                  onChange={e => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr[index].type = e.target.value;
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                />
                <input
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  placeholder="Affiliate Link"
                  value={form.affiliateLink || ""}
                  onChange={e => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr[index].affiliateLink = e.target.value;
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                />
                <input
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  placeholder="Price"
                  value={form.price || ""}
                  onChange={e => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr[index].price = e.target.value;
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                />
                <input
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  placeholder="Quality Criteria (free text)"
                  value={form.qualityCriteria || ""}
                  onChange={e => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr[index].qualityCriteria = e.target.value;
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                />
                <input
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  placeholder="Tags (comma separated, e.g. organic, >4 stars)"
                  value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                  onChange={e => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr[index].tags = e.target.value.split(',').map(tag => tag.trim());
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-red-700 rounded hover:bg-red-800 text-xs"
                  onClick={() => {
                    const arr = [...(supplementForm.productFormulations || [])];
                    arr.splice(index, 1);
                    setFormData({ ...supplementForm, productFormulations: arr });
                  }}
                >Remove</button>
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-green-700 rounded hover:bg-green-800 text-xs mt-2"
              onClick={() => setFormData({ ...supplementForm, productFormulations: [...(supplementForm.productFormulations || []), { type: '', qualityCriteria: '', tags: [], affiliateLink: '', price: '', name: '' }] })}
            >+ Add Product Formulation</button>
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1">Indications (Symptoms)</label>
          <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {Array.isArray(allSymptoms) ? allSymptoms.map(sym => (
              <div key={sym.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={(supplementForm.indications || []).includes(sym.id.toString())}
                  onChange={() => {
                    const currentIndications = supplementForm.indications || [];
                    const isSelected = currentIndications.includes(sym.id.toString());
                    const newIndications = isSelected
                      ? currentIndications.filter(id => id !== sym.id.toString())
                      : [...currentIndications, sym.id.toString()];
                    setFormData({ ...supplementForm, indications: newIndications });
                  }}
                />
                <span className="ml-2 font-bold text-gray-100">{sym.title}</span>
              </div>
            )) : <div className="text-gray-400">Loading symptoms...</div>}
          </div>
          {Array.isArray(supplementForm.indications) && supplementForm.indications.length > 0 && Array.isArray(allSymptoms) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {supplementForm.indications.map((id: string) => {
                const sym = allSymptoms.find(s => s.id === Number(id));
                return sym ? (
                  <span key={id} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700">
                    {sym.title}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </>;
    }
    if (tab === "Symptoms") {
      const symptomForm = formData as SymptomForm;
      return <>
        {SYMPTOM_FIELDS.map((f) => {
          if (f.key === "description" || f.key === "cautions") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                <textarea
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                  value={symptomForm[f.key] || ""}
                  onChange={e => setFormData({ ...symptomForm, [f.key]: e.target.value })}
                />
                <input
                  type="file"
                  accept=".txt,.html,.md"
                  className="mt-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    const text = file.text();
                    setFormData({ ...symptomForm, [f.key]: text });
                  }}
                />
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
              </div>
            );
          }
          return (
            <div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <input
                className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                value={String(symptomForm[f.key] ?? '')}
                onChange={e => setFormData({ ...symptomForm, [f.key]: e.target.value })}
                required={!!f.required}
              />
            </div>
          );
        })}
        <div className="mb-4">
          <label className="block mb-1">Select Herbs to Display</label>
          <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {Array.isArray(allHerbs) ? allHerbs.map((herb) => (
              <div key={herb.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={(symptomForm.selectedHerbs || []).includes(herb.id)}
                  onChange={e => {
                    const selected = new Set(symptomForm.selectedHerbs || []);
                    if (e.target.checked) selected.add(herb.id); else selected.delete(herb.id);
                    setFormData({ ...symptomForm, selectedHerbs: Array.from(selected) });
                  }}
                />
                <span className="ml-2 font-bold text-gray-100">{herb.name}</span>
                <span className="ml-2 text-xs text-gray-400">{herb.productFormulations?.map((f: ProductFormulation) => `${f.type || '—'} (${f.qualityCriteria || '—'})`).join(', ')}</span>
              </div>
            )) : <div className="text-gray-400">Loading herbs...</div>}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Select Supplements to Display</label>
          <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {Array.isArray(allSupplements) ? allSupplements.map((supp) => (
              <div key={supp.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={(symptomForm.selectedSupplements || []).includes(supp.id)}
                  onChange={e => {
                    const selected = new Set(symptomForm.selectedSupplements || []);
                    if (e.target.checked) selected.add(supp.id); else selected.delete(supp.id);
                    setFormData({ ...symptomForm, selectedSupplements: Array.from(selected) });
                  }}
                />
                <span className="ml-2 font-bold text-gray-100">{supp.name}</span>
                <span className="ml-2 text-xs text-gray-400">{supp.productFormulations?.map((f: ProductFormulation) => `${f.type || '—'} (${f.qualityCriteria || '—'})`).join(', ')}</span>
              </div>
            )) : <div className="text-gray-400">Loading supplements...</div>}
          </div>
        </div>
      </>;
    }
    if (tab === "Indications") {
      const indicationForm = formData as Partial<Indication>;
      return (
        <>
          {/* Help text */}
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">How to Use Indications</h3>
            <p className="text-blue-200 text-sm mb-2">
              Indications are tags that describe what herbs and supplements are used for (e.g., "Stress", "Anxiety", "Insomnia"). 
              They help users find relevant products and create a consistent tagging system across your site.
            </p>
            <p className="text-blue-200 text-sm">
              <strong>Examples:</strong> Stress, Anxiety, Sleep, Focus, Energy, Mood, Pain Relief, Digestive Support
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Name *</label>
            <input
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
              value={indicationForm.name || ""}
              onChange={e => setFormData({ ...indicationForm, name: e.target.value })}
              placeholder="e.g., Stress, Anxiety, Sleep Support"
              required
            />
            <p className="text-xs text-gray-400 mt-1">The display name for this indication tag</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Slug *</label>
            <input
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
              value={indicationForm.slug || ""}
              onChange={e => setFormData({ ...indicationForm, slug: e.target.value })}
              placeholder="e.g., stress, anxiety, sleep-support"
              required
            />
            <p className="text-xs text-gray-400 mt-1">URL-friendly version of the name (lowercase, hyphens instead of spaces)</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
              rows={3}
              value={indicationForm.description || ""}
              onChange={e => setFormData({ ...indicationForm, description: e.target.value })}
              placeholder="Brief description of what this indication covers..."
            />
            <p className="text-xs text-gray-400 mt-1">Optional description to help clarify what this indication means</p>
          </div>

          <div className="mb-6">
            <label className="block mb-1">Color</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
              value={indicationForm.color || "blue"}
              onChange={e => setFormData({ ...indicationForm, color: e.target.value })}
            >
              <option value="blue">Blue (Stress, Anxiety)</option>
              <option value="green">Green (Energy, Vitality)</option>
              <option value="red">Red (Pain, Inflammation)</option>
              <option value="yellow">Yellow (Digestive, Liver)</option>
              <option value="purple">Purple (Sleep, Relaxation)</option>
              <option value="pink">Pink (Mood, Emotional)</option>
              <option value="indigo">Indigo (Focus, Cognitive)</option>
              <option value="gray">Gray (General, Neutral)</option>
              <option value="orange">Orange (Immune, Energy)</option>
              <option value="teal">Teal (Detox, Cleansing)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Color used for this indication tag on the website</p>
          </div>

          {/* Show associated herbs and supplements if editing */}
          {indicationFormMode === "edit" && indicationForm.id && (
            <>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-200">Associated Herbs</label>
                <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
                  {indicationForm.herbs && indicationForm.herbs.length > 0 ? (
                    indicationForm.herbs.map((herb, index) => (
                      <div key={herb.id} className="flex items-center justify-between mb-1">
                        <span className="text-gray-200">{herb.name}</span>
                        <span className="text-xs text-gray-400">{herb.latinName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No herbs associated with this indication yet</div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Herbs that use this indication tag</p>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-200">Associated Supplements</label>
                <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
                  {indicationForm.supplements && indicationForm.supplements.length > 0 ? (
                    indicationForm.supplements.map((supplement, index) => (
                      <div key={supplement.id} className="flex items-center justify-between mb-1">
                        <span className="text-gray-200">{supplement.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No supplements associated with this indication yet</div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Supplements that use this indication tag</p>
              </div>
            </>
          )}

          {/* Usage instructions */}
          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
            <h4 className="text-gray-300 font-semibold mb-2">Next Steps</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• After creating this indication, you can assign it to herbs and supplements</li>
              <li>• Go to the "Herbs" or "Supplements" tab to add this indication to specific items</li>
              <li>• The indication will appear as a colored tag on herb/supplement cards</li>
              <li>• Users can click on indication tags to see all related herbs/supplements</li>
            </ul>
          </div>
        </>
      );
    }
    // Fallback for other tabs
    return (
      <>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
            value={(formData as { name?: string }).name || ""}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
            value={(formData as { description?: string }).description || ""}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        <div className="mb-6">
          <Link href="/admin" className="cta-button px-4 py-2 rounded shadow hover:bg-green-700 transition font-bold">&larr; Admin Home</Link>
        </div>

      {/* Tabs for Herbs, Supplements, Symptoms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t}
              className={`px-6 py-4 font-semibold text-gray-700 border-b-2 transition-colors ${tab === t ? 'border-green-600 text-green-700 bg-green-50' : 'border-transparent hover:text-green-700 hover:bg-gray-50'}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "Blog" ? (
          <div>
            {/* Blog/Article Upload Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Blog/Article</h2>
              <form className="flex flex-col gap-4" onSubmit={handleUpload}>
                <input
                  type="text"
                  placeholder="Title"
                  className="border border-gray-300 px-3 py-2 rounded text-gray-900 bg-white placeholder-gray-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Admin Note (optional)"
                  className="border border-gray-300 px-3 py-2 rounded text-gray-900 bg-white placeholder-gray-500"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <input
                    type="file"
                    accept=".pdf,.docx,.md,.txt"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target && e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 px-3 py-2 rounded text-gray-900 bg-white"
                  />
                  <span className="text-gray-600">or</span>
                  <textarea
                    placeholder="Paste or write article content here (Markdown or plain text)"
                    className="border border-gray-300 px-3 py-2 rounded text-gray-900 bg-white placeholder-gray-500 w-full"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <button type="submit" className="cta-button px-6 py-2 rounded shadow hover:bg-green-700 transition font-bold w-40">Upload</button>
              </form>
            </section>

            {/* Uploaded Articles List */}
            {articles.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Uploaded Articles</h2>
                <ul className="divide-y divide-gray-200">
                  {articles.map((article, index) => (
                    <li key={index} className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="font-bold text-lg text-gray-900">{article.title}</div>
                          <div className="text-gray-600 text-sm">Uploaded: {article.uploadDate}</div>
                          {article.adminNote && <div className="text-gray-600 text-sm italic">Note: {article.adminNote}</div>}
                          {article.fileName && <div className="text-gray-500 text-xs">File: {article.fileName}</div>}
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition font-bold"
                            onClick={() => {
                              setEditingIndex(index);
                              setEditContent(article.content as string);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 transition font-bold"
                            onClick={() => handleArticleDelete(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {/* Article Content Editor */}
                      {editingIndex === index ? (
                        <div className="mt-4">
                          <textarea
                            className="border border-gray-300 px-3 py-2 rounded text-gray-900 bg-white w-full"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={8}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              className="cta-button px-4 py-1 rounded shadow hover:bg-green-700 transition font-bold"
                              onClick={() => handleEditSave(index)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-300 text-gray-800 px-4 py-1 rounded shadow hover:bg-gray-400 transition font-bold"
                              onClick={() => setEditingIndex(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <>
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
                
                {/* Indications Help Section */}
                {tab === "Indications" && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-blue-800 font-semibold mb-2">What are Indications?</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      Indications are tags that describe what herbs and supplements are used for. They help users find relevant products 
                      and create a consistent tagging system across your site.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Examples:</h4>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Stress, Anxiety, Sleep Support</li>
                          <li>• Focus, Memory, Cognitive Health</li>
                          <li>• Energy, Vitality, Fatigue</li>
                          <li>• Pain Relief, Inflammation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">How to Use:</h4>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Create indications here first</li>
                          <li>• Then assign them to herbs/supplements</li>
                          <li>• They appear as colored tags on cards</li>
                          <li>• Users can click tags to see related items</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border border-gray-700 rounded bg-gray-800">
                  <div className="overflow-x-auto">
                    <div className="max-h-[60vh] overflow-y-auto">
                      <table className="w-full text-left min-w-full">
                        <thead className="sticky top-0 bg-gray-800 z-10">{renderTableHeaders()}</thead>
                        <tbody>
                          {[...data].sort((a, b) => {
                            const aName = 'name' in a ? a.name : 'title' in a ? a.title : '';
                            const bName = 'name' in b ? b.name : 'title' in b ? b.title : '';
                            return aName.localeCompare(bName);
                          }).map((item, index) => renderTableRow(item, index))}
                          {data.length === 0 && (
                            <tr>
                              <td colSpan={tab === "Herbs" ? HERB_FIELDS.length + 2 : tab === "Supplements" ? SUPPLEMENT_FIELDS.length + 1 : SYMPTOM_FIELDS.length + 1} className="p-4 text-center text-gray-400">No {tab.toLowerCase()} found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <form id="add-edit-form" className="p-8 overflow-y-auto flex-1" onSubmit={handleFormSubmit}>
              <h2 className="text-2xl font-bold mb-4 text-white">{formMode === "add" ? `Add New ${tab.slice(0, -1)}` : `Edit ${tab.slice(0, -1)}`}</h2>
              {renderFormFields()}
            </form>
            <div className="p-8 pt-0 border-t border-gray-700">
              <div className="flex gap-4">
                <button type="submit" form="add-edit-form" className="bg-green-700 text-white px-6 py-2 rounded font-bold">Save</button>
                <button type="button" className="bg-gray-500 text-white px-6 py-2 rounded font-bold" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variant Management Modal */}
      {showVariantModal && selectedSymptom && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  Manage Variants for: {selectedSymptom.title}
                </h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowVariantModal(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-4 flex justify-between items-center">
                <button
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white font-bold"
                  onClick={() => openVariantForm("add")}
                >
                  + Add New Variant
                </button>
              </div>

              {/* Variants Table */}
              <div className="border border-gray-700 rounded bg-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-white">Actions</th>
                        <th className="px-4 py-2 text-white">ID</th>
                        <th className="px-4 py-2 text-white">Name</th>
                        <th className="px-4 py-2 text-white">Slug</th>
                        <th className="px-4 py-2 text-white">Description</th>
                        <th className="px-4 py-2 text-white">Meta Title</th>
                        <th className="px-4 py-2 text-white">Cautions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => (
                        <tr key={variant.id} className="border-t border-gray-700">
                          <td className="px-4 py-2">
                            <div className="flex gap-1">
                              <button
                                className="px-2 py-1 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-colors"
                                onClick={() => openVariantForm("edit", variant)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-2 py-1 bg-red-500 rounded text-xs hover:bg-red-600 transition-colors"
                                onClick={() => handleVariantDelete(variant.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-white text-sm">{variant.id}</td>
                          <td className="px-4 py-2 text-white text-sm">{variant.name}</td>
                          <td className="px-4 py-2 text-white text-sm">{variant.slug}</td>
                          <td className="px-4 py-2 text-white text-sm max-w-[200px] truncate">
                            {variant.description || '—'}
                          </td>
                          <td className="px-4 py-2 text-white text-sm max-w-[200px] truncate">
                            {variant.metaTitle || '—'}
                          </td>
                          <td className="px-4 py-2 text-white text-sm max-w-[200px] truncate">
                            {variant.cautions || '—'}
                          </td>
                        </tr>
                      ))}
                      {variants.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-gray-400">
                            No variants found for this symptom.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variant Form Modal */}
      {showVariantForm && selectedSymptom && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                {variantFormMode === "add" ? "Add New Variant" : "Edit Variant"}
              </h2>
            </div>
            
            <form id="variant-form" onSubmit={handleVariantFormSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-white">Name *</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={variantFormData.name || ""}
                    onChange={(e) => setVariantFormData({ ...variantFormData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Slug *</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={variantFormData.slug || ""}
                    onChange={(e) => setVariantFormData({ ...variantFormData, slug: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Description</label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    rows={4}
                    value={variantFormData.description || ""}
                    onChange={(e) => setVariantFormData({ ...variantFormData, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Meta Title</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={variantFormData.metaTitle || ""}
                    onChange={(e) => setVariantFormData({ ...variantFormData, metaTitle: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Meta Description</label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    rows={2}
                    value={variantFormData.metaDescription || ""}
                    onChange={(e) => setVariantFormData({ ...variantFormData, metaDescription: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Cautions</label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    rows={3}
                    value={variantFormData.cautions || ""}
                    onChange={(e) => setVariantFormData({ ...variantFormData, cautions: e.target.value })}
                  />
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-4">
                <button
                  type="submit"
                  form="variant-form"
                  className="bg-green-700 text-white px-6 py-2 rounded font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded font-bold"
                  onClick={() => setShowVariantForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indication Form Modal */}
      {showIndicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                {indicationFormMode === "add" ? "Add New Indication" : "Edit Indication"}
              </h2>
            </div>
            
            <form id="indication-form" onSubmit={handleIndicationFormSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-white">Name *</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={indicationFormData.name || ""}
                    onChange={(e) => setIndicationFormData({ ...indicationFormData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Slug *</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={indicationFormData.slug || ""}
                    onChange={(e) => setIndicationFormData({ ...indicationFormData, slug: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Description</label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    rows={4}
                    value={indicationFormData.description || ""}
                    onChange={(e) => setIndicationFormData({ ...indicationFormData, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Color</label>
                  <select
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={indicationFormData.color || "blue"}
                    onChange={(e) => setIndicationFormData({ ...indicationFormData, color: e.target.value })}
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                    <option value="indigo">Indigo</option>
                    <option value="gray">Gray</option>
                    <option value="orange">Orange</option>
                    <option value="teal">Teal</option>
                  </select>
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-4">
                <button
                  type="submit"
                  form="indication-form"
                  className="bg-green-700 text-white px-6 py-2 rounded font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded font-bold"
                  onClick={() => setShowIndicationForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}

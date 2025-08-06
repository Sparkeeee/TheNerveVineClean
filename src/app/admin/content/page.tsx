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

// Add interface for Product
interface Product {
  id: number;
  name: string;
  description?: string;
  merchantId: number;
  affiliateLink: string;
  price?: number;
  currency: string;
  region?: string;
  imageUrl?: string;
  qualityScore?: number;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  affiliateRate?: number;
  affiliateYield?: number;
  merchant?: Merchant;
  herbs?: Herb[];
  supplements?: Supplement[];
  symptoms?: Symptom[];
}

// Add interface for Merchant
interface Merchant {
  id: number;
  name: string;
  apiSource?: string;
  logoUrl?: string;
  websiteUrl?: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  defaultAffiliateRate?: number;
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

const TABS = ["Herbs", "Supplements", "Symptoms", "Indications", "Products", "Blog"];

const HERB_FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "latinName", label: "Latin Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description", required: true },
  { key: "comprehensiveArticle", label: "Comprehensive Article (Markdown)" },
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
  { key: "description", label: "Description", required: true },
  { key: "comprehensiveArticle", label: "Comprehensive Article (Markdown)" },
  { key: "cautions", label: "Cautions" },
  { key: "heroImageUrl", label: "Hero Image URL" },
  { key: "cardImageUrl", label: "Card Image URL" },
  { key: "galleryImages", label: "Gallery Images (JSON)" },
  { key: "metaTitle", label: "Meta Title" },
  { key: "metaDescription", label: "Meta Description" },
  { key: "productFormulations", label: "Product Formulations (JSON)" },
  { key: "references", label: "References (JSON)" },
];

const SYMPTOM_FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "comprehensiveArticle", label: "Comprehensive Article (Markdown)" },
  { key: "metaTitle", label: "Meta Title" },
  { key: "metaDescription", label: "Meta Description" },
  { key: "cautions", label: "Cautions" },
  { key: "articles", label: "Articles (JSON)" },
  { key: "associatedSymptoms", label: "Associated Symptoms (JSON)" },
  { key: "references", label: "References (JSON)" },
];

const PRODUCT_FIELDS = [
  { key: "name", label: "Product Name", required: true },
  { key: "description", label: "Description" },
  { key: "merchantId", label: "Merchant ID", required: true },
  { key: "affiliateLink", label: "Affiliate Link", required: true },
  { key: "price", label: "Price" },
  { key: "currency", label: "Currency", required: true },
  { key: "region", label: "Region" },
  { key: "imageUrl", label: "Image URL" },
  { key: "qualityScore", label: "Quality Score (1-10)" },
  { key: "affiliateRate", label: "Affiliate Rate (%)" },
  { key: "affiliateYield", label: "Affiliate Yield" },
];

function getFormattedDate() {
  return new Date().toISOString().slice(0, 10);
}

// Helper function to convert complex reference strings to JSON format
function convertReferencesToJson(referencesText: string): Array<{ type: string; value: string }> {
  if (!referencesText.trim()) return [];

  // If it's already JSON, try to parse it
  if (referencesText.trim().startsWith('[')) {
    try {
      return JSON.parse(referencesText);
    } catch {
      // If JSON parsing fails, treat as complex reference string
    }
  }

  const references: Array<{ type: string; value: string }> = [];

  // First, try to split by numbered references (1., 2., 3., etc.)
  // Use a regex that captures prefix, number, and content
  const numberedMatches = referencesText.match(/(.*?)(?:\s*|^)(\d+)\.\s+([^]*?)(?=(?:\s*|^)\d+\.\s+|$)/g);
  
  if (numberedMatches && numberedMatches.length > 0) {
    // We have numbered references, process each one
    numberedMatches.forEach((match) => {
      // Use exec to get capture groups
      const execResult = /(.*?)(?:\s*|^)(\d+)\.\s+([^]*?)(?=(?:\s*|^)\d+\.\s+|$)/g.exec(match);
      if (execResult) {
        const prefix = execResult[1]?.trim() || '';
        const number = execResult[2];
        const content = execResult[3]?.trim() || '';
        
        if (content) {
          let type = 'study';
          let value = '';

          // Combine prefix and content, preserving the prefix
          if (prefix) {
            value = `${prefix} ${number}. ${content}`;
          } else {
            value = `${number}. ${content}`;
          }

          // Determine type based on content
          if (value.includes('Journal Article')) {
            type = 'journal';
          } else if (value.includes('Book Chapter')) {
            type = 'book';
          } else if (value.includes('10.')) {
            type = 'doi';
          }

          // Clean up the value
          value = value.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
          
          // Add line breaks before numbered references (integer followed by period and then a letter)
          // This differentiates from DOIs which have more integers after the period
          value = value.replace(/\s+(\d+)\.\s+(?=[A-Za-z])/g, '\n$1. ');

          references.push({ type, value });
        }
      }
    });
  } else {
    // No numbered references, try to split by type sections
    const journalArticleMatch = referencesText.match(/Journal Article[•\s]*([\s\S]*?)(?=Book Chapter|$)/);
    const bookChapterMatch = referencesText.match(/Book Chapter[•\s]*([\s\S]*?)(?=Journal Article|$)/);
    
    // Process Journal Article section
    if (journalArticleMatch) {
      const journalContent = journalArticleMatch[1].trim();
      if (journalContent) {
        // Split by numbered references within journal section
        const journalRefs = journalContent.split(/\d+\.\s+/).filter(ref => ref.trim().length > 0);
        journalRefs.forEach(ref => {
          const cleanedRef = ref.trim().replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
          if (cleanedRef) {
            references.push({ 
              type: 'journal', 
              value: cleanedRef
            });
          }
        });
      }
    }

    // Process Book Chapter section
    if (bookChapterMatch) {
      const bookContent = bookChapterMatch[1].trim();
      if (bookContent) {
        // Split by numbered references within book section
        const bookRefs = bookContent.split(/\d+\.\s+/).filter(ref => ref.trim().length > 0);
        bookRefs.forEach(ref => {
          const cleanedRef = ref.trim().replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
          if (cleanedRef) {
            references.push({ 
              type: 'book', 
              value: cleanedRef
            });
          }
        });
      }
    }
  }

  return references;
}

// Helper function to convert JSON references back to simple format for display
function convertReferencesToSimple(references: Array<{ type: string; value: string }> | string | undefined): string {
  if (!references) return '';
  
  if (typeof references === 'string') {
    try {
      const parsed = JSON.parse(references);
      if (Array.isArray(parsed)) {
        return parsed.map(ref => ref.value).join(', ');
      }
    } catch {
      return references;
    }
  }
  
  if (Array.isArray(references)) {
    return references.map(ref => ref.value).join(', ');
  }
  
  return '';
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

function getProductFieldValue(product: Product, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(product, key)) {
    return (product as unknown as Record<string, unknown>)[key];
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

  // Add format preservation and preview functionality
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  // Function to preserve formatting from SciSpace documents
  const preserveFormatting = (content: string): string => {
    return content
      // Preserve line breaks
      .replace(/\n/g, '\n')
      // Preserve bold formatting
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      // Preserve italic formatting  
      .replace(/\*(.*?)\*/g, '*$1*')
      // Preserve headers
      .replace(/^# (.*$)/gm, '# $1')
      .replace(/^## (.*$)/gm, '## $1')
      .replace(/^### (.*$)/gm, '### $1')
      // Preserve lists
      .replace(/^[-*] (.*$)/gm, '- $1')
      .replace(/^\d+\. (.*$)/gm, '$&')
      // Preserve code blocks
      .replace(/```([\s\S]*?)```/g, '```$1```')
      // Preserve inline code
      .replace(/`(.*?)`/g, '`$1`')
      // Preserve links
      .replace(/\[(.*?)\]\((.*?)\)/g, '[$1]($2)')
      // Preserve blockquotes
      .replace(/^> (.*$)/gm, '> $1')
      // Preserve interactive citations from SciSpace - improved to handle "et al." and multiple authors
      .replace(/\(([^)]+)\)/g, (match, citation) => {
        // Check if this looks like a citation (author, year format) - improved regex
        // Handles: "Author, Year", "Author et al., Year", "Author & Author, Year"
        // Also handles special characters like hyphens and accented characters
        if (/^[A-Za-zÀ-ÿ\s&\-]+(?:\s+et\s+al\.)?,\s+\d{4}$/.test(citation.trim())) {
          // Create a safe ID by removing special characters and converting to lowercase
          const safeId = citation.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          return `[${citation}](#citation-${safeId})`;
        }
        return match;
      });
  };

  // Function to create citation references section
  const createCitationReferences = (content: string): string => {
    const citations = content.match(/\[([^]]+)\]\(#citation-[^)]+\)/g) || [];
    const uniqueCitations = [...new Set(citations)];
    
    if (uniqueCitations.length === 0) return content;
    
    let referencesSection = '\n\n## References\n\n';
    uniqueCitations.forEach((citation, index) => {
      const citationText = citation.match(/\[([^]]+)\]/)?.[1] || '';
      referencesSection += `${index + 1}. ${citationText}\n`;
    });
    
    return content + referencesSection;
  };

  // Function to handle file upload with format preservation
  const handleFileUploadWithPreservation = async (file: File, fieldKey: string) => {
    const text = await file.text();
    const preservedText = preserveFormatting(text);
    const finalText = createCitationReferences(preservedText);
    
    if (tab === "Herbs") {
      const herbForm = formData as HerbForm;
      setFormData({ ...herbForm, [fieldKey]: finalText });
    } else if (tab === "Supplements") {
      const supplementForm = formData as SupplementForm;
      setFormData({ ...supplementForm, [fieldKey]: finalText });
    } else if (tab === "Symptoms") {
      const symptomForm = formData as SymptomForm;
      setFormData({ ...symptomForm, [fieldKey]: finalText });
    }
  };

  // Function to show preview
  const showContentPreview = () => {
    let content = "";
    if (tab === "Herbs") {
      const herbForm = formData as HerbForm;
      content = herbForm.comprehensiveArticle || "";
    } else if (tab === "Supplements") {
      const supplementForm = formData as SupplementForm;
      content = supplementForm.comprehensiveArticle || "";
    } else if (tab === "Symptoms") {
      const symptomForm = formData as SymptomForm;
      content = symptomForm.comprehensiveArticle || "";
    }
    setPreviewContent(content);
    setShowPreview(true);
  };

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
    description: string;
    comprehensiveArticle?: string;
    cautions?: string;
    heroImageUrl?: string;
    cardImageUrl?: string;
    galleryImages?: string;
    metaTitle?: string;
    metaDescription?: string;
    productFormulations?: ProductFormulation[];
    references?: string;
    [key: string]: unknown;
  };
  type SupplementForm = {
    name?: string;
    slug?: string;
    description: string;
    comprehensiveArticle?: string;
    cautions?: string;
    heroImageUrl?: string;
    cardImageUrl?: string;
    galleryImages?: string;
    metaTitle?: string;
    metaDescription?: string;
    productFormulations?: ProductFormulation[];
    references?: string;
    [key: string]: unknown;
  };
  type SymptomForm = {
    title: string;
    slug?: string;
    description?: string;
    comprehensiveArticle?: string;
    metaTitle?: string;
    metaDescription?: string;
    cautions?: string;
    articles?: string;
    associatedSymptoms?: string;
    references?: string;
    [key: string]: unknown;
  };

  type ProductForm = {
    name: string;
    description?: string;
    merchantId: number;
    affiliateLink: string;
    price?: number;
    currency: string;
    region?: string;
    imageUrl?: string;
    qualityScore?: number;
    affiliateRate?: number;
    affiliateYield?: number;
    selectedHerbs?: number[];
    selectedSupplements?: number[];
    selectedSymptoms?: number[];
    [key: string]: unknown;
  };

  type FormDataType = HerbForm | SupplementForm | SymptomForm | ProductForm | Record<string, unknown>;
  const [formData, setFormData] = useState<FormDataType>({});
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  // Add state for allHerbs and allSupplements
  const [allHerbs, setAllHerbs] = useState<Herb[]>([]);
  const [allSupplements, setAllSupplements] = useState<Supplement[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
                  const [showBatchImport, setShowBatchImport] = useState(false);
                const [batchUrls, setBatchUrls] = useState('');
                const [importing, setImporting] = useState(false);
                const [useScraping, setUseScraping] = useState(false);

  // Batch import function
  const handleBatchImport = async () => {
    if (!batchUrls.trim()) return;
    
    setImporting(true);
    const urls = batchUrls.split('\n').map(url => url.trim()).filter(url => url);
    
    try {
                        const response = await fetch('/api/products/batch-import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urls, useScraping })
                  });
      
      const result = await response.json();
      if (result.success) {
        alert(`Successfully imported ${result.data.importedCount} products`);
        setBatchUrls('');
        setShowBatchImport(false);
        fetchProducts();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Batch import error:', error);
      alert('Import failed. Check console for details.');
    } finally {
      setImporting(false);
    }
  };

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
    if (tab === "Products") {
      fetchMerchants();
      fetchAllHerbs();
      fetchAllSupplements();
      fetchSymptoms();
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

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const response = await res.json();
      const productsArray = response.data?.products || response.products || response || [];
      if (!Array.isArray(productsArray)) {
        console.error('Products data is not an array:', productsArray);
        setData([]);
      } else {
        setData(productsArray);
      }
    } catch {
      setData([]);
    }
  }

  async function fetchMerchants() {
    try {
      const res = await fetch("/api/merchants");
      if (!res.ok) throw new Error("Failed to fetch merchants");
      const response = await res.json();
      const merchantsArray = response.data?.merchants || response.merchants || response || [];
      if (!Array.isArray(merchantsArray)) {
        console.error('Merchants data is not an array:', merchantsArray);
        setAllMerchants([]);
      } else {
        setAllMerchants(merchantsArray);
      }
    } catch {
      setAllMerchants([]);
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
      let items: Herb[] | Supplement[] | Symptom[] | Indication[] | Product[] = [];
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
      // Initialize with default values for required fields
      const defaultFormData: Record<string, unknown> = {};
      
      if (tab === "Herbs") {
        defaultFormData.name = "";
        defaultFormData.description = "";
      } else if (tab === "Supplements") {
        defaultFormData.name = "";
        defaultFormData.description = "";
      } else if (tab === "Symptoms") {
        defaultFormData.title = "";
      } else if (tab === "Products") {
        defaultFormData.name = "";
        defaultFormData.description = "";
        defaultFormData.merchantId = "";
        defaultFormData.affiliateLink = "";
        defaultFormData.price = "";
        defaultFormData.currency = "USD";
        defaultFormData.region = "";
        defaultFormData.imageUrl = "";
        defaultFormData.qualityScore = "";
        defaultFormData.affiliateRate = "";
        defaultFormData.affiliateYield = "";
      }
      
      setFormData(defaultFormData);
      setShowForm(true);
    }
  }

  function openEditForm(item: Herb | Supplement | Symptom | Indication | Product) {
    if (tab === "Indications") {
      setIndicationFormMode("edit");
      setIndicationFormData(item as Indication);
      setShowIndicationForm(true);
      return;
    }
    
    setFormMode("edit");
    
    // Parse JSON fields that come from the database
    const processedItem = { ...item } as Record<string, unknown>;
    

    
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
        const parsed = JSON.parse(processedItem.references as string);
        // Convert back to simple format for display
        processedItem.references = convertReferencesToSimple(parsed);
      } catch {
        processedItem.references = '';
      }
    } else if (Array.isArray(processedItem.references)) {
      // Convert array format back to simple format for display
      processedItem.references = convertReferencesToSimple(processedItem.references);
    } else if (!processedItem.references) {
      processedItem.references = '';
    }
    
    // Handle articles and associatedSymptoms for symptoms
    if (tab === "Symptoms") {
      if (processedItem.articles && typeof processedItem.articles === 'string') {
        try {
          const parsed = JSON.parse(processedItem.articles as string);
          processedItem.articles = Array.isArray(parsed) ? parsed.join(', ') : processedItem.articles;
        } catch {
          processedItem.articles = processedItem.articles;
        }
      } else if (Array.isArray(processedItem.articles)) {
        processedItem.articles = processedItem.articles.join(', ');
      } else if (!processedItem.articles) {
        processedItem.articles = '';
      }
      
      if (processedItem.associatedSymptoms && typeof processedItem.associatedSymptoms === 'string') {
        try {
          const parsed = JSON.parse(processedItem.associatedSymptoms as string);
          processedItem.associatedSymptoms = Array.isArray(parsed) ? parsed.join(', ') : processedItem.associatedSymptoms;
        } catch {
          processedItem.associatedSymptoms = processedItem.associatedSymptoms;
        }
      } else if (Array.isArray(processedItem.associatedSymptoms)) {
        processedItem.associatedSymptoms = processedItem.associatedSymptoms.join(', ');
      } else if (!processedItem.associatedSymptoms) {
        processedItem.associatedSymptoms = '';
      }
    }
    
    // Ensure all string fields are properly initialized
    const finalFormData = {
      ...processedItem,
      heroImageUrl: processedItem.heroImageUrl || '',
      cardImageUrl: processedItem.cardImageUrl || '',
      metaTitle: processedItem.metaTitle || '',
      metaDescription: processedItem.metaDescription || '',
      galleryImages: processedItem.galleryImages || '',
      name: processedItem.name || '',
      latinName: processedItem.latinName || '',
      slug: processedItem.slug || '',
      title: processedItem.title || '',
      description: processedItem.description || '',
      comprehensiveArticle: processedItem.comprehensiveArticle || '',
      cautions: processedItem.cautions || '',
      articles: processedItem.articles || '',
      associatedSymptoms: processedItem.associatedSymptoms || '',
      // Product-specific fields
      merchantId: processedItem.merchantId || '',
      affiliateLink: processedItem.affiliateLink || '',
      price: processedItem.price || '',
      currency: processedItem.currency || 'USD',
      region: processedItem.region || '',
      imageUrl: processedItem.imageUrl || '',
      qualityScore: processedItem.qualityScore || '',
      affiliateRate: processedItem.affiliateRate || '',
      affiliateYield: processedItem.affiliateYield || '',
    };

    // Remove any non-existent fields that might be present
    delete (finalFormData as any).strength;
    delete (finalFormData as any).formulation;
    delete (finalFormData as any).affiliatePercentage;
    delete (finalFormData as any).customerReviews;
    delete (finalFormData as any).organic;
    
    // Remove symptom-specific fields that don't exist in Prisma schema
    delete (finalFormData as any).variants;
    delete (finalFormData as any).variantDescriptions;
    delete (finalFormData as any).products;


    
    setFormData(finalFormData);
    setShowForm(true);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = "/api/" + tab.toLowerCase();
    const method = formMode === "add" ? "POST" : "PUT";
    
    // Process form data before sending
    const processedData = { ...formData };
    
    // Remove any non-existent fields that might be present
    delete (processedData as any).strength;
    delete (processedData as any).formulation;
    delete (processedData as any).affiliatePercentage;
    delete (processedData as any).customerReviews;
    delete (processedData as any).organic;
    
    // Remove symptom-specific fields that don't exist in Prisma schema
    delete (processedData as any).variants;
    delete (processedData as any).variantDescriptions;
    delete (processedData as any).products;
    delete (processedData as any).selectedHerbs;
    delete (processedData as any).selectedSupplements;
    
    // Remove herb-specific fields that don't exist in Prisma schema
    delete (processedData as any).articles;
    delete (processedData as any).associatedSymptoms;
    
    // Convert references from simple format to JSON if present
    if (processedData.references && typeof processedData.references === 'string') {
      processedData.references = convertReferencesToJson(processedData.references as string);
    }
    
                // Convert articles and associatedSymptoms from string to JSON if present (only for symptoms)
            if (tab === "Symptoms") {
              if (processedData.articles && typeof processedData.articles === 'string') {
                try {
                  processedData.articles = JSON.parse(processedData.articles as string);
                } catch {
                  // If it's not valid JSON, treat it as a simple string array and convert to JSON
                  const articlesString = processedData.articles as string;
                  const articlesArray = articlesString.split(',').map(item => item.trim()).filter(item => item.length > 0);
                  processedData.articles = articlesArray;
                }
              } else if (!processedData.articles || processedData.articles === '') {
                // Ensure empty strings are converted to empty arrays
                processedData.articles = [];
              }

              if (processedData.associatedSymptoms && typeof processedData.associatedSymptoms === 'string') {
                try {
                  processedData.associatedSymptoms = JSON.parse(processedData.associatedSymptoms as string);
                } catch {
                  // If it's not valid JSON, treat it as a simple string array and convert to JSON
                  const symptomsString = processedData.associatedSymptoms as string;
                  const symptomsArray = symptomsString.split(',').map(item => item.trim()).filter(item => item.length > 0);
                  processedData.associatedSymptoms = symptomsArray;
                }
              } else if (!processedData.associatedSymptoms || processedData.associatedSymptoms === '') {
                // Ensure empty strings are converted to empty arrays
                processedData.associatedSymptoms = [];
              }
            }
    
    console.log('Submitting form data:', {
      url,
      method,
      tab,
      formMode,
      processedData
    });
    
    // Debug: Log the exact data being sent for symptoms
    if (tab === "Symptoms") {
      console.log('Symptom form data being sent:', JSON.stringify(processedData, null, 2));
      console.log('Symptom form data types:', Object.entries(processedData).map(([key, value]) => `${key}: ${typeof value}`));
      console.log('Articles field type and value:', typeof processedData.articles, processedData.articles);
      console.log('AssociatedSymptoms field type and value:', typeof processedData.associatedSymptoms, processedData.associatedSymptoms);
    }
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to save ${tab.slice(0, -1)}: ${res.status} ${errorText}`);
      }
      
      const result = await res.json();
      console.log('Success response:', result);
      
      setShowForm(false);
      await fetchData();
    } catch (error) {
      console.error('Form submission error:', error);
      setError(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    if (tab === "Products") {
      return (
        <tr>
          <th className="px-2 py-1 text-xs">Actions</th>
          <th className="px-2 py-1 text-xs">ID</th>
          {PRODUCT_FIELDS.map((f) => (
            <th key={f.key} className="px-2 py-1 text-xs">{f.label}</th>
          ))}
          <th className="px-2 py-1 text-xs">Associated Herbs</th>
          <th className="px-2 py-1 text-xs">Associated Supplements</th>
          <th className="px-2 py-1 text-xs">Associated Symptoms</th>
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

  function renderTableRow(item: Herb | Supplement | Symptom | Product, index: number) {
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
    if (tab === "Products") {
      const productItem = item as Product;
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
          {PRODUCT_FIELDS.map((f) => {
            const value = getProductFieldValue(productItem, f.key);
            return (
              <td key={f.key} className="px-2 py-1 text-xs max-w-[180px] truncate">
                {f.key === "name"
                  ? productItem.name || '—'
                  : f.key === "merchantId"
                  ? productItem.merchant?.name || `Merchant ${productItem.merchantId}`
                  : f.key === "price"
                  ? productItem.price ? `${productItem.price} ${productItem.currency}` : '—'
                  : f.key === "affiliateRate"
                  ? productItem.affiliateRate ? `${productItem.affiliateRate}%` : '—'
                  : f.key === "qualityScore"
                  ? productItem.qualityScore ? `${productItem.qualityScore}/10` : '—'
                  : (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
                    ? value
                    : value === true ? 'Yes' : value === false ? 'No' : '—'}
              </td>
            );
          })}
          <td className="px-2 py-1 text-xs">
            {productItem.herbs && productItem.herbs.length > 0 ? (
              <div className="max-w-[150px]">
                <div className="font-semibold text-green-300">{productItem.herbs.length} herb(s)</div>
                <div className="text-xs text-gray-400 max-h-12 overflow-y-auto">
                  {productItem.herbs.slice(0, 3).map(herb => (
                    <div key={herb.id} className="truncate">• {herb.name}</div>
                  ))}
                  {productItem.herbs.length > 3 && (
                    <div className="text-gray-500">... and {productItem.herbs.length - 3} more</div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">No herbs</span>
            )}
          </td>
          <td className="px-2 py-1 text-xs">
            {productItem.supplements && productItem.supplements.length > 0 ? (
              <div className="max-w-[150px]">
                <div className="font-semibold text-blue-300">{productItem.supplements.length} supplement(s)</div>
                <div className="text-xs text-gray-400 max-h-12 overflow-y-auto">
                  {productItem.supplements.slice(0, 3).map(supplement => (
                    <div key={supplement.id} className="truncate">• {supplement.name}</div>
                  ))}
                  {productItem.supplements.length > 3 && (
                    <div className="text-gray-500">... and {productItem.supplements.length - 3} more</div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">No supplements</span>
            )}
          </td>
          <td className="px-2 py-1 text-xs">
            {productItem.symptoms && productItem.symptoms.length > 0 ? (
              <div className="max-w-[150px]">
                <div className="font-semibold text-purple-300">{productItem.symptoms.length} symptom(s)</div>
                <div className="text-xs text-gray-400 max-h-12 overflow-y-auto">
                  {productItem.symptoms.slice(0, 3).map(symptom => (
                    <div key={symptom.id} className="truncate">• {symptom.title}</div>
                  ))}
                  {productItem.symptoms.length > 3 && (
                    <div className="text-gray-500">... and {productItem.symptoms.length - 3} more</div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">No symptoms</span>
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
          if (f.key === "description" || f.key === "cautions" || f.key === "references" || f.key === "comprehensiveArticle") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                                  <textarea
                    className={`w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 ${f.key === 'description' || f.key === 'references' || f.key === 'comprehensiveArticle' ? 'h-64' : ''}`}
                    value={f.key === 'references' ? (typeof herbForm[f.key] === 'string' ? herbForm[f.key] : '') : (typeof herbForm[f.key] === 'string' ? herbForm[f.key] : '')}
                    onChange={e => setFormData({ ...herbForm, [f.key]: e.target.value })}
                    placeholder={f.key === 'references' ? 'Enter references separated by commas or numbered format (e.g., &quot;1. Study A, 2. Study B&quot;)' : f.key === 'comprehensiveArticle' ? 'Enter comprehensive article content in Markdown format...' : undefined}
                  />
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 mr-2"
                  onClick={() => document.getElementById(`herb-file-${f.key}`)?.click()}
                >
                  Import from File
                </button>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={showContentPreview}
                >
                  Preview
                </button>
                <input
                  id={`herb-file-${f.key}`}
                  type="file"
                  accept=".txt,.html,.md"
                  className="hidden"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    await handleFileUploadWithPreservation(file, f.key);
                  }}
                />
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
                {f.key === 'references' && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Enter references separated by commas or numbered format. The system will automatically detect reference types (journal, book, doi, study).</p>
                    <p className="mt-1">Example format: &quot;1. Study A, 2. Study B&quot; or &quot;Journal Article•DOI 1. Study A, 2. Study B&quot;</p>
                  </div>
                )}
                {f.key === 'comprehensiveArticle' && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>This content will appear in the &quot;View Here&quot; modal and &quot;Full Page View&quot; for comprehensive scientific research.</p>
                    <p className="mt-1">Use Markdown format: # Headers, **bold**, - lists, etc. Include the main title in the content.</p>
                  </div>
                )}
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

      </>;
    }
    if (tab === "Supplements") {
      const supplementForm = formData as SupplementForm;
      return <>
        {SUPPLEMENT_FIELDS.map((f) => {
          if (f.key === "description" || f.key === "cautions" || f.key === "references" || f.key === "comprehensiveArticle") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                                  <textarea
                    className={`w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 ${f.key === 'description' || f.key === 'references' || f.key === 'comprehensiveArticle' ? 'h-64' : ''}`}
                    value={f.key === 'references' ? (typeof supplementForm[f.key] === 'string' ? supplementForm[f.key] : '') : (typeof supplementForm[f.key] === 'string' ? supplementForm[f.key] : '')}
                    onChange={e => setFormData({ ...supplementForm, [f.key]: e.target.value })}
                    placeholder={f.key === 'references' ? 'Enter references separated by commas or numbered format (e.g., &quot;1. Study A, 2. Study B&quot;)' : f.key === 'comprehensiveArticle' ? 'Enter comprehensive article content in Markdown format...' : undefined}
                  />
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 mr-2"
                  onClick={() => document.getElementById(`supplement-file-${f.key}`)?.click()}
                >
                  Import from File
                </button>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={showContentPreview}
                >
                  Preview
                </button>
                <input
                  id={`supplement-file-${f.key}`}
                  type="file"
                  accept=".txt,.html,.md"
                  className="hidden"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    await handleFileUploadWithPreservation(file, f.key);
                  }}
                />
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
                {f.key === 'references' && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Enter references separated by commas or numbered format. The system will automatically detect reference types (journal, book, doi, study).</p>
                    <p className="mt-1">Example format: &quot;1. Study A, 2. Study B&quot; or &quot;Journal Article•DOI 1. Study A, 2. Study B&quot;</p>
                  </div>
                )}
                {f.key === 'comprehensiveArticle' && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>This content will appear in the &quot;View Here&quot; modal and &quot;Full Page View&quot; for comprehensive scientific research.</p>
                    <p className="mt-1">Use Markdown format: # Headers, **bold**, - lists, etc. Include the main title in the content.</p>
                  </div>
                )}
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

      </>;
    }
    if (tab === "Symptoms") {
      const symptomForm = formData as SymptomForm;
      return <>
        {SYMPTOM_FIELDS.map((f) => {
          if (f.key === "description" || f.key === "cautions" || f.key === "references" || f.key === "comprehensiveArticle") {
            return (
              <div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                                  <textarea
                    className={`w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 ${f.key === 'description' || f.key === 'references' || f.key === 'comprehensiveArticle' ? 'h-64' : ''}`}
                    value={f.key === 'references' ? (typeof symptomForm[f.key] === 'string' ? symptomForm[f.key] : '') : (typeof symptomForm[f.key] === 'string' ? symptomForm[f.key] : '')}
                    onChange={e => setFormData({ ...symptomForm, [f.key]: e.target.value })}
                    placeholder={f.key === 'references' ? 'Enter references separated by commas or numbered format (e.g., &quot;1. Study A, 2. Study B&quot;)' : f.key === 'comprehensiveArticle' ? 'Enter comprehensive article content in Markdown format...' : undefined}
                  />
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 mr-2"
                  onClick={() => document.getElementById(`symptom-file-${f.key}`)?.click()}
                >
                  Import from File
                </button>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={showContentPreview}
                >
                  Preview
                </button>
                <input
                  id={`symptom-file-${f.key}`}
                  type="file"
                  accept=".txt,.html,.md"
                  className="hidden"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (!file) return;
                    await handleFileUploadWithPreservation(file, f.key);
                  }}
                />
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
                {f.key === 'references' && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Enter references separated by commas or numbered format. The system will automatically detect reference types (journal, book, doi, study).</p>
                    <p className="mt-1">Example format: &quot;1. Study A, 2. Study B&quot; or &quot;Journal Article•DOI 1. Study A, 2. Study B&quot;</p>
                  </div>
                )}
                {f.key === 'comprehensiveArticle' && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>This content will appear in the &quot;View Here&quot; modal and &quot;Full Page View&quot; for comprehensive scientific research.</p>
                    <p className="mt-1">Use Markdown format: # Headers, **bold**, - lists, etc. Include the main title in the content.</p>
                  </div>
                )}
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
                  checked={(symptomForm.selectedHerbs as number[] || []).includes(herb.id)}
                  onChange={e => {
                    const selected = new Set(symptomForm.selectedHerbs as number[] || []);
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
                  checked={(symptomForm.selectedSupplements as number[] || []).includes(supp.id)}
                  onChange={e => {
                    const selected = new Set(symptomForm.selectedSupplements as number[] || []);
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
              Indications are tags that describe what herbs and supplements are used for (e.g., &quot;Stress&quot;, &quot;Anxiety&quot;, &quot;Insomnia&quot;). 
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
              <li>• Go to the &quot;Herbs&quot; or &quot;Supplements&quot; tab to add this indication to specific items</li>
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
  if (tab === "Products") {
    const productForm = formData as ProductForm;
    return <>
      {PRODUCT_FIELDS.map((f) => {
        if (f.key === "description") {
          return (
            <div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <textarea
                className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 h-32"
                value={String(productForm[f.key] ?? '')}
                onChange={e => setFormData({ ...productForm, [f.key]: e.target.value })}
                placeholder="Product description..."
              />
            </div>
          );
        }
        if (f.key === "merchantId") {
          return (
            <div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <select
                className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                value={String(productForm[f.key] ?? '')}
                onChange={e => setFormData({ ...productForm, [f.key]: e.target.value })}
                required={!!f.required}
              >
                <option value="">Select a merchant</option>
                {allMerchants.map((merchant) => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.name} ({merchant.region})
                  </option>
                ))}
              </select>
            </div>
          );
        }
        if (f.key === "currency") {
          return (
            <div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <select
                className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
                value={String(productForm[f.key] ?? 'USD')}
                onChange={e => setFormData({ ...productForm, [f.key]: e.target.value })}
                required={!!f.required}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
          );
        }
        return (
          <div className="mb-4" key={f.key}>
            <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
            <input
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
              type={f.key === "price" || f.key === "qualityScore" || f.key === "affiliateRate" || f.key === "affiliateYield" ? "number" : "text"}
              value={String(productForm[f.key] ?? '')}
              onChange={e => setFormData({ ...productForm, [f.key]: e.target.value })}
              required={!!f.required}
              placeholder={f.key === "price" ? "0.00" : f.key === "qualityScore" ? "1-10" : f.key === "affiliateRate" ? "0.00" : f.key === "affiliateYield" ? "0.00" : ""}
              step={f.key === "price" || f.key === "affiliateRate" || f.key === "affiliateYield" ? "0.01" : f.key === "qualityScore" ? "1" : undefined}
              min={f.key === "qualityScore" ? "1" : f.key === "price" || f.key === "affiliateRate" || f.key === "affiliateYield" ? "0" : undefined}
              max={f.key === "qualityScore" ? "10" : undefined}
            />
          </div>
        );
      })}

      {/* Relationship Selection */}
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <h3 className="text-blue-300 font-semibold mb-4">Link to Content</h3>
        
        {/* Herbs Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-200">Associated Herbs</label>
          <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {allHerbs.length > 0 ? allHerbs.map((herb) => (
              <div key={herb.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`herb-${herb.id}`}
                  checked={productForm.selectedHerbs?.includes(herb.id) || false}
                  onChange={(e) => {
                    const selectedHerbs = productForm.selectedHerbs || [];
                    if (e.target.checked) {
                      setFormData({ ...productForm, selectedHerbs: [...selectedHerbs, herb.id] });
                    } else {
                      setFormData({ ...productForm, selectedHerbs: selectedHerbs.filter(id => id !== herb.id) });
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`herb-${herb.id}`} className="text-gray-200 cursor-pointer">
                  {herb.name} {herb.latinName && `(${herb.latinName})`}
                </label>
              </div>
            )) : <div className="text-gray-400">Loading herbs...</div>}
          </div>
        </div>

        {/* Supplements Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-200">Associated Supplements</label>
          <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {allSupplements.length > 0 ? allSupplements.map((supp) => (
              <div key={supp.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`supp-${supp.id}`}
                  checked={productForm.selectedSupplements?.includes(supp.id) || false}
                  onChange={(e) => {
                    const selectedSupplements = productForm.selectedSupplements || [];
                    if (e.target.checked) {
                      setFormData({ ...productForm, selectedSupplements: [...selectedSupplements, supp.id] });
                    } else {
                      setFormData({ ...productForm, selectedSupplements: selectedSupplements.filter(id => id !== supp.id) });
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`supp-${supp.id}`} className="text-gray-200 cursor-pointer">
                  {supp.name}
                </label>
              </div>
            )) : <div className="text-gray-400">Loading supplements...</div>}
          </div>
        </div>

        {/* Symptoms Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-200">Associated Symptoms</label>
          <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {allSymptoms.length > 0 ? allSymptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`symptom-${symptom.id}`}
                  checked={productForm.selectedSymptoms?.includes(symptom.id) || false}
                  onChange={(e) => {
                    const selectedSymptoms = productForm.selectedSymptoms || [];
                    if (e.target.checked) {
                      setFormData({ ...productForm, selectedSymptoms: [...selectedSymptoms, symptom.id] });
                    } else {
                      setFormData({ ...productForm, selectedSymptoms: selectedSymptoms.filter(id => id !== symptom.id) });
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`symptom-${symptom.id}`} className="text-gray-200 cursor-pointer">
                  {symptom.title}
                </label>
              </div>
            )) : <div className="text-gray-400">Loading symptoms...</div>}
          </div>
        </div>
      </div>
    </>;
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
                  <span className="text-gray-800">or</span>
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
                          <div className="text-gray-800 text-sm">Uploaded: {article.uploadDate}</div>
                          {article.adminNote && <div className="text-gray-800 text-sm italic">Note: {article.adminNote}</div>}
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
                {tab === "Products" && (
                  <div className="mb-4 flex gap-2">
                    <button
                      className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                      onClick={() => setShowBatchImport(true)}
                    >
                      📥 Batch Import
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                      onClick={openAddForm}
                    >
                      + Add New {tab.slice(0, -1)}
                    </button>
                  </div>
                )}
                {tab !== "Products" && (
                  <button
                    className="mb-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                    onClick={openAddForm}
                  >
                    + Add New {tab.slice(0, -1)}
                  </button>
                )}
                
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

      {/* Batch Import Modal */}
      {showBatchImport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Batch Import Products</h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-gray-300 mb-4">
                Enter product URLs (one per line) from supported merchants. The system will attempt to extract product information automatically.
              </p>
              <textarea
                value={batchUrls}
                onChange={(e) => setBatchUrls(e.target.value)}
                placeholder="https://amazon.com/product1&#10;https://amazon.com/product2&#10;https://amazon.com/product3"
                className="w-full h-32 p-2 border rounded mb-4 bg-gray-700 text-gray-100 border-gray-600"
              />
              <div className="mb-4">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    id="useScraping"
                    className="mr-2"
                    onChange={(e) => setUseScraping(e.target.checked)}
                  />
                  Enable web scraping for better data extraction (requires Puppeteer)
                </label>
              </div>
              <div className="text-xs text-gray-400 mb-4">
                <p>• Supported merchants: Amazon, iHerb, Vitacost, etc.</p>
                <p>• Each URL should be on a separate line</p>
                <p>• The system will create merchants automatically if they don't exist</p>
                <p>• Web scraping extracts real product data (prices, images, descriptions)</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBatchImport(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBatchImport}
                  disabled={importing || !batchUrls.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {importing ? 'Importing...' : 'Import Products'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Content Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Content Preview</h2>
              <button
                type="button"
                className="text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-white text-gray-900 p-6 rounded-lg max-w-none">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: previewContent
                      .replace(/\n/g, '<br>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2">$1</h3>')
                      .replace(/^[-*] (.*$)/gm, '<li class="mb-1">$1</li>')
                      .replace(/^\d+\. (.*$)/gm, '<li class="mb-1">$1</li>')
                      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
                      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded font-bold"
                  onClick={() => setShowPreview(false)}
                >
                  Close Preview
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

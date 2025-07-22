"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useState } from "react";
import React from 'react';
import Link from 'next/link';
const TABS = ["Herbs", "Supplements", "Symptoms"];
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
function getFormattedDate() {
    return new Date().toISOString().slice(0, 10);
}
function getHerbFieldValue(herb, key) {
    if (Object.prototype.hasOwnProperty.call(herb, key)) {
        return herb[key];
    }
    return undefined;
}
function getSupplementFieldValue(supp, key) {
    if (Object.prototype.hasOwnProperty.call(supp, key)) {
        return supp[key];
    }
    return undefined;
}
export default function AdminContentPage() {
    // Blog/article upload state
    const [articles, setArticles] = useState([]);
    const [title, setTitle] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [file, setFile] = useState(null);
    const [textContent, setTextContent] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editContent, setEditContent] = useState("");
    // Handle file upload and/or text entry
    const handleUpload = (e) => {
        e.preventDefault();
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setArticles((prev) => {
                    var _a, _b;
                    return [
                        ...prev,
                        {
                            title,
                            adminNote,
                            uploadDate: new Date().toLocaleString(),
                            content: (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result) !== null && _b !== void 0 ? _b : null,
                            fileName: file ? file.name : null,
                        },
                    ];
                });
            };
            reader.readAsText(file);
        }
        else if (textContent.trim()) {
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
    const handleEditSave = (idx) => {
        setArticles((prev) => prev.map((a, i) => (i === idx ? Object.assign(Object.assign({}, a), { content: editContent }) : a)));
        setEditingIndex(null);
        setEditContent("");
    };
    const [tab, setTab] = useState("Herbs");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [formData, setFormData] = useState({});
    const [allSymptoms, setAllSymptoms] = useState([]);
    // Add state for allHerbs and allSupplements
    const [allHerbs, setAllHerbs] = useState([]);
    const [allSupplements, setAllSupplements] = useState([]);
    // Fetch all herbs and supplements when Symptoms tab is active
    useEffect(() => {
        if (tab === "Symptoms") {
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
    function fetchSymptoms() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch("/api/symptoms");
                if (!res.ok)
                    throw new Error("Failed to fetch symptoms");
                const items = yield res.json();
                setAllSymptoms(items);
            }
            catch (_a) {
                setAllSymptoms([]);
            }
        });
    }
    function fetchAllHerbs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch("/api/herbs");
                if (!res.ok)
                    throw new Error("Failed to fetch herbs");
                const items = yield res.json();
                setAllHerbs(items);
            }
            catch (_a) {
                setAllHerbs([]);
            }
        });
    }
    function fetchAllSupplements() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch("/api/supplements");
                if (!res.ok)
                    throw new Error("Failed to fetch supplements");
                const items = yield res.json();
                setAllSupplements(items);
            }
            catch (_a) {
                setAllSupplements([]);
            }
        });
    }
    function fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            setLoading(true);
            setError("");
            const url = "/api/" + tab.toLowerCase();
            try {
                const res = yield fetch(url);
                if (!res.ok)
                    throw new Error("Failed to fetch " + tab);
                const items = yield res.json();
                setData(items);
            }
            catch (_a) {
                setError('An error occurred');
                setData([]);
            }
            finally {
                setLoading(false);
            }
        });
    }
    function openAddForm() {
        setFormMode("add");
        setFormData({});
        setShowForm(true);
    }
    function openEditForm(item) {
        setFormMode("edit");
        setFormData(Object.assign({}, item));
        setShowForm(true);
    }
    function handleFormSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            setLoading(true);
            setError("");
            const url = "/api/" + tab.toLowerCase();
            const method = formMode === "add" ? "POST" : "PUT";
            try {
                const res = yield fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (!res.ok)
                    throw new Error("Failed to save " + tab.slice(0, -1));
                setShowForm(false);
                yield fetchData();
            }
            catch (_a) {
                setError('An error occurred');
            }
            finally {
                setLoading(false);
            }
        });
    }
    function handleDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.confirm("Are you sure you want to delete this entry?"))
                return;
            setLoading(true);
            setError("");
            const url = "/api/" + tab.toLowerCase();
            try {
                const res = yield fetch(url, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                });
                if (!res.ok)
                    throw new Error("Failed to delete " + tab.slice(0, -1));
                yield fetchData();
            }
            catch (_a) {
                setError('An error occurred');
            }
            finally {
                setLoading(false);
            }
        });
    }
    // Render fields for herbs or fallback to old logic for other tabs
    function renderTableHeaders() {
        if (tab === "Herbs") {
            return (<tr>
          <th className="p-2">ID</th>
          {HERB_FIELDS.map((f) => (<th key={f.key} className="p-2">{f.label}</th>))}
          <th className="p-2">Indications</th>
          <th className="p-2">Actions</th>
        </tr>);
        }
        if (tab === "Supplements") {
            return (<tr>
          <th className="p-2">ID</th>
          {SUPPLEMENT_FIELDS.map((f) => (<th key={f.key} className="p-2">{f.label}</th>))}
          <th className="p-2">Actions</th>
        </tr>);
        }
        // Fallback for other tabs
        return (<tr>
        <th className="p-2">ID</th>
        <th className="p-2">Name</th>
        <th className="p-2">Description</th>
        <th className="p-2">Actions</th>
      </tr>);
    }
    function renderTableRow(item) {
        let itemAny;
        if (tab === "Herbs") {
            itemAny = item;
            return (<tr key={item.id} className="border-t border-gray-700">
          <td className="p-2">{item.id}</td>
          {HERB_FIELDS.map((f) => {
                    const value = getHerbFieldValue(itemAny, f.key);
                    return (<td key={f.key} className="p-2 text-xs max-w-[180px] truncate">
                {f.key === "name"
                            ? itemAny.name || '—'
                            : (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
                                ? value
                                : '—'}
              </td>);
                })}
          <td className="p-2">
            {item.indications && item.indications.length > 0 ? (<div className="flex flex-wrap gap-1">
                {item.indications.map((sym) => (<span key={sym} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700">
                    {sym}
                  </span>))}
              </div>) : (<span className="text-gray-500">(none)</span>)}
          </td>
          <td className="p-2 space-x-2">
            <button className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600" onClick={() => openEditForm(item)}>
              Edit
            </button>
            <button className="px-2 py-1 bg-red-500 rounded hover:bg-red-600" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </td>
        </tr>);
        }
        if (tab === "Supplements") {
            itemAny = item;
            return (<tr key={item.id} className="border-t border-gray-700">
          <td className="p-2">{item.id}</td>
          {SUPPLEMENT_FIELDS.map((f) => {
                    const value = getSupplementFieldValue(itemAny, f.key);
                    return (<td key={f.key} className="p-2 text-xs max-w-[180px] truncate">
                {(typeof value === "string" || typeof value === "number" || typeof value === "boolean")
                            ? value
                            : value === true ? 'Yes' : value === false ? 'No' : '—'}
              </td>);
                })}
          <td className="p-2 space-x-2">
            <button className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600" onClick={() => openEditForm(item)}>
              Edit
            </button>
            <button className="px-2 py-1 bg-red-500 rounded hover:bg-red-600" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </td>
        </tr>);
        }
        // Fallback for other tabs
        itemAny = item;
        return (<tr key={item.id} className="border-t border-gray-700">
        <td className="p-2">{item.id}</td>
        <td className="p-2">{item.name}</td>
        <td className="p-2">{item.description || <span className="text-gray-500">(none)</span>}</td>
        <td className="p-2 space-x-2">
          <button className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600" onClick={() => openEditForm(item)}>
            Edit
          </button>
          <button className="px-2 py-1 bg-red-500 rounded hover:bg-red-600" onClick={() => handleDelete(item.id)}>
            Delete
          </button>
        </td>
      </tr>);
    }
    function renderFormFields() {
        if (tab === "Herbs") {
            const herbForm = formData;
            return <>
        {HERB_FIELDS.map((f) => {
                    var _a;
                    if (f.key === "description" || f.key === "cautions") {
                        return (<div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                <textarea className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={herbForm[f.key] || ""} onChange={e => setFormData(Object.assign(Object.assign({}, herbForm), { [f.key]: e.target.value }))}/>
                <input type="file" accept=".txt,.html,.md" className="mt-2" onChange={(e) => {
                                const file = e.target.files ? e.target.files[0] : null;
                                if (!file)
                                    return;
                                const text = file.text();
                                setFormData(Object.assign(Object.assign({}, herbForm), { [f.key]: text }));
                            }}/>
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
              </div>);
                    }
                    return (<div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <input className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={String((_a = herbForm[f.key]) !== null && _a !== void 0 ? _a : '')} onChange={e => setFormData(Object.assign(Object.assign({}, herbForm), { [f.key]: e.target.value }))} required={!!f.required}/>
            </div>);
                })}
        <div className="mb-4">
          <label className="block mb-1">Indications (Symptoms)</label>
          <select multiple className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 h-32" value={herbForm.indications || []} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                    setFormData(Object.assign(Object.assign({}, herbForm), { indications: selected.map(s => s.toString()) }));
                }}>
            {allSymptoms.map(sym => (<option key={sym.id} value={sym.id}>{sym.name}</option>))}
          </select>
          {Array.isArray(herbForm.indications) && herbForm.indications.length > 0 && (<div className="flex flex-wrap gap-1 mt-2">
              {herbForm.indications.map((id) => {
                        const sym = allSymptoms.find(s => s.id === Number(id));
                        return sym ? (<span key={id} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700">
                    {sym.name}
                  </span>) : null;
                    })}
            </div>)}
        </div>
      </>;
        }
        if (tab === "Supplements") {
            const supplementForm = formData;
            return <>
        {SUPPLEMENT_FIELDS.map((f) => {
                    var _a;
                    if (f.key === "description" || f.key === "cautions") {
                        return (<div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
                <textarea className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={supplementForm[f.key] || ""} onChange={e => setFormData(Object.assign(Object.assign({}, supplementForm), { [f.key]: e.target.value }))}/>
                <button type="button" className="mt-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => { var _a; return (_a = document.getElementById(`supplement-file-${f.key}`)) === null || _a === void 0 ? void 0 : _a.click(); }}>
                  Import from File
                </button>
                <input id={`supplement-file-${f.key}`} type="file" accept=".txt,.html,.md" className="hidden" onChange={(e) => __awaiter(this, void 0, void 0, function* () {
                                const file = e.target.files ? e.target.files[0] : null;
                                if (!file)
                                    return;
                                const text = file.text();
                                setFormData(Object.assign(Object.assign({}, supplementForm), { [f.key]: text }));
                            })}/>
                <span className="text-xs text-gray-400">Upload .txt, .html, or .md to import content</span>
              </div>);
                    }
                    if (f.key === "organic") {
                        return (<div className="mb-4" key={f.key}>
                <label className="block mb-1">{f.label}</label>
                <select className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={supplementForm[f.key] === true ? 'true' : supplementForm[f.key] === false ? 'false' : ''} onChange={e => setFormData(Object.assign(Object.assign({}, supplementForm), { [f.key]: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined }))}>
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>);
                    }
                    return (<div className="mb-4" key={f.key}>
              <label className="block mb-1">{f.label}{f.required && <span className="text-red-400">*</span>}</label>
              <input className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={String((_a = supplementForm[f.key]) !== null && _a !== void 0 ? _a : '')} onChange={e => setFormData(Object.assign(Object.assign({}, supplementForm), { [f.key]: e.target.value }))} required={!!f.required}/>
            </div>);
                })}
        {(tab === "Herbs" || tab === "Supplements") && (<div className="mb-4">
            <label className="block mb-1">Product Formulations</label>
            {(supplementForm.productFormulations || []).map((form, index) => (<div key={index} className="border border-gray-600 rounded p-3 mb-2 bg-gray-900">
                <input className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600" placeholder="Name" value={form.name || ""} onChange={e => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr[index].name = e.target.value;
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}/>
                <input className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600" placeholder="Type (e.g. tincture, extract, cream)" value={form.type || ""} onChange={e => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr[index].type = e.target.value;
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}/>
                <input className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600" placeholder="Affiliate Link" value={form.affiliateLink || ""} onChange={e => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr[index].affiliateLink = e.target.value;
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}/>
                <input className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600" placeholder="Price" value={form.price || ""} onChange={e => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr[index].price = e.target.value;
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}/>
                <input className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600" placeholder="Quality Criteria (free text)" value={form.qualityCriteria || ""} onChange={e => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr[index].qualityCriteria = e.target.value;
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}/>
                <input className="w-full p-2 mb-2 rounded bg-gray-700 text-gray-100 border border-gray-600" placeholder="Tags (comma separated, e.g. organic, >4 stars)" value={Array.isArray(form.tags) ? form.tags.join(', ') : ''} onChange={e => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr[index].tags = e.target.value.split(',').map(tag => tag.trim());
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}/>
                <button type="button" className="px-2 py-1 bg-red-700 rounded hover:bg-red-800 text-xs" onClick={() => {
                            const arr = [...(supplementForm.productFormulations || [])];
                            arr.splice(index, 1);
                            setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: arr }));
                        }}>Remove</button>
              </div>))}
            <button type="button" className="px-3 py-1 bg-green-700 rounded hover:bg-green-800 text-xs mt-2" onClick={() => setFormData(Object.assign(Object.assign({}, supplementForm), { productFormulations: [...(supplementForm.productFormulations || []), { type: '', qualityCriteria: '', tags: [], affiliateLink: '', price: '', name: '' }] }))}>+ Add Product Formulation</button>
          </div>)}
      </>;
        }
        if (tab === "Symptoms") {
            const symptomForm = formData;
            return <>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={symptomForm.name || ""} onChange={e => setFormData(Object.assign(Object.assign({}, symptomForm), { name: e.target.value }))} required/>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={symptomForm.description || ""} onChange={e => setFormData(Object.assign(Object.assign({}, symptomForm), { description: e.target.value }))}/>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Select Herbs to Display</label>
          <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {allHerbs.map((herb) => {
                    var _a;
                    return (<div key={herb.id} className="flex items-center mb-2">
                <input type="checkbox" checked={(symptomForm.selectedHerbs || []).includes(herb.id)} onChange={e => {
                            const selected = new Set(symptomForm.selectedHerbs || []);
                            if (e.target.checked)
                                selected.add(herb.id);
                            else
                                selected.delete(herb.id);
                            setFormData(Object.assign(Object.assign({}, symptomForm), { selectedHerbs: Array.from(selected) }));
                        }}/>
                <span className="ml-2 font-bold">{herb.name}</span>
                <span className="ml-2 text-xs text-gray-400">{(_a = herb.productFormulations) === null || _a === void 0 ? void 0 : _a.map((f) => `${f.type || '—'} (${f.qualityCriteria || '—'})`).join(', ')}</span>
              </div>);
                })}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Select Supplements to Display</label>
          <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900">
            {allSupplements.map((supp) => {
                    var _a;
                    return (<div key={supp.id} className="flex items-center mb-2">
                <input type="checkbox" checked={(symptomForm.selectedSupplements || []).includes(supp.id)} onChange={e => {
                            const selected = new Set(symptomForm.selectedSupplements || []);
                            if (e.target.checked)
                                selected.add(supp.id);
                            else
                                selected.delete(supp.id);
                            setFormData(Object.assign(Object.assign({}, symptomForm), { selectedSupplements: Array.from(selected) }));
                        }}/>
                <span className="ml-2 font-bold">{supp.name}</span>
                <span className="ml-2 text-xs text-gray-400">{(_a = supp.productFormulations) === null || _a === void 0 ? void 0 : _a.map((f) => `${f.type || '—'} (${f.qualityCriteria || '—'})`).join(', ')}</span>
              </div>);
                })}
          </div>
        </div>
      </>;
        }
        // Fallback for other tabs
        return (<>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={formData.name || ""} onChange={e => setFormData(Object.assign(Object.assign({}, formData), { name: e.target.value }))} required/>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600" value={formData.description || ""} onChange={e => setFormData(Object.assign(Object.assign({}, formData), { description: e.target.value }))}/>
        </div>
      </>);
    }
    return (<div className="min-h-screen text-gray-100 p-8 relative" style={{
            backgroundImage: "linear-gradient(rgba(20,20,20,0.85), rgba(20,20,20,0.85)), url('/images/Ancient_Apothecary_Organized_Shelves_(10157050846).jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
      <div className="mb-6">
        <Link href="/admin" className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition font-bold">&larr; Admin Home</Link>
      </div>

      {/* Blog/Article Upload Section */}
      <section className="bg-gray-800 rounded shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Upload Blog/Article</h2>
        <form className="flex flex-col gap-4" onSubmit={handleUpload}>
          <input type="text" placeholder="Title" className="border border-white px-3 py-2 rounded text-white bg-transparent placeholder-white" value={title} onChange={(e) => setTitle(e.target.value)} required/>
          <textarea placeholder="Admin Note (optional)" className="border border-white px-3 py-2 rounded text-white bg-transparent placeholder-white" value={adminNote} onChange={(e) => setAdminNote(e.target.value)}/>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input type="file" accept=".pdf,.docx,.md,.txt" onChange={(e) => setFile(e.target && e.target.files ? e.target.files[0] : null)} className="border border-white px-3 py-2 rounded text-white bg-transparent"/>
            <span className="text-white">or</span>
            <textarea placeholder="Paste or write article content here (Markdown or plain text)" className="border border-white px-3 py-2 rounded text-white bg-transparent placeholder-white w-full" value={textContent} onChange={(e) => setTextContent(e.target.value)} rows={4}/>
          </div>
          <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800 transition font-bold w-40">Upload</button>
        </form>
      </section>

      {/* Uploaded Articles List */}
      {articles.length > 0 && (<section className="bg-gray-800 rounded shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Uploaded Articles</h2>
          <ul className="divide-y divide-white">
            {articles.map((article, index) => (<li key={index} className="py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-bold text-lg text-white">{article.title}</div>
                    <div className="text-white text-sm">Uploaded: {article.uploadDate}</div>
                    {article.adminNote && <div className="text-white text-sm italic">Note: {article.adminNote}</div>}
                    {article.fileName && <div className="text-white text-xs">File: {article.fileName}</div>}
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button className="bg-blue-700 text-white px-3 py-1 rounded shadow hover:bg-blue-800 transition font-bold" onClick={() => {
                    setEditingIndex(index);
                    setEditContent(article.content);
                }}>
                      Edit
                    </button>
                  </div>
                </div>
                {/* Article Content Editor */}
                {editingIndex === index ? (<div className="mt-4">
                    <textarea className="border border-white px-3 py-2 rounded text-white bg-transparent w-full" value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={8}/>
                    <div className="flex gap-2 mt-2">
                      <button className="bg-green-700 text-white px-4 py-1 rounded shadow hover:bg-green-800 transition font-bold" onClick={() => handleEditSave(index)}>
                        Save
                      </button>
                      <button className="bg-gray-300 text-gray-800 px-4 py-1 rounded shadow hover:bg-gray-400 transition font-bold" onClick={() => setEditingIndex(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>) : null}
              </li>))}
          </ul>
        </section>)}

      {/* Tabs for Herbs, Supplements, Symptoms */}
      <div className="flex space-x-4 mb-6">
        {TABS.map((t) => (<button key={t} className={`px-4 py-2 rounded-t font-bold text-white ${tab === t ? 'bg-gray-800' : 'bg-gray-600 hover:bg-gray-700'}`} onClick={() => setTab(t)}>
            {t}
          </button>))}
      </div>
      <div className="bg-gray-800 rounded-b shadow p-6 mb-8">
        {loading ? (<div>Loading {tab}...</div>) : error ? (<div className="text-red-400">{error}</div>) : (<div>
            <button className="mb-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700" onClick={openAddForm}>
              + Add New {tab.slice(0, -1)}
            </button>
            <table className="w-full text-left border border-gray-700 rounded bg-gray-800">
              <thead>{renderTableHeaders()}</thead>
              <tbody>
                {[...data].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(renderTableRow)}
                {data.length === 0 && (<tr>
                    <td colSpan={tab === "Herbs" ? HERB_FIELDS.length + 2 : tab === "Supplements" ? SUPPLEMENT_FIELDS.length + 1 : 4} className="p-4 text-center text-gray-400">No {tab.toLowerCase()} found.</td>
                  </tr>)}
              </tbody>
            </table>
          </div>)}
      </div>
      {showForm && (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form className="bg-gray-900 p-8 rounded shadow-lg w-full max-w-2xl" onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-bold mb-4 text-white">{formMode === "add" ? `Add New ${tab.slice(0, -1)}` : `Edit ${tab.slice(0, -1)}`}</h2>
            {renderFormFields()}
            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded font-bold">Save</button>
              <button type="button" className="bg-gray-500 text-white px-6 py-2 rounded font-bold" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>)}
    </div>);
}

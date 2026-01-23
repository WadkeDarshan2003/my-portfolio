
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Trash2, Save, Layout, Monitor, Edit3, ArrowLeft, Upload, X, Image as ImageIcon, Menu, PanelLeftClose, PanelLeftOpen, Rocket, CircleDashed, Loader2 } from 'lucide-react';
import { ProjectCard } from './ProjectPair';
import { ProjectDetail } from './ProjectDetail';
import { Toast, useToast } from './Toast';
import { CustomCursor } from './CustomCursor';
import { uploadFile } from '../src/services/storageService';

interface AdminPanelProps {
  projects: Project[];
  onAdd: (project: Project) => void;
  onUpdate: (project: Project) => void;
  onDelete: (id: number | string) => void;
  onExit: () => void;
}

const EMPTY_PROJECT: any = {
  id: 0,
  title: "",
  category: "",
  description: "",
  stack: [],
  duration: "",
  speciality: "",
  image: "",
  theme: "light",
  bgColor: "bg-[#F8FAFC]",
  hexColor: "#64748b",
  status: "draft",
  gallery: [],
  details: [],
  websiteUrl: "",
  sourceCodeUrl: ""
};

const THEME_OPTIONS = [
  { label: 'Slate', value: 'bg-[#F1F5F9]' },
  { label: 'Rose', value: 'bg-[#FFF1F2]' },
  { label: 'Violet', value: 'bg-[#F5F3FF]' },
  { label: 'Cyan', value: 'bg-[#ECFEFF]' },
  { label: 'Stone', value: 'bg-[#FAFAF9]' },
  { label: 'Teal', value: 'bg-[#F0FDFA]' },
  { label: 'Orange', value: 'bg-[#FFF7ED]' },
  { label: 'Green', value: 'bg-[#F0FFF4]' },
];

export const AdminPanel = ({ projects, onAdd, onUpdate, onDelete, onExit }: AdminPanelProps) => {
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<Project>(EMPTY_PROJECT);
  const [viewMode, setViewMode] = useState<'edit' | 'preview-card' | 'preview-page'>('edit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  // Load project into form
  const handleEdit = (project: Project) => {
    setFormData({ ...project });
    setEditingId(project.id);
    setViewMode('edit');
    // On mobile, close sidebar after selection to show editor
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreate = () => {
    const newId = Date.now(); // Use timestamp for new IDs
    setFormData({ ...EMPTY_PROJECT, id: newId });
    setEditingId(null);
    setViewMode('edit');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    toast.success("Project saved successfully!");
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(id);
      if (editingId === id) {
        setFormData(EMPTY_PROJECT);
        setEditingId(null);
        setViewMode('edit');
      }
    }
  };

  // --- Handlers ---

  const handleArrayInput = (field: keyof Project, value: string) => {
    const arr = value.split(',').map(item => item.trim());
    setFormData({ ...formData, [field]: arr });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsUploading(true);
        const path = `projects/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path);
        setFormData({ ...formData, image: url });
        toast.success("Main image uploaded!");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      setIsUploading(true);
      const newUrls: string[] = [];
      
      try {
        for (const file of files) {
          const path = `gallery/${Date.now()}_${file.name}`;
          const url = await uploadFile(file, path);
          newUrls.push(url);
        }
        
        setFormData({ 
          ...formData, 
          gallery: [...(formData.gallery || []), ...newUrls] 
        });
        toast.success(`${newUrls.length} gallery images uploaded!`);
      } catch (err) {
        toast.error("Error uploading gallery images");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(formData.gallery || [])];
    newGallery.splice(index, 1);
    setFormData({ ...formData, gallery: newGallery });
  };

  // Dynamic Content Handlers
  const addDetailSection = () => {
    setFormData({
      ...formData,
      details: [...(formData.details || []), { title: '', content: '' }]
    });
  };

  const removeDetailSection = (index: number) => {
    const newDetails = [...(formData.details || [])];
    newDetails.splice(index, 1);
    setFormData({ ...formData, details: newDetails });
  };

  const updateDetailSection = (index: number, field: 'title' | 'content', value: string) => {
    const newDetails = [...(formData.details || [])];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, details: newDetails });
  };

  return (
    <>
      <CustomCursor />
      <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans">
      
      {/* Sidebar - Collapsible */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0 md:w-0 md:border-r-0'}
        md:relative
      `}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 min-w-[18rem]">
          <h2 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layout size={18} /> CMS
          </h2>
          <button onClick={onExit} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider px-2 py-1 rounded hover:bg-red-50 transition-colors">Exit</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-w-[18rem]">
          {projects.map(p => (
            <div 
              key={p.id} 
              onClick={() => handleEdit(p)}
              className={`
                p-3 rounded-xl cursor-pointer transition-all duration-200 border group flex flex-col gap-1 relative
                ${editingId === p.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02] ring-1 ring-slate-900/10' 
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}
              `}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-bold text-sm ${editingId === p.id ? 'text-white' : 'text-slate-700'}`}>
                  {p.title || "Untitled Project"}
                </h3>
                {p.status === 'draft' && (
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide ${
                    editingId === p.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    Draft
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                 <p className={`text-[10px] truncate max-w-[140px] ${editingId === p.id ? 'text-slate-400' : 'text-slate-400'}`}>
                   {p.category || "No Category"}
                 </p>
                 {editingId === p.id && (
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse"></div>
                 )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 min-w-[18rem]">
          <button 
            onClick={handleCreate}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100 relative transition-all duration-300">
        
        {/* Mobile Sidebar Toggle (Floating) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Sidebar"
            title="Open Sidebar"
            className="md:hidden absolute bottom-6 left-6 z-50 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4 sm:gap-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="hidden md:flex p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
               title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
               {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div className="flex flex-col">
              <h1 className="font-bold text-slate-800 text-lg hidden sm:block leading-tight">
                {editingId ? 'Edit Project' : 'New Project'}
              </h1>
              {editingId && <span className="text-[10px] text-slate-400 font-mono hidden sm:block">ID: {editingId}</span>}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
             {/* View Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               <button 
                 onClick={() => setViewMode('edit')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'edit' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Edit3 size={14} /> <span className="hidden sm:inline">Editor</span>
               </button>
               <button 
                 onClick={() => setViewMode('preview-card')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'preview-card' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Layout size={14} /> <span className="hidden sm:inline">Card</span>
               </button>
               <button 
                 onClick={() => setViewMode('preview-page')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'preview-page' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Monitor size={14} /> <span className="hidden sm:inline">Page</span>
               </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
               {/* Status Toggle */}
               <div className="relative">
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                    aria-label="Project Status"
                    title="Project Status"
                    className={`appearance-none pl-8 pr-8 py-2 rounded-md text-sm font-medium border outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer transition-colors ${
                       formData.status === 'published' 
                       ? 'bg-green-50 border-green-200 text-green-700' 
                       : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${formData.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                     {formData.status === 'published' ? <Rocket size={14} /> : <CircleDashed size={14} />}
                  </div>
               </div>

               {editingId && (
                  <button 
                    onClick={() => handleDelete(formData.id)}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
               )}
               <button 
                 onClick={handleSave}
                 className="px-4 py-2 bg-slate-900 text-white rounded-md flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium"
               >
                 <Save size={16} /> <span className="hidden lg:inline">Save</span>
               </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'edit' && (
            <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 pb-20">
               {/* Form Fields */}
                <div className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="Project Name"
                        className="w-full text-3xl font-serif text-slate-900 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-2 bg-transparent transition-colors placeholder:text-slate-300"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>
                        <input 
                          type="text" 
                          value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          placeholder="e.g. Web App"
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-shadow shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Duration</label>
                        <input 
                          type="text" 
                          value={formData.duration} 
                          onChange={e => setFormData({...formData, duration: e.target.value})}
                          placeholder="e.g. 2 Weeks"
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-shadow shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Description (Card) */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Summary (Short Description)</label>
                    <textarea 
                      rows={4}
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief summary shown on the project card..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm leading-relaxed transition-shadow shadow-sm resize-none"
                    />
                  </div>

                  {/* Detailed Story (Dynamic Sections) */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                     <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-bold text-slate-800">Project Story</h3>
                          <span className="text-[10px] text-slate-400">Add detailed sections for the full project page</span>
                        </div>
                        <button 
                          onClick={addDetailSection}
                          className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 font-medium transition-colors"
                        >
                          <Plus size={14} /> Add Section
                        </button>
                     </div>
                     
                     <div className="space-y-4">
                        {(formData.details || []).map((section: { title: string; content: string }, idx: number) => (
                           <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 relative group hover:border-blue-200 transition-colors">
                              <button 
                                onClick={() => removeDetailSection(idx)}
                                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove Section"
                              >
                                <X size={14} />
                              </button>
                              <div className="space-y-3">
                                <input 
                                  type="text" 
                                  value={section.title}
                                  onChange={(e) => updateDetailSection(idx, 'title', e.target.value)}
                                  placeholder="Section Title (e.g. The Challenge)"
                                  className="w-full bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none text-sm font-bold text-slate-800 pb-1"
                                />
                                <textarea 
                                  rows={3}
                                  value={section.content}
                                  onChange={(e) => updateDetailSection(idx, 'content', e.target.value)}
                                  placeholder="Write your story content here..."
                                  className="w-full bg-white p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-100 outline-none text-sm text-slate-600 resize-none"
                                />
                              </div>
                           </div>
                        ))}
                        {(formData.details || []).length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                            No detail sections added yet.
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Tech & Highlight */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Specs</h3>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Key Highlight</label>
                       <input 
                          type="text" 
                          value={formData.speciality} 
                          onChange={e => setFormData({...formData, speciality: e.target.value})}
                          placeholder="e.g. Real-time Synchronization"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tech Stack (Comma Separated)</label>
                       <input 
                          type="text" 
                          value={formData.stack.join(', ')} 
                          onChange={e => handleArrayInput('stack', e.target.value)}
                          placeholder="React, TypeScript, Tailwind"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-600"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Website URL</label>
                       <input 
                          type="url" 
                          value={formData.websiteUrl || ''} 
                          onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                          placeholder="https://example.com"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-600"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Source Code URL</label>
                       <input 
                          type="url" 
                          value={formData.sourceCodeUrl || ''} 
                          onChange={e => setFormData({...formData, sourceCodeUrl: e.target.value})}
                          placeholder="https://github.com/username/repo"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-600"
                        />
                    </div>
                  </div>

                  {/* Visuals */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                     <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Visuals</h3>
                     
                     {/* Theme Picker */}
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Theme Color</label>
                        <div className="flex flex-wrap gap-3">
                           {THEME_OPTIONS.map((theme) => (
                             <button
                               key={theme.value}
                               onClick={() => setFormData({ ...formData, bgColor: theme.value })}
                               className={`w-8 h-8 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 relative ${theme.value} ${formData.bgColor === theme.value ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                               title={theme.label}
                             />
                           ))}
                           <div className="ml-2 flex items-center text-xs text-slate-400">
                             Selected: <span className="font-mono ml-1 text-slate-600">{THEME_OPTIONS.find(t => t.value === formData.bgColor)?.label || 'Custom'}</span>
                           </div>
                        </div>
                     </div>

                     {/* Main Image Upload */}
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Main Image</label>
                        <div className={`border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                          <input 
                            type="file" 
                            accept="image/*"
                            title="Upload Main Image"
                            aria-label="Upload Main Image"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                            onChange={handleMainImageUpload}
                            disabled={isUploading}
                          />
                          <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                            <span className="text-xs font-bold uppercase">{isUploading ? 'Uploading...' : 'Upload from Device'}</span>
                          </div>
                        </div>
                        {formData.image && (
                          <div className="mt-4 relative group rounded-lg overflow-hidden border border-slate-200 h-48 bg-slate-100">
                             <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                     </div>

                     {/* Gallery Upload */}
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Gallery Images</label>
                        <div className={`border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            title="Upload Gallery Images"
                            aria-label="Upload Gallery Images"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                            onChange={handleGalleryUpload}
                            disabled={isUploading}
                          />
                          <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <ImageIcon size={24} />}
                            <span className="text-xs font-bold uppercase">{isUploading ? 'Uploading...' : 'Upload Multiple'}</span>
                          </div>
                        </div>
                        
                        {/* Gallery Preview Grid */}
                        {formData.gallery && formData.gallery.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                             {formData.gallery.map((img: string, idx: number) => (
                               <div key={idx} className="aspect-square relative group rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                                 <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                 <button 
                                   onClick={() => removeGalleryImage(idx)}
                                   title="Remove Gallery Image"
                                   aria-label="Remove Gallery Image"
                                   className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                 >
                                   <X size={12} />
                                 </button>
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                  </div>

                </div>
            </div>
          )}

          {viewMode === 'preview-card' && (
             <div className="w-full min-h-full flex items-center justify-center p-8 bg-stone-200">
                <div className="w-full max-w-lg aspect-[4/5] md:aspect-square bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-300">
                   <ProjectCard project={formData} isPreview={true} />
                </div>
             </div>
          )}

          {viewMode === 'preview-page' && (
             <div className="w-full h-full bg-white">
                <ProjectDetail project={formData} onBack={() => setViewMode('edit')} isPreview={true} />
             </div>
          )}
        </div>

      </main>
      </div>

      {/* Toast Notifications */}
      <Toast messages={toast.messages} onRemove={toast.removeToast} />
    </>
  );
};

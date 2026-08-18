
import React, { useState } from 'react';
import { Project, AchievementCardData } from '../types';
import { Plus, Trash2, Save, Layout, Monitor, Edit3, ArrowLeft, Upload, X, Image as ImageIcon, Menu, PanelLeftClose, PanelLeftOpen, Rocket, CircleDashed, Loader2, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { ProjectCard } from './ProjectPair';
import { ProjectDetail } from './ProjectDetail';
import { ScrollCard } from './Achievement';
import { Toast, useToast } from './Toast';
import { CustomCursor } from './CustomCursor';
import { uploadFile } from '../src/services/storageService';

interface AdminPanelProps {
  projects: Project[];
  onAdd: (project: Project) => void | Promise<void>;
  onUpdate: (project: Project) => void | Promise<void>;
  onDelete: (id: number | string) => void | Promise<void>;
  achievements: AchievementCardData[];
  onAddAchievement: (achievement: AchievementCardData) => void | Promise<void>;
  onUpdateAchievement: (achievement: AchievementCardData) => void | Promise<void>;
  onDeleteAchievement: (id: number | string) => void | Promise<void>;
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
  bgColor: "bg-transparent",
  hexColor: "#64748b",
  status: "draft",
  gallery: [],
  details: [],
  websiteUrl: "",
  sourceCodeUrl: "",
};

const EMPTY_ACHIEVEMENT: any = {
  id: 0,
  type: "experience",
  eyebrow: "Experience",
  title: "",
  organization: "",
  period: "",
  location: "",
  description: "",
  highlights: [],
  issuer: "",
  issued: "",
  credentialId: "",
  website: "",
  skills: [],
  status: "draft",
  order: 0,
};


export const AdminPanel = ({ projects, onAdd, onUpdate, onDelete, achievements, onAddAchievement, onUpdateAchievement, onDeleteAchievement, onExit }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'achievements'>('projects');
  
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<any>(EMPTY_PROJECT);
  const [viewMode, setViewMode] = useState<'edit' | 'preview-card' | 'preview-page'>('edit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleTabChange = (tab: 'projects' | 'achievements') => {
    setActiveTab(tab);
    setEditingId(null);
    setFormData(tab === 'projects' ? EMPTY_PROJECT : EMPTY_ACHIEVEMENT);
    setViewMode('edit');
  };

  // Load item into form
  const handleEdit = (item: any) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setViewMode('edit');
    // On mobile, close sidebar after selection to show editor
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreate = () => {
    const newId = Date.now(); // Use timestamp for new IDs
    setFormData(activeTab === 'projects' ? { ...EMPTY_PROJECT, id: newId } : { ...EMPTY_ACHIEVEMENT, id: newId });
    setEditingId(null);
    setViewMode('edit');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSave = async () => {
    // Ensure formData has the correct ID
    const itemToSave = { ...formData, id: editingId || formData.id };
    setIsSaving(true);
    try {
      if (activeTab === 'projects') {
        if (editingId) {
          await onUpdate(itemToSave);
        } else {
          await onAdd(itemToSave);
        }
      } else {
        if (editingId) {
          await onUpdateAchievement(itemToSave);
        } else {
          await onAddAchievement(itemToSave);
        }
      }
      toast.success(`${activeTab === 'projects' ? 'Project' : 'Achievement'} saved successfully!`);
    } catch (error) {
      toast.error(`Failed to save ${activeTab === 'projects' ? 'project' : 'achievement'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab === 'projects' ? 'project' : 'achievement'}?`)) {
      setIsDeleting(true);
      try {
        if (activeTab === 'projects') {
          await onDelete(id);
        } else {
          await onDeleteAchievement(id);
        }
        if (editingId === id) {
          setFormData(activeTab === 'projects' ? EMPTY_PROJECT : EMPTY_ACHIEVEMENT);
          setEditingId(null);
          setViewMode('edit');
        }
        toast.success(`${activeTab === 'projects' ? 'Project' : 'Achievement'} deleted successfully!`);
      } catch (error) {
        toast.error(`Failed to delete ${activeTab === 'projects' ? 'project' : 'achievement'}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // --- Handlers ---

  const handleArrayInput = (field: keyof Project, value: string) => {
    const arr = value.split(',').map(item => item.trim());
    setFormData({ ...formData, [field]: arr });
  };

  const handleStringArrayInput = (field: 'highlights' | 'skills', value: string) => {
    const arr = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: arr });
  };

  const handleAchievementTypeChange = (type: AchievementCardData['type']) => {
    const eyebrow = type === 'experience' ? 'Experience' : type === 'education' ? 'Education' : 'Certification';
    setFormData({ ...formData, type, eyebrow });
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
      {(isSaving || isDeleting || isUploading) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-2 border border-slate-200 text-center">
            <Loader2 size={36} className="animate-spin text-slate-900 mb-2" />
            <p className="font-semibold text-slate-800 tracking-wide">
              {isSaving ? 'Syncing Changes' : isDeleting ? 'Removing Entry' : 'Processing Assets'}
            </p>
            <p className="text-sm text-slate-500">
              {isSaving ? 'Deploying your updates to the portfolio...' : 
               isDeleting ? 'Permanently deleting this record...' : 
               'Uploading media to storage...'}
            </p>
          </div>
        </div>
      )}
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
        
        <div className="p-2 border-b border-slate-100 flex items-center justify-center bg-white min-w-[18rem]">
          <div className="bg-slate-100 p-1 rounded-lg w-full flex">
            <button 
              onClick={() => handleTabChange('projects')}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'projects' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => handleTabChange('achievements')}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'achievements' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Achievements
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-w-[18rem]">
          {activeTab === 'projects' ? (
            projects.map(p => (
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
            ))
          ) : (
            achievements.map((a: AchievementCardData) => (
              <div 
                key={a.id} 
                onClick={() => handleEdit(a)}
                className={`
                  p-3 rounded-xl cursor-pointer transition-all duration-200 border group flex flex-col gap-1 relative
                  ${editingId === a.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02] ring-1 ring-slate-900/10' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}
                `}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-sm ${editingId === a.id ? 'text-white' : 'text-slate-700'}`}>
                    {a.title || "Untitled"}
                  </h3>
                  {a.status === 'draft' && (
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide ${
                      editingId === a.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1">
                   <div className="flex items-center gap-1.5">
                     {a.type === 'experience' && <Briefcase size={12} className={editingId === a.id ? 'text-slate-400' : 'text-slate-500'} />}
                     {a.type === 'education' && <GraduationCap size={12} className={editingId === a.id ? 'text-slate-400' : 'text-slate-500'} />}
                     {a.type === 'certification' && <ShieldCheck size={12} className={editingId === a.id ? 'text-slate-400' : 'text-slate-500'} />}
                     <p className={`text-[10px] capitalize ${editingId === a.id ? 'text-slate-400' : 'text-slate-400'}`}>
                       {a.type}
                     </p>
                   </div>
                   {editingId === a.id && (
                     <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse"></div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 min-w-[18rem]">
          <button 
            onClick={handleCreate}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={16} /> New {activeTab === 'projects' ? 'Project' : 'Achievement'}
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
                {editingId 
                  ? (activeTab === 'projects' ? 'Edit Project' : 'Edit Achievement') 
                  : (activeTab === 'projects' ? 'New Project' : 'New Achievement')}
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
                    disabled={isDeleting}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Project"
                  >
                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
               )}
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="px-4 py-2 bg-slate-900 text-white rounded-md flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} <span className="hidden lg:inline">{isSaving ? 'Saving...' : 'Save'}</span>
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
                  {activeTab === 'achievements' ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Achievement title"
                            className="w-full text-3xl font-serif text-slate-900 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-2 bg-transparent transition-colors placeholder:text-slate-300"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Type</label>
                            <select
                              value={formData.type || 'experience'}
                              onChange={e => handleAchievementTypeChange(e.target.value as AchievementCardData['type'])}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-shadow shadow-sm"
                            >
                              <option value="experience">Experience</option>
                              <option value="education">Education</option>
                              <option value="certification">Certification</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Eyebrow</label>
                            <input
                              type="text"
                              value={formData.eyebrow || ''}
                              onChange={e => setFormData({ ...formData, eyebrow: e.target.value })}
                              placeholder="Experience"
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-shadow shadow-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Order</label>
                            <input
                              type="number"
                              value={formData.order ?? 0}
                              onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-shadow shadow-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {formData.type === 'certification' ? (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Certification Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Issuer</label>
                              <input
                                type="text"
                                value={formData.issuer || ''}
                                onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                placeholder="Issuer name"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Issued</label>
                              <input
                                type="text"
                                value={formData.issued || ''}
                                onChange={e => setFormData({ ...formData, issued: e.target.value })}
                                placeholder="May 2026"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Credential ID</label>
                              <input
                                type="text"
                                value={formData.credentialId || ''}
                                onChange={e => setFormData({ ...formData, credentialId: e.target.value })}
                                placeholder="Optional credential id"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Company Website (For Logo)</label>
                              <input
                                type="text"
                                value={formData.website || ''}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                placeholder="e.g. google.com or anthropic.com"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Skills</label>
                              <input
                                type="text"
                                value={(formData.skills || []).join(', ')}
                                onChange={e => handleStringArrayInput('skills', e.target.value)}
                                placeholder="Cybersecurity, Cloud Platform"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
                            {formData.type === 'education' ? 'Education Details' : 'Experience Details'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Organization</label>
                              <input
                                type="text"
                                value={formData.organization || ''}
                                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                placeholder="Company or institute"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Period</label>
                              <input
                                type="text"
                                value={formData.period || ''}
                                onChange={e => setFormData({ ...formData, period: e.target.value })}
                                placeholder="Apr 2025 - Present"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Location</label>
                              <input
                                type="text"
                                value={formData.location || ''}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Pune, India"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                              <textarea
                                rows={4}
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description shown on the achievement card"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 leading-relaxed resize-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Company Website (For Logo)</label>
                              <input
                                type="text"
                                value={formData.website || ''}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                placeholder="e.g. google.com or anthropic.com"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Highlights</label>
                              <input
                                type="text"
                                value={(formData.highlights || []).join(', ')}
                                onChange={e => handleStringArrayInput('highlights', e.target.value)}
                                placeholder="Full-time, WordPress, JavaScript"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                  
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
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-shadow shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Duration</label>
                        <input 
                          type="text" 
                          value={formData.duration} 
                          onChange={e => setFormData({...formData, duration: e.target.value})}
                          placeholder="e.g. 2 Weeks"
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-shadow shadow-sm"
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
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 leading-relaxed transition-shadow shadow-sm resize-none"
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
                                  className="w-full bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none text-sm font-bold text-slate-900 pb-1"
                                />
                                <textarea 
                                  rows={3}
                                  value={section.content}
                                  onChange={(e) => updateDetailSection(idx, 'content', e.target.value)}
                                  placeholder="Write your story content here..."
                                  className="w-full bg-white p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-100 outline-none text-sm text-slate-800 resize-none"
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
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tech Stack (Comma Separated)</label>
                       <p className="text-[11px] text-slate-500 mb-2">Separate technologies with commas. Spaces within names are preserved (e.g., "Tailwind CSS", "React Native")</p>
                       <input 
                          type="text" 
                          value={formData.stack.join(', ')} 
                          onChange={e => handleArrayInput('stack', e.target.value)}
                          placeholder="React, TypeScript, Tailwind CSS, Node.js"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Website URL</label>
                       <input 
                          type="url" 
                          value={formData.websiteUrl || ''} 
                          onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                          placeholder="https://example.com"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Source Code URL</label>
                       <input 
                          type="url" 
                          value={formData.sourceCodeUrl || ''} 
                          onChange={e => setFormData({...formData, sourceCodeUrl: e.target.value})}
                          placeholder="https://github.com/username/repo"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800"
                        />
                    </div>
                  </div>

                  {/* Visuals */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                     <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Visuals</h3>
                     

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
                             <img src={formData.image} alt="Preview" className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
                                 <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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

                    </>
                  )}
                </div>
            </div>
          )}

          {viewMode === 'preview-card' && (
             <div className="w-full min-h-full flex items-center justify-center p-8 bg-stone-200">
                {activeTab === 'achievements' ? (
                  <div className="w-full max-w-3xl">
                    <ScrollCard card={formData} index={0} />
                  </div>
                ) : (
                  <div className="w-full max-w-lg aspect-square bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-300">
                     <ProjectCard project={formData} isPreview={true} />
                  </div>
                )}
             </div>
          )}

          {viewMode === 'preview-page' && (
             <div className="w-full h-full bg-white overflow-y-auto">
                {activeTab === 'achievements' ? (
                  <div className="min-h-full flex items-center justify-center p-8 bg-stone-200">
                    <div className="w-full max-w-3xl">
                      <ScrollCard card={formData} index={0} />
                    </div>
                  </div>
                ) : (
                  <ProjectDetail project={formData} onBack={() => setViewMode('edit')} isPreview={true} />
                )}
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

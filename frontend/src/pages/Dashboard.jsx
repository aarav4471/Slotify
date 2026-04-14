import React, { useState, useEffect } from 'react';
import { getEvents, createEvent } from '../api';
import { Plus, Link as LinkIcon, Clock, Layers, Copy, Check } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', slug: '', duration_minutes: 30, buffer_time_minutes: 0 });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setShowModal(false);
      setFormData({ title: '', slug: '', duration_minutes: 30, buffer_time_minutes: 0 });
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating event');
    }
  };

  const copyLink = (slug, id) => {
    const link = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Event Types</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage your public scheduling links.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>New Event Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="glass-card p-6 flex flex-col h-full group hover:border-brand-200 dark:hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Layers size={24} />
              </div>
              <div className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md">
                Active
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{event.title}</h3>
            <div className="flex items-center text-slate-400 dark:text-slate-500 text-sm gap-2 mb-6">
              <Clock size={16} />
              <span>{event.duration_minutes} mins</span>
              {event.buffer_time_minutes > 0 && <span>• {event.buffer_time_minutes}m buffer</span>}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">/{event.slug}</span>
              <button 
                onClick={() => copyLink(event.slug, event.id)} 
                className={`flex items-center gap-1.5 text-sm font-bold transition-all duration-200 ${
                  copiedId === event.id ? 'text-green-600' : 'text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300'
                }`}
              >
                {copiedId === event.id ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedId === event.id ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="col-span-full py-16 text-center glass-card border-dashed">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-700">
              <Plus size={32} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">No event types yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first booking link to start scheduling.</p>
            <button onClick={() => setShowModal(true)} className="btn-secondary transition-all">
              Create Event Type
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Event Type</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Title</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. 1-on-1 Strategy Session" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Public Slug</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 text-sm">/</span>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 pl-6 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="strategy-session" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration (min)</label>
                  <input required type="number" min="15" step="15" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Buffer (min)</label>
                  <input type="number" min="0" step="5" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" value={formData.buffer_time_minutes} onChange={e => setFormData({...formData, buffer_time_minutes: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 px-4">Cancel</button>
                <button type="submit" className="btn-primary">Create Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

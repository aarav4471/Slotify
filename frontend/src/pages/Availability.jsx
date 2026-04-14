import React, { useState, useEffect } from 'react';
import { getAvailability, saveAvailability } from '../api';
import { Clock, Calendar, CheckCircle, Info, Save } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Availability() {
  const [schedule, setSchedule] = useState(
    DAYS.map((day, i) => ({ day_of_week: i, start_time: '09:00', end_time: '17:00', active: i > 0 && i < 6 }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const data = await getAvailability();
      if (data.length > 0) {
        setSchedule(schedule.map(slot => {
          const dt = data.find(d => d.day_of_week === slot.day_of_week);
          if (dt) return { ...slot, active: true, start_time: dt.start_time.slice(0,5), end_time: dt.end_time.slice(0,5) };
          return { ...slot, active: false };
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const activeSchedule = schedule.filter(s => s.active);
      await saveAvailability(activeSchedule);
      alert('Availability saved successfully!');
    } catch (err) {
      alert('Error saving availability');
    } finally {
      setSaving(false);
    }
  };

  const updateSlot = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Availability</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Set your standard working hours for the week.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn-primary flex items-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 mb-8 flex items-start gap-4 text-blue-800 dark:text-blue-300">
        <Info className="shrink-0 mt-0.5" size={20} />
        <div className="text-sm">
          <p className="font-bold mb-1">Weekly Recurring Schedule</p>
          <p className="opacity-80">These hours will be available for booking across all your active event types.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/60 dark:border-white/5">
        {schedule.map((slot, i) => (
          <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 p-6 transition-all duration-200 ${slot.active ? 'bg-white dark:bg-slate-900/50' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}>
            <div className="w-full sm:w-1/3 flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={slot.active} 
                  onChange={e => updateSlot(i, 'active', e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
              <span className={`font-bold text-lg ${slot.active ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                {DAYS[slot.day_of_week]}
              </span>
            </div>
            
            <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
              {slot.active ? (
                <div className="flex items-center gap-3 animate-fade-in w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Clock className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
                    <input 
                      type="time" 
                      value={slot.start_time} 
                      onChange={e => updateSlot(i, 'start_time', e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all" 
                    />
                  </div>
                  <span className="text-slate-300 dark:text-slate-700 font-bold">—</span>
                  <div className="relative flex-1 sm:flex-none">
                    <Clock className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
                    <input 
                      type="time" 
                      value={slot.end_time} 
                      onChange={e => updateSlot(i, 'end_time', e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all" 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 dark:text-slate-600 italic font-medium flex items-center gap-2">
                  Not available for bookings
                </div>
              )}
            </div>
            
            {slot.active && (
              <div className="hidden sm:block text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded-full p-2">
                <CheckCircle size={20} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

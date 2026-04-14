import React, { useState, useEffect } from 'react';
import { getBookings, cancelBooking } from '../api';
import { Calendar, Clock, User, Mail, XCircle, MoreVertical, Archive } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';

export default function Meetings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await cancelBooking(id);
      loadBookings();
    } catch (err) {
      alert('Failed to cancel meeting');
    }
  };

  const now = new Date();
  const upcoming = bookings.filter(b => isAfter(new Date(b.start_time), now) && b.status === 'CONFIRMED');
  const past = bookings.filter(b => isBefore(new Date(b.start_time), now) || b.status === 'CANCELLED');

  if (loading) return <div className="p-8 text-center text-slate-500">Loading meetings...</div>;

  const MeetingCard = ({ booking, isPast }) => (
    <div className={`glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-100 dark:hover:border-brand-500/30 transition-all duration-300 ${isPast ? 'opacity-70 grayscale-[0.5]' : ''}`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
            booking.status === 'CANCELLED' 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30' 
              : isPast ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30'
          }`}>
            {booking.status}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{booking.event_title}</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500"><Calendar size={14} /></div>
              <span className="font-semibold">{format(new Date(booking.start_time), 'EEEE, MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500"><Clock size={14} /></div>
              <span>{format(new Date(booking.start_time), 'hh:mm a')} - {format(new Date(booking.end_time), 'hh:mm a')}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500"><User size={14} /></div>
              <span className="font-semibold">{booking.guest_name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500"><Mail size={14} /></div>
              <span className="truncate max-w-[180px]">{booking.guest_email}</span>
            </div>
          </div>
        </div>
      </div>

      {!isPast && booking.status === 'CONFIRMED' && (
        <button
          onClick={() => handleCancel(booking.id)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 transition-all active:scale-95"
        >
          <XCircle size={18} />
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-4 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Scheduled Meetings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your upcoming schedule.</p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Upcoming</h2>
            <div className="h-6 w-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
              {upcoming.length}
            </div>
          </div>
          <div className="grid gap-6">
            {upcoming.length > 0 ? (
              upcoming.map(b => <MeetingCard key={b.id} booking={b} isPast={false} />)
            ) : (
              <div className="text-center py-20 glass-card border-dashed">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-300 dark:text-brand-700">
                  <Calendar size={32} />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Clear schedule</h3>
                <p className="text-slate-500 dark:text-slate-400">You don't have any upcoming meetings yet.</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">History & Archive</h2>
            <Archive size={20} className="text-slate-400 dark:text-slate-600" />
          </div>
          <div className="grid gap-6">
            {past.length > 0 ? (
              past.map(b => <MeetingCard key={b.id} booking={b} isPast={true} />)
            ) : (
              <div className="text-center py-12 text-slate-400 dark:text-slate-600 text-sm">
                No past records found.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

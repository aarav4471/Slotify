import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventBySlug, getAvailableSlots, createBooking } from '../api';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2, Globe, AlertCircle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfDay } from 'date-fns';

export default function BookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [bookingStatus, setBookingStatus] = useState('select_time'); // select_time, form, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getEventBySlug(slug).then(setEvent).catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (selectedDate && event) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      getAvailableSlots(slug, dateStr).then(res => setSlots(res.slots || [])).catch(console.error);
    }
  }, [selectedDate, event]);

  if (!event) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Loading calendar...</p>
    </div>
  );

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await createBooking({
        eventSlug: slug,
        guest_name: formData.name,
        guest_email: formData.email,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      setErrorMsg(err.response?.data?.error || 'Failed to book slot.');
    }
  };

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  
  if (bookingStatus === 'success') {
    return (
      <div className="max-w-xl mx-auto mt-20 animate-fade-in">
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">You're all set!</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">We've sent a confirmation email and calendar invitation to yours and the host's inbox.</p>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 text-left border border-slate-100 dark:border-slate-800 mb-8 mx-auto max-w-sm">
            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-4">{event.title}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <CalendarIcon className="w-5 h-5 opacity-60" />
                <span className="font-semibold">{format(selectedDate, 'EEEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Clock className="w-5 h-5 opacity-60" />
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-500 text-sm">
                <Globe className="w-5 h-5 opacity-40" />
                <span>Default Timezone (UTC)</span>
              </div>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="btn-secondary">Schedule another event</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 animate-fade-in mb-10">
      <div className="glass-card flex flex-col lg:flex-row overflow-hidden min-h-[640px] border-slate-200/50 dark:border-white/5 shadow-2xl bg-white/95 dark:bg-slate-900/90">
        {/* Guest Side Info */}
        <div className="w-full lg:w-1/3 p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm" />
            <span className="font-bold text-slate-500 dark:text-slate-400 text-sm tracking-wide">Demo User</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">{event.title}</h1>
          
          <div className="space-y-4">
            <div className="flex items-center text-slate-600 dark:text-slate-300 gap-3 font-semibold">
              <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              {event.duration_minutes} Minutes
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-300 gap-3 font-semibold">
              <Globe className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              Default Timezone (UTC)
            </div>
          </div>

          {selectedDate && selectedTime && bookingStatus === 'select_time' && (
            <div className="mt-12 p-5 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/30 animate-slide-up">
              <div className="text-brand-700 dark:text-brand-300 font-bold mb-1 flex items-center gap-2">
                <CalendarIcon size={18} />
                Selection
              </div>
              <p className="text-brand-800 dark:text-brand-200 font-bold text-lg">{selectedTime}, {format(selectedDate, 'EEEE, MMM d')}</p>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-2/3 p-10 relative">
          {bookingStatus === 'form' ? (
            <div className="max-w-md mx-auto animate-fade-in">
              <button onClick={() => setBookingStatus('select_time')} className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold mb-10 hover:translate-x-1 transition-transform">
                <ChevronLeft size={20}/> 
                <span>Back to calendar</span>
              </button>
              
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">Enter your details</h2>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                  <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="pt-6">
                  <button type="submit" className="w-full btn-primary py-4 text-lg">Schedule Meeting</button>
                </div>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">By scheduling, you agree to our terms and conditions.</p>
              </form>
            </div>
          ) : bookingStatus === 'error' ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking couldn't be completed</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto">{errorMsg}</p>
              <button onClick={() => {setBookingStatus('select_time'); setSelectedTime(null);}} className="btn-secondary px-10">Try another time</button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10">Select a Date & Time</h2>
              
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Calendar Grid */}
                <div className={`flex-grow transition-all duration-300 ${selectedDate ? 'lg:w-[55%]' : 'w-full'}`}>
                  <div className="flex justify-between items-center mb-8 px-2">
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{format(currentDate, 'MMMM yyyy')}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-brand-600 dark:text-brand-400 transition-colors"><ChevronLeft size={24}/></button>
                      <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-brand-600 dark:text-brand-400 transition-colors"><ChevronRight size={24}/></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i} className="text-[10px] font-bold text-slate-400 dark:text-slate-600 tracking-widest">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    
                    {daysInMonth.map((day, i) => {
                      const isPast = day < startOfDay(new Date());
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      return (
                        <button
                          key={i}
                          disabled={isPast}
                          onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                          className={`relative aspect-square flex items-center justify-center rounded-2xl text-sm font-bold transition-all border-2
                            ${isPast ? 'text-slate-300 dark:text-slate-800 border-transparent cursor-not-allowed' : 
                              isSelected ? 'bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-200 dark:shadow-brand-900/40 scale-105' : 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20 border-transparent hover:border-brand-100 dark:hover:border-brand-500/30 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:scale-110 active:scale-95'}
                          `}
                        >
                          {format(day, 'd')}
                          {isToday(day) && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 bg-brand-600 dark:bg-brand-400 rounded-full"></div>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Slots Side */}
                {selectedDate && (
                  <div className="lg:w-[45%] lg:border-l lg:pl-12 pt-10 lg:pt-0 border-slate-100 dark:border-slate-800 animate-fade-in">
                    <div className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                      {format(selectedDate, 'EEEE, MMM d')}
                    </div>
                    <div className="flex flex-col gap-3 h-[400px] overflow-y-auto pr-3 scrollbar-thin">
                      {slots.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 dark:text-slate-600 italic">No available slots</div>
                      ) : (
                        slots.map(slot => (
                          <div key={slot} className="relative group">
                            <button
                              onClick={() => setSelectedTime(slot)}
                              className={`w-full py-4 rounded-xl border-2 font-bold transition-all duration-300
                                ${selectedTime === slot ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 w-1/2' : 'bg-white dark:bg-slate-900 border-brand-100 dark:border-brand-900/30 text-brand-600 dark:text-brand-400 hover:border-brand-600 group-hover:w-[48%]'}
                              `}
                            >
                              {slot}
                            </button>
                            <button
                              onClick={() => {setSelectedTime(slot); setBookingStatus('form');}}
                              className={`absolute right-0 top-0 bottom-0 w-[48%] bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-100 dark:shadow-brand-900/40 transition-all duration-300
                                ${selectedTime === slot ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto'}
                              `}
                            >
                              Confirm
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

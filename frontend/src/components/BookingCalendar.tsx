"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, CheckCircle2, Video } from "lucide-react";
import { bookingService } from "@/services/booking-service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

const APPOINTMENT_TYPES = [
  { id: "CONSULTATION", label: "Consultation", duration: 30, desc: "Free intro call to discuss your project." },
  { id: "TECHNICAL", label: "Technical Deep Dive", duration: 60, desc: "In-depth architecture & technical planning." }
];

export function BookingCalendar() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [type, setType] = useState(APPOINTMENT_TYPES[0]);
  
  // Date Selection
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Slots
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Form
  const [form, setForm] = useState({ name: "", email: "", mobile: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Auth
  const { token, openModal } = useAuthStore();
  
  // Success
  const [meetLink, setMeetLink] = useState("");

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot(null);
      
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}T00:00:00Z`;
      
      bookingService.getAvailability(dateStr, timezone)
        .then(data => setSlots(data))
        .catch(() => toast.error("Failed to load availability"))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, timezone]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    setSubmitting(true);
    try {
      const result = await bookingService.createAppointment({
        appointmentType: type.id,
        clientName: form.name,
        clientEmail: form.email,
        clientMobile: form.mobile,
        clientCompany: form.company,
        clientMessage: form.message,
        scheduledAt: selectedSlot,
        duration: type.duration,
        timezone,
      });
      
      setMeetLink(result.meetingUrl || "");
      setStep(4);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Steps Header */}
      <div className="flex border-b border-border text-sm font-medium">
        {[1, 2, 3].map((num) => (
          <div key={num} className={`flex-1 py-3 text-center transition-colors ${step === num ? "bg-primary text-primary-foreground" : step > num ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}>
            Step {num}
          </div>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Type */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <h3 className="text-lg font-semibold">What kind of call?</h3>
              <div className="grid gap-3">
                {APPOINTMENT_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setType(t); setStep(2); }}
                    className="flex flex-col items-start gap-1 p-4 rounded-lg border border-border bg-surface text-left hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <div className="flex justify-between w-full">
                      <span className="font-semibold">{t.label}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {t.duration} min</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4"/> Back
                </button>
                <span className="text-sm font-medium">{type.label} ({type.duration}m)</span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-[1fr_200px]">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} disabled={currentDate.getMonth() <= today.getMonth() && currentDate.getFullYear() <= today.getFullYear()} className="p-1 rounded hover:bg-surface-2 disabled:opacity-30">
                      <ChevronLeft className="w-5 h-5"/>
                    </button>
                    <span className="font-medium">
                      {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-1 rounded hover:bg-surface-2">
                      <ChevronRight className="w-5 h-5"/>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, i) => {
                      if (!date) return <div key={i} className="aspect-square"/>;
                      const isPast = date < today;
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      
                      return (
                        <button
                          key={i}
                          disabled={isPast}
                          onClick={() => setSelectedDate(date)}
                          className={`aspect-square rounded-md flex items-center justify-center text-sm transition-colors ${
                            isSelected ? "bg-primary text-primary-foreground font-bold shadow-md" : 
                            isPast ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-2"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="border-l border-border pl-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedDate ? (
                    loadingSlots ? (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Loading...</div>
                    ) : slots.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{selectedDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        {slots.map(slot => {
                          const isSelected = selectedSlot === slot;
                          const timeString = new Date(slot).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-3 text-sm rounded-md border text-center transition-all ${
                                isSelected ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/50"
                              }`}
                            >
                              {timeString}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-sm text-muted-foreground gap-2">
                        <Calendar className="w-8 h-8 opacity-20"/>
                        No slots available on this day.
                      </div>
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground">
                      Select a date to view available times
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-end">
                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium text-sm disabled:opacity-50 transition-opacity"
                >
                  Continue <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4"/> Back
                </button>
                <div className="text-right text-sm">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-muted-foreground">
                    {selectedDate && new Date(selectedSlot!).toLocaleString('default', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {!token ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-surface-2 rounded-xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 opacity-50" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Login Required</h4>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    You need to be logged in to book an appointment.
                  </p>
                  <button onClick={() => openModal('login')} className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium text-sm">
                    Sign In to Continue
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs text-muted-foreground mb-1.5 block">Name *</span>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors" />
                    </label>
                    <label className="block">
                      <span className="text-xs text-muted-foreground mb-1.5 block">Email *</span>
                      <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1.5 block">Mobile Number *</span>
                    <input required type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors" placeholder="+1 (555) 000-0000" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1.5 block">Company (Optional)</span>
                    <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground mb-1.5 block">Message / Agenda (Optional)</span>
                    <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors resize-none" />
                  </label>

                  <button disabled={submitting} type="submit" className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded-full font-medium text-sm flex items-center justify-center disabled:opacity-70">
                    {submitting ? "Confirming..." : "Confirm Booking"}
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-8 max-w-sm">
                A calendar invitation with the Google Meet link has been sent to <strong>{form.email}</strong>.
              </p>
              
              {meetLink && (
                <div className="bg-surface-2 p-4 rounded-xl border border-border w-full max-w-sm">
                  <div className="flex items-center justify-center gap-2 mb-2 text-sm font-medium">
                    <Video className="w-4 h-4 text-primary"/> Google Meet Link
                  </div>
                  <a href={meetLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline break-all">
                    {meetLink}
                  </a>
                </div>
              )}
              
              <button onClick={() => { setStep(1); setSelectedDate(null); setSelectedSlot(null); }} className="mt-8 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
                Book another meeting
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }
      `}</style>
    </div>
  );
}

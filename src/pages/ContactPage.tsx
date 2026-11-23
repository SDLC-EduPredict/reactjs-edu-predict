import { useState, type FormEvent } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { useAppDispatch } from '@/app/store/hooks';
import { toastAdded } from '@/app/store/slices/uiSlice';
import { env } from '@/config/env';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useCategories } from '@/features/courses/hooks/useCourses';

const ContactPage = () => {
  useDocumentTitle('Contact Admissions');
  const dispatch = useAppDispatch();
  const categories = useCategories();
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\nInterest: ${form.interest || 'General'}\n\n${form.message}`;
    window.open(`mailto:${env.contactEmail}?subject=${encodeURIComponent(`Admissions enquiry — ${form.name}`)}&body=${encodeURIComponent(body)}`, '_self');
    dispatch(toastAdded({ type: 'success', title: 'Opening your email app', message: 'Send the drafted email to reach our admissions team.' }));
  };

  const contacts = [
    { icon: Mail, label: 'Email', value: env.contactEmail, href: `mailto:${env.contactEmail}` },
    { icon: Phone, label: 'Phone', value: env.contactPhone, href: `tel:${env.contactPhone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Campus', value: env.contactAddress },
  ];

  return (
    <section className="bg-gradient-to-b from-brand-50/70 to-white py-14 sm:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow">Get in Touch</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Talk to Our <span className="highlight">Admissions</span> Team
          </h1>
          <p className="mt-4 text-slate-600">Questions about courses, batches, fees or the ML prediction tool? We usually reply within one working day.</p>
          <div className="reveal-stagger mt-8 space-y-3">
            {contacts.map((item) => (
              <div key={item.label} data-reveal="left" className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 hover:ring-brand-200">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-slate-900 hover:text-brand-700">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <form data-reveal="right" onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-slate-900">Send an enquiry</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <Select
            label="Area of interest"
            placeholder="General enquiry"
            value={form.interest}
            onChange={(event) => setForm({ ...form, interest: event.target.value })}
            options={(categories.data ?? []).map((item) => ({ value: item.name, label: item.name }))}
          />
          <Textarea label="Message" rows={5} required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <Button type="submit" size="lg" fullWidth icon={<Send className="h-4 w-4" />}>
            Send Enquiry
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;

import { useState, type FormEvent } from 'react';
import { CalendarCheck, CheckCircle2, GraduationCap, Minus, Plus, Send } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { useAppDispatch } from '@/app/store/hooks';
import { toastAdded } from '@/app/store/slices/uiSlice';
import { env } from '@/config/env';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { cn } from '@/lib/utils/cn';
import { useCategories } from '@/features/courses/hooks/useCourses';
import emailImage from '@/assets/figma/contact/email.webp';
import callImage from '@/assets/figma/contact/call.webp';
import visitImage from '@/assets/figma/contact/visit.webp';

const SESSION_POINTS = [
  'Personalised course & career roadmap',
  'Review of your current skills and goals',
  'Predicted performance insights from our AI engine',
];

const FAQS = [
  {
    q: 'Do I need prior coding experience to join?',
    a: 'No. Our beginner tracks start from the fundamentals, and the AI course finder recommends the right starting level for you.',
  },
  {
    q: 'How does the AI predict my academic performance?',
    a: 'A Linear Regression model uses your attendance, assignment average, mock test scores and weekly practice hours to forecast your final score.',
  },
  {
    q: 'Are the classes online or on campus?',
    a: 'Both. Most programs offer online, offline and hybrid batches — the mode is shown on every course page.',
  },
  {
    q: 'Will I get placement or career support?',
    a: 'Yes. Mentors run 1-on-1 career sessions, mock interviews and portfolio reviews throughout your program.',
  },
];

const mapQuery = encodeURIComponent(env.contactAddress);

const ContactPage = () => {
  useDocumentTitle('Contact Admissions');
  const dispatch = useAppDispatch();
  const categories = useCategories();
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sendMail = (subject: string, body: string) =>
    window.open(
      `mailto:${env.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_self',
    );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendMail(
      `Admissions enquiry — ${form.name}`,
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nInterested track: ${form.interest || 'General'}`,
    );
    dispatch(
      toastAdded({
        type: 'success',
        title: 'Opening your email app',
        message: 'Send the drafted email to reach our admissions team.',
      }),
    );
  };

  const contacts = [
    {
      image: emailImage,
      title: 'Email Us',
      detail: env.contactEmail,
      note: 'Replies within 24 hours',
      action: 'Send Email',
      href: `mailto:${env.contactEmail}`,
    },
    {
      image: callImage,
      title: 'Call Us',
      detail: env.contactPhone,
      note: 'Mon – Sat, 9 AM – 7 PM',
      action: 'Call Now',
      href: `tel:${env.contactPhone.replace(/\s/g, '')}`,
    },
    {
      image: visitImage,
      title: 'Visit Us',
      detail: env.contactAddress,
      note: 'Campus open for walk-ins',
      action: 'Get Directions',
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-[#f0eefc] to-white pb-16 pt-14 lg:pt-20">
        <div className="animate-rise container-page mx-auto max-w-4xl text-center">
          <span className="eyebrow">
            <GraduationCap className="h-3.5 w-3.5" /> Get In Touch
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.15] text-slate-900 sm:text-5xl lg:text-[3.4rem]">
            Plan Your Future In <span className="highlight">Education</span> With{' '}
            <span className="text-brand-700">Edu-predict</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Questions about courses, batches, fees or our AI prediction engine? Our admissions team
            and mentors are here to help you choose the right path.
          </p>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-page">
          <h2
            data-reveal=""
            className="text-center font-display text-3xl font-semibold text-slate-900 sm:text-[2.75rem]"
          >
            Get in Touch <span className="text-brand-700">With Us</span>
          </h2>
          <div className="reveal-stagger mt-12 grid gap-6 md:grid-cols-3">
            {contacts.map((item) => (
              <div key={item.title} data-reveal="">
                <article className="group flex h-full flex-col items-center rounded-3xl bg-[#f0eefc] p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="block h-28 w-28 overflow-hidden rounded-2xl bg-white shadow-card ring-4 ring-white transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={item.image}
                      alt=""
                      width={720}
                      height={720}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-brand-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{item.detail}</p>
                  <p className="mt-2 flex flex-1 items-start gap-2 text-xs text-slate-500">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-lime-brand" />
                    {item.note}
                  </p>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white transition hover:bg-brand-800 active:scale-[0.98]"
                  >
                    {item.action}
                  </a>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sun py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <form
            data-reveal="left"
            onSubmit={submit}
            className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card sm:p-8"
          >
            <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              Send Us a <span className="text-brand-700">Message</span>
            </h2>
            <Input
              label="Full Name"
              required
              placeholder="Enter your full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
            <Select
              label="Interested Track"
              placeholder="Select a track"
              value={form.interest}
              onChange={(event) => setForm({ ...form, interest: event.target.value })}
              options={(categories.data ?? []).map((item) => ({ value: item.name, label: item.name }))}
            />
            <Button type="submit" size="lg" fullWidth className="mt-2" icon={<Send className="h-4 w-4" />}>
              Send Message
            </Button>
          </form>

          <div data-reveal="right" className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl font-semibold leading-snug text-slate-900">
                Book a 1-on-1 <span className="text-brand-700">AI Career Counseling</span> Session
              </h2>
              <ul className="mt-5 space-y-3">
                {SESSION_POINTS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 fill-lime-brand text-white" /> {item}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6"
                icon={<CalendarCheck className="h-4 w-4" />}
                onClick={() =>
                  sendMail('Book a free AI career counseling session', 'Hi, I would like to book a free 1-on-1 session.')
                }
              >
                Book Free Session
              </Button>
            </div>
            <div className="min-h-64 flex-1 overflow-hidden rounded-3xl bg-white shadow-card">
              <iframe
                title="Edu-Predict campus location"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-64 w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page max-w-4xl">
          <div data-reveal="" className="text-center">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> FAQs
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold text-slate-900 sm:text-[2.75rem]">
              Frequently Asked <span className="text-brand-700">Questions</span>
            </h2>
          </div>
          <div className="reveal-stagger mt-10 space-y-4">
            {FAQS.map((item, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={item.q}
                  data-reveal=""
                  className={cn(
                    'rounded-2xl transition-colors duration-300',
                    open ? 'bg-brand-700 text-white' : 'bg-[#f0eefc] text-slate-900',
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-base font-semibold sm:text-lg"
                  >
                    {item.q}
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300',
                        open ? 'rotate-180 bg-white text-brand-700' : 'bg-brand-700 text-white',
                      )}
                    >
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <p className="overflow-hidden px-5 text-sm leading-relaxed text-white/80">
                      <span className="block pb-5">{item.a}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

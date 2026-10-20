import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { env } from '@/config/env';
import { Alert, Button, Card, CardBody, Input, Textarea } from '@/components/ui';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits.'),
  subject: z.string().trim().min(3, 'Enter a subject.'),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters).'),
});

type ContactValues = z.infer<typeof contactSchema>;

export const ContactPage = () => {
  useDocumentTitle('Contact & Admissions');
  const { register, handleSubmit, formState, reset } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (values: ContactValues) => {
    const body = `${values.message}\n\n— ${values.name}\n${values.email}\n${values.phone}`;
    window.location.assign(`mailto:${env.contactEmail}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`);
    reset();
  };

  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-12">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Admissions</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Contact us</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Questions about courses, batches or fees? Our admissions team will get back to you.</p>
        </div>
      </section>
      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
              <Input label="Full name" required {...register('name')} error={formState.errors.name?.message} />
              <Input label="Email" type="email" required {...register('email')} error={formState.errors.email?.message} />
              <Input label="Phone" inputMode="numeric" maxLength={10} required {...register('phone')} error={formState.errors.phone?.message} />
              <Input label="Subject" required {...register('subject')} error={formState.errors.subject?.message} />
              <div className="sm:col-span-2">
                <Textarea label="Message" rows={5} required {...register('message')} error={formState.errors.message?.message} />
              </div>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <Alert tone="info">Your enquiry opens in your email app, addressed to {env.contactEmail}.</Alert>
                <Button type="submit" icon={<Send className="h-4 w-4" />}>
                  Send enquiry
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'Campus', value: env.contactAddress },
            { icon: Mail, title: 'Email', value: env.contactEmail },
            { icon: Phone, title: 'Phone', value: env.contactPhone },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
              <span className="rounded-xl bg-brand-50 p-2.5 text-brand-600">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.title}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { env } from '@/config/env';
import { PATHS } from '@/app/router/paths';
import { BrandLogo } from './BrandLogo';

const PROGRAMS = [
  'Python Programming',
  'Django Development',
  'Full Stack Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
];

const TRACKS = [
  'Python course in Kolkata',
  'Django course',
  'Machine learning course',
  'Full stack development course',
];

const QUICK_LINKS = [
  { to: PATHS.about, label: 'About the institute' },
  { to: PATHS.courses, label: 'Browse courses' },
  { to: PATHS.faculty, label: 'Meet our faculty' },
  { to: PATHS.register, label: 'Student registration' },
  { to: PATHS.contact, label: 'Contact & admissions' },
];

export const SiteFooter = () => (
  <footer className="footer-gradient relative mt-auto text-slate-600">
    <div className="container-page pb-10 pt-20">
      <div className="grid grid-cols-1 gap-10 border-b border-brand-200/60 pb-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <BrandLogo />
          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            {env.instituteName} offers industry-focused courses in Python, Django, Full Stack Development, Data Science and Machine Learning,
            with Linear Regression based academic performance prediction for every learner.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
              {env.contactAddress}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-600" />
              <a href={`mailto:${env.contactEmail}`} className="hover:text-brand-700">
                {env.contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" />
              <a href={`tel:${env.contactPhone.replace(/\s/g, '')}`} className="hover:text-brand-700">
                {env.contactPhone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-950">Programs</h2>
          <ul className="space-y-2.5 text-sm">
            {PROGRAMS.map((program) => (
              <li key={program}>
                <Link to={`${PATHS.courses}?search=${encodeURIComponent(program)}`} className="transition-colors hover:text-brand-700">
                  {program}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-950">Popular searches</h2>
          <ul className="space-y-2.5 text-sm">
            {TRACKS.map((track) => (
              <li key={track} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
                <Link to={`${PATHS.courses}?search=${encodeURIComponent(track.replace(/ course.*$/i, ''))}`} className="hover:text-brand-700">
                  {track}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-950">Quick links</h2>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-brand-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-slate-500 md:flex-row">
        <p>
          © {new Date().getFullYear()} {env.appName} · {env.appTagline}
        </p>
        <p className="text-slate-500">Predictions are an analytical aid and do not replace academic judgement.</p>
      </div>
    </div>
  </footer>
);

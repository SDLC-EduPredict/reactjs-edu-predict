import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { env } from '@/config/env';
import { PATHS } from '@/app/router/paths';
import { BrandLogo } from './BrandLogo';

const PROGRAMS = [
  'Python for Data Science',
  'Machine Learning Fundamentals',
  'Advanced Django Architecture',
  'Full Stack Web Development',
  'Linear Regression Deep Dive',
  'Neural Networks Workshop',
];

const TRACKS = [
  'AI Course in Kolkata',
  'ML Engineering Certification',
  'Best Python Institute India',
  'Supervised Learning Modules',
  'Career in Predictive Analytics',
];

const PORTALS = [
  { to: PATHS.student.dashboard, label: 'Student Dashboard' },
  { to: PATHS.faculty_portal.dashboard, label: 'Faculty LMS Portal' },
  { to: PATHS.courses, label: 'Examination Centre' },
  { to: PATHS.student.prediction, label: 'ML Prediction Tool' },
  { to: PATHS.contact, label: 'Placement Cell' },
];

export const SiteFooter = () => (
  <footer className="footer-gradient relative text-white/70">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    <div className="container-page grid gap-10 pb-10 pt-16 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-4">
        <BrandLogo light />
        <p className="max-w-xs text-xs leading-relaxed text-white/65">
          {env.instituteName} is a premier AI-enabled tech institute dedicated to preparing the next generation of data scientists and developers
          through supervised ML methodologies.
        </p>
        <ul className="space-y-2.5 text-xs">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
            {env.contactAddress}
          </li>
          <li className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0 text-sun-300" />
            <a href={`mailto:${env.contactEmail}`} className="link-underline hover:text-white">
              {env.contactEmail}
            </a>
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 shrink-0 text-sun-300" />
            <a href={`tel:${env.contactPhone.replace(/\s/g, '')}`} className="link-underline hover:text-white">
              {env.contactPhone}
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Academic Programs</h2>
        <ul className="space-y-2.5 text-xs">
          {PROGRAMS.map((item) => (
            <li key={item}>
              <Link to={`${PATHS.courses}?search=${encodeURIComponent(item.split(' ')[0] ?? item)}`} className="link-underline hover:text-white">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-4 font-display text-sm font-semibold text-white">SEO Targeted Tracks</h2>
        <ul className="space-y-2.5 text-xs">
          {TRACKS.map((item) => (
            <li key={item}>
              <Link to={PATHS.courses} className="link-underline hover:text-white">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Direct Portals</h2>
        <ul className="space-y-2.5 text-xs">
          {PORTALS.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className="link-underline hover:text-white">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="container-page border-t border-white/10 py-6 text-[11px] text-white/50">
      © {new Date().getFullYear()} {env.instituteName}. All rights reserved. Built with precision for the {env.appName} Ecosystem.
    </div>
  </footer>
);

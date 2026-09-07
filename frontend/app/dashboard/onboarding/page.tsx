'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  MapPin,
  FileText,
  DollarSign,
  Briefcase,
  Phone,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

const SPECIALTY_OPTIONS = [
  'Weight Loss',
  'Muscle Building',
  'Strength',
  'Bodybuilding',
  'Functional Training',
  'Mobility',
  'HIIT',
  'Sports Performance',
  "Women's Fitness",
  'Senior Fitness',
  'Hypertrophy Science',
  'Powerlifting',
  'Olympic Lifting',
];

interface CertificationField {
  name: string;
  issuingBody: string;
  year: string;
}

interface ProfileForm {
  title: string;
  location: string;
  bio: string;
  specialties: string[];
  experienceYears: string;
  hourlyRate: string;
  whatsapp: string;
  certifications: CertificationField[];
}

const emptyCertification = (): CertificationField => ({
  name: '',
  issuingBody: '',
  year: '',
});

export default function TrainerOnboardingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ProfileForm>({
    title: '',
    location: '',
    bio: '',
    specialties: [],
    experienceYears: '',
    hourlyRate: '',
    whatsapp: '',
    certifications: [],
  });

  useEffect(() => {
    apiClient.trainers
      .me()
      .then((profile) => {
        setForm({
          title: profile.title || '',
          location: profile.location || '',
          bio: profile.bio || '',
          specialties: Array.isArray(profile.specialties) ? profile.specialties : [],
          experienceYears: profile.experienceYears?.toString() ?? '',
          hourlyRate: profile.hourlyRate?.toString() ?? '',
          whatsapp: profile.whatsapp || '',
          certifications: (profile.certifications || []).map((cert: any) => ({
            name: cert.name || '',
            issuingBody: cert.issuingBody || '',
            year: cert.year?.toString() ?? '',
          })),
        });
      })
      .catch((err) => {
        setError(err.message || 'Failed to load your trainer profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateField = <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleSpecialty = (specialty: string) => {
    setForm((prev) => {
      const exists = prev.specialties.includes(specialty);
      const next = exists
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties: next };
    });
    setError('');
  };

  const updateCertification = (index: number, field: keyof CertificationField, value: string) => {
    setForm((prev) => {
      const next = [...prev.certifications];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, certifications: next };
    });
    setError('');
  };

  const addCertification = () => {
    setForm((prev) => ({ ...prev, certifications: [...prev.certifications, emptyCertification()] }));
  };

  const removeCertification = (index: number) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const validate = (): string | null => {
    if (!form.title.trim() || form.title.trim().length < 3) {
      return 'Profile title must be at least 3 characters.';
    }
    if (!form.location.trim() || form.location.trim().length < 2) {
      return 'Location is required.';
    }
    if (!form.bio.trim() || form.bio.trim().length < 10) {
      return 'Coaching bio/ethos must be at least 10 characters.';
    }
    if (form.specialties.length === 0) {
      return 'Select at least one specialty.';
    }
    const experienceYears = parseInt(form.experienceYears, 10);
    if (Number.isNaN(experienceYears) || experienceYears < 0) {
      return 'Experience years must be 0 or greater.';
    }
    const hourlyRate = parseFloat(form.hourlyRate);
    if (Number.isNaN(hourlyRate) || hourlyRate < 5) {
      return 'Hourly rate must be at least $5.';
    }

    for (const cert of form.certifications) {
      const hasAny = cert.name.trim() || cert.issuingBody.trim() || cert.year.trim();
      if (!hasAny) continue;
      if (!cert.name.trim() || cert.name.trim().length < 2) {
        return 'Each certification must have a name of at least 2 characters.';
      }
      if (!cert.issuingBody.trim() || cert.issuingBody.trim().length < 2) {
        return 'Each certification must have an issuing body of at least 2 characters.';
      }
      const year = parseInt(cert.year, 10);
      if (Number.isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
        return 'Certification year must be valid and not in the future.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: any = {
      title: form.title.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
      specialties: form.specialties,
      experienceYears: parseInt(form.experienceYears, 10),
      hourlyRate: parseFloat(form.hourlyRate),
      certifications: form.certifications
        .filter((cert) => cert.name.trim() || cert.issuingBody.trim() || cert.year.trim())
        .map((cert) => ({
          name: cert.name.trim(),
          issuingBody: cert.issuingBody.trim(),
          year: parseInt(cert.year, 10),
        })),
    };

    if (form.whatsapp.trim()) {
      payload.whatsapp = form.whatsapp.trim();
    }

    setSubmitting(true);
    setError('');

    try {
      await apiClient.trainers.updateProfile(payload);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save trainer profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2dff5f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#16191f] p-6 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-[#2dff5f]">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Trainer Profile Builder</span>
        </div>
        <h1 className="text-2xl font-black uppercase text-white">Build Your Public Coach Profile</h1>
        <p className="text-xs text-slate-400">
          This information powers your listing on the Gym Hub trainer directory. Complete every section to maximize bookings and featured placement.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-xl bg-[#16191f] border border-slate-800 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#2dff5f] mx-auto" />
          <h3 className="text-xl font-black uppercase text-white">Trainer Profile Saved</h3>
          <p className="text-xs text-slate-300">
            Your public profile is now live. Members can find you on the trainer directory and book sessions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/trainers"
              className="inline-flex items-center gap-1 px-6 py-2.5 rounded bg-[#2dff5f] text-black font-extrabold text-xs uppercase"
            >
              View Trainer Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 px-6 py-2.5 rounded border border-slate-700 text-white font-extrabold text-xs uppercase"
            >
              Return To Command Center
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#16191f] rounded-xl border border-slate-800 p-6 space-y-6"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Coach name (read-only) */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Coach Name
            </label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full bg-slate-900/60 border border-slate-700 rounded p-2.5 text-xs font-bold text-slate-400 mt-1 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500 mt-1">Update your display name from Settings.</p>
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Profile Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. IFBB Pro Physique Coach"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Austin, TX"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Coaching Ethos & Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Describe your coaching philosophy, ideal client, and what makes your approach unique..."
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 min-h-[120px] placeholder:text-slate-600"
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-2">
              <Award className="w-3.5 h-3.5" /> Specialties & Credentials
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SPECIALTY_OPTIONS.map((specialty) => {
                const checked = form.specialties.includes(specialty);
                return (
                  <label
                    key={specialty}
                    className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer text-[11px] font-bold uppercase transition ${
                      checked
                        ? 'bg-[#2dff5f]/10 border-[#2dff5f] text-[#2dff5f]'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => toggleSpecialty(specialty)}
                    />
                    {specialty}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) => updateField('experienceYears', e.target.value)}
                placeholder="5"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Hourly Rate ($)
              </label>
              <input
                type="number"
                min="5"
                step="0.01"
                value={form.hourlyRate}
                onChange={(e) => updateField('hourlyRate', e.target.value)}
                placeholder="85.00"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> WhatsApp (optional)
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Certifications
              </label>
              <button
                type="button"
                onClick={addCertification}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-[#2dff5f] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            {form.certifications.length === 0 && (
              <p className="text-xs text-slate-500">No certifications added yet.</p>
            )}

            {form.certifications.map((cert, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-lg border border-slate-700 bg-slate-900/50 items-end"
              >
                <div className="sm:col-span-5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    placeholder="CSCS"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Issuing Body</label>
                  <input
                    type="text"
                    value={cert.issuingBody}
                    onChange={(e) => updateCertification(index, 'issuingBody', e.target.value)}
                    placeholder="NSCA"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Year</label>
                  <input
                    type="number"
                    value={cert.year}
                    onChange={(e) => updateCertification(index, 'year', e.target.value)}
                    placeholder="2022"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs font-bold text-white mt-1 placeholder:text-slate-600"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="p-2.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    aria-label="Remove certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded bg-[#2dff5f] text-[#002105] font-black text-xs uppercase tracking-wider hover:bg-[#00e54e] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Trainer Profile
          </button>
        </form>
      )}
    </div>
  );
}

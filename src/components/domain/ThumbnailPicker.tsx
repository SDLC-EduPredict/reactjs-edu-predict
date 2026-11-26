import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { imageFileError, MAX_IMAGE_MB, type ImageInput } from '@/lib/utils/image';

interface ThumbnailPickerProps {
  title: string;
  category?: string;
  current: string | null;
  value: ImageInput;
  onChange: (value: ImageInput) => void;
  className?: string;
}

export const ThumbnailPicker = ({ title, category, current, value, onChange, className }: ThumbnailPickerProps) => {
  const [error, setError] = useState<string | null>(null);
  const preview = useMemo(() => (value instanceof File ? URL.createObjectURL(value) : null), [value]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = value === '' ? null : (preview ?? current);

  return (
    <div className={className}>
      <p className="mb-1.5 text-xs font-semibold text-slate-700">Thumbnail</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-28 w-48 shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <CourseArt title={title || 'Course'} category={category} thumbnail={shown} compact />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700">
              <ImagePlus className="h-4 w-4" />
              {shown ? 'Change image' : 'Upload image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.target.value = '';
                  if (!file) return;
                  const problem = imageFileError(file);
                  setError(problem);
                  if (!problem) onChange(file);
                }}
              />
            </label>
            {shown && (
              <Button type="button" size="sm" variant="outline" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => { setError(null); onChange(current ? '' : null); }}>
                Remove
              </Button>
            )}
          </div>
          <p className="text-[11px] text-slate-500">JPG, PNG, WEBP or GIF up to {MAX_IMAGE_MB} MB. Saved as a base64 image.</p>
          {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

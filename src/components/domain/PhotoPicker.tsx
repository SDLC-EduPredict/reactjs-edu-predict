import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { resolveMediaUrl } from '@/lib/utils/format';
import { imageFileError, MAX_IMAGE_MB } from '@/lib/utils/image';

export const PhotoPicker = ({ name, current, onChange }: { name: string; current: string | null; onChange: (file: File | null) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  return (
    <div className="inline-flex flex-col items-center">
      <label className="group relative inline-block cursor-pointer" title={`JPG, PNG, WEBP or GIF up to ${MAX_IMAGE_MB} MB`}>
        <Avatar name={name} src={preview ?? resolveMediaUrl(current)} size="xl" className="h-24 w-24 text-2xl ring-4 ring-white" />
        <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white shadow ring-2 ring-white transition group-hover:scale-110">
          <Camera className="h-4 w-4" />
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            event.target.value = '';
            const problem = file ? imageFileError(file) : null;
            setError(problem);
            if (problem) return;
            setPreview(file ? URL.createObjectURL(file) : null);
            onChange(file);
          }}
        />
      </label>
      {error && <p className="mt-2 max-w-[12rem] text-center text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { resolveMediaUrl } from '@/lib/utils/format';

export const PhotoPicker = ({ name, current, onChange }: { name: string; current: string | null; onChange: (file: File | null) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  return (
    <label className="group relative inline-block cursor-pointer">
      <Avatar name={name} src={preview ?? resolveMediaUrl(current)} size="xl" className="h-24 w-24 text-2xl ring-4 ring-white" />
      <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white shadow ring-2 ring-white transition group-hover:scale-110">
        <Camera className="h-4 w-4" />
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          setPreview(file ? URL.createObjectURL(file) : null);
          onChange(file);
        }}
      />
    </label>
  );
};

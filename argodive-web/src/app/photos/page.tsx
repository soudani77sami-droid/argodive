'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ImageIcon, Camera } from 'lucide-react';
import { UploadDialogButton } from '@/components/photos/upload-button';
import { Lightbox } from '@/components/photos/lightbox';
import { getPhotosList } from '@/app/actions/data';

type InspectionPhoto = {
  id: string;
  publicId: string;
  url: string;
  caption: string;
  cageId: string;
  inspection: string;
  date: string;
  photographer: string;
};

export default function PhotosPage() {
  const [search, setSearch] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);

  useEffect(() => {
    getPhotosList().then((list) => {
      const mapped: InspectionPhoto[] = list.map((p: any) => ({
        id: p.id,
        publicId: p.fileName?.replace(/\.[^.]+$/, '') ?? p.id,
        url: p.url,
        caption: p.caption ?? '',
        cageId: p.inspection?.cage?.cageNumber ?? '',
        inspection: p.inspection?.title ?? '',
        date: p.takenAt?.slice(0, 10) ?? p.createdAt?.slice(0, 10) ?? '',
        photographer: '',
      }));
      setPhotos(mapped);
    });
  }, []);

  const filtered = useMemo(
    () => photos.filter(
      (p) =>
        p.caption.toLowerCase().includes(search.toLowerCase()) ||
        p.cageId.toLowerCase().includes(search.toLowerCase()) ||
        p.inspection.toLowerCase().includes(search.toLowerCase()),
    ),
    [search, photos],
  );

  const lightboxImages = useMemo(
    () => filtered.map((p) => ({
      url: p.url,
      caption: p.caption,
      photographer: p.photographer,
      date: p.date,
    })),
    [filtered],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Inspection Photos</h1>
          <p className="text-muted-foreground">Browse and manage inspection images</p>
        </div>
        <UploadDialogButton />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search photos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Camera className="h-8 w-8" />
          </div>
          <p className="text-lg font-medium">No photos yet</p>
          <p className="text-sm mt-1">Upload your first inspection photo to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((photo, index) => (
            <Card
              key={photo.id}
              className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
              onClick={() => setLightboxIndex(index)}
            >
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium line-clamp-1">{photo.caption}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {photo.cageId && <Badge variant="outline" className="text-[10px]">{photo.cageId}</Badge>}
                  {photo.inspection && <Badge variant="secondary" className="text-[10px]">{photo.inspection}</Badge>}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  {photo.date && <><Calendar className="h-3 w-3" /> {photo.date}</>}
                  {photo.photographer && <><User className="h-3 w-3" /> {photo.photographer}</>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i === 0 ? lightboxImages.length - 1 : i! - 1))}
          onNext={() => setLightboxIndex((i) => (i === lightboxImages.length - 1 ? 0 : i! + 1))}
        />
      )}
    </div>
  );
}

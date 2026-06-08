'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ImageIcon, Camera } from 'lucide-react';
import { UploadDialogButton } from '@/components/photos/upload-button';
import { Lightbox } from '@/components/photos/lightbox';

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

const placeholderPhotos: InspectionPhoto[] = [
  { id: '1', publicId: 'argodive/demo/net-inspection', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&h=400&fit=crop', caption: 'Net condition inspection C-001', cageId: 'C-001', inspection: 'Monthly Routine Check', date: '2026-06-01', photographer: 'Sarah M.' },
  { id: '2', publicId: 'argodive/demo/biofouling', url: 'https://images.unsplash.com/photo-1560272564-c83b4b54f1cc?w=600&h=400&fit=crop', caption: 'Biofouling accumulation on net N-003', cageId: 'C-002', inspection: 'Post-Storm Assessment', date: '2026-06-02', photographer: 'John D.' },
  { id: '3', publicId: 'argodive/demo/structural', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', caption: 'Cage structural integrity at South Bay', cageId: 'C-003', inspection: 'Structural Check', date: '2026-06-05', photographer: 'Mike T.' },
  { id: '4', publicId: 'argodive/demo/fish-health', url: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=600&h=400&fit=crop', caption: 'Fish health assessment C-006', cageId: 'C-006', inspection: 'Pre-Harvest', date: '2026-06-10', photographer: 'Sarah M.' },
  { id: '5', publicId: 'argodive/demo/sensor', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', caption: 'DO sensor placement C-005', cageId: 'C-005', inspection: 'Environmental Monitoring', date: '2026-06-08', photographer: 'John D.' },
  { id: '6', publicId: 'argodive/demo/mortality', url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&h=400&fit=crop', caption: 'Mortality collection documentation', cageId: 'C-007', inspection: 'Health Check', date: '2026-06-08', photographer: 'Mike T.' },
  { id: '7', publicId: 'argodive/demo/net-repair', url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&h=400&fit=crop', caption: 'Net repair completed N-005', cageId: 'C-005', inspection: 'Emergency Net Inspection', date: '2026-06-03', photographer: 'John D.' },
  { id: '8', publicId: 'argodive/demo/water-quality', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop', caption: 'Water quality sampling at East Cove', cageId: 'C-005', inspection: 'Environmental', date: '2026-06-04', photographer: 'Sarah M.' },
  { id: '9', publicId: 'argodive/demo/diver-check', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop', caption: 'Underwater cage inspection', cageId: 'C-002', inspection: 'Routine Dive', date: '2026-05-28', photographer: 'Diver Team A' },
  { id: '10', publicId: 'argodive/demo/feed', url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', caption: 'Automated feeding system check', cageId: 'C-004', inspection: 'Equipment Check', date: '2026-05-25', photographer: 'Mike T.' },
];

export default function PhotosPage() {
  const [search, setSearch] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => placeholderPhotos.filter(
      (p) =>
        p.caption.toLowerCase().includes(search.toLowerCase()) ||
        p.cageId.toLowerCase().includes(search.toLowerCase()) ||
        p.inspection.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
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
          <h1 className="text-3xl font-bold tracking-tight text-ocean-dark">Photos</h1>
          <p className="text-muted-foreground">Inspection photos and field documentation</p>
        </div>
        <div className="flex items-center gap-2">
          <UploadDialogButton />
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by caption, cage, or inspection..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Photo grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((photo, i) => (
          <Card
            key={photo.id}
            className="group cursor-pointer overflow-hidden border-transparent shadow-sm transition-all hover:shadow-lg hover:border-ocean/30"
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={photo.url}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge className="text-[10px] bg-white/90 text-foreground hover:bg-white/90">
                  {photo.cageId}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium leading-snug line-clamp-1">{photo.caption}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {photo.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {photo.photographer}
                </span>
              </div>
              <p className="mt-1 truncate text-[11px] text-muted-foreground/70">{photo.inspection}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Camera className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium">No photos found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      )}

      {/* Lightbox */}
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

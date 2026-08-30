export interface GalleryMedia {
  id: string;
  url: string;
  mediaType: string;
  captionAr: string | null;
  captionEn: string | null;
  titleAr: string | null;
  titleEn: string | null;
  dateLabel: string | null;
  eventTag: string | null;
  order: number;
}

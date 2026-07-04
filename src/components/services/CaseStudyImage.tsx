export const CASE_STUDY_IMAGE_SLOT_CLASS =
  "case-study-photo-slot relative min-h-[280px] h-full overflow-hidden bg-slate-100 lg:col-span-2";

export const CASE_STUDY_IMAGE_FRAME_CLASS = "case-study-photo-frame";

export const CASE_STUDY_IMAGE_IMG_CLASS = "case-study-photo-img";

interface CaseStudyImageProps {
  alt?: string;
  src?: string;
}

export default function CaseStudyImage({
  alt = "Case study project photo",
  src = "/services/placeholder.svg",
}: CaseStudyImageProps) {
  return (
    <div data-vedit-image="true" data-vedit-alt={alt} className={CASE_STUDY_IMAGE_SLOT_CLASS}>
      <div className={CASE_STUDY_IMAGE_FRAME_CLASS}>
        <img src={src} alt={alt} className={CASE_STUDY_IMAGE_IMG_CLASS} />
      </div>
    </div>
  );
}

export function createCaseStudyPhotoMarkup(
  src = "/services/placeholder.svg",
  alt = "Case study project photo"
) {
  return `<div data-vedit-image="true" data-vedit-alt="${alt}" class="${CASE_STUDY_IMAGE_SLOT_CLASS}"><div class="${CASE_STUDY_IMAGE_FRAME_CLASS}"><img src="${src}" alt="${alt}" class="${CASE_STUDY_IMAGE_IMG_CLASS}" /></div></div>`;
}

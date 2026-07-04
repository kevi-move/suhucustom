export type InquiryStatus = "new" | "processing" | "closed";

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  productCategory: string | null;
  estimatedQty: string | null;
  targetMarket: string | null;
  leadTime: string | null;
  message: string;
  sourcePage: string;
  status: InquiryStatus;
  createdAt: Date;
}

/** Public company & contact details used across the site. */
export const SITE_BRAND_NAME = "Suhu Custom";
export const SITE_COMPANY_LEGAL_NAME = "Dongguan Qingzheng Trade Co., Ltd.";
export const SITE_COMPANY_ADDRESS = "Humen, Dongguan, Guangdong, China";
export const SITE_EMAIL = "suhujing3@gmail.com";
/** E.164 digits only, e.g. 8615767578180 for +86 157 6757 8180 */
export const SITE_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "8615767578180";
/** Prefers the official click-to-chat link; env can override. */
export const SITE_WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ||
  "https://api.whatsapp.com/message/3R5LPOMFMFSOH1";
export const SITE_WHATSAPP_DISPLAY = "+86-15767578180";
export const SITE_PAYMENT_TERMS = "50% deposit, 50% before shipment";
export const SITE_GOVERNING_LAW = "the laws of the People's Republic of China";

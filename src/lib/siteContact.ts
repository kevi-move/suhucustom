/** Public company & contact details used across the site. */
export const SITE_BRAND_NAME = "Suhu Custom";
export const SITE_COMPANY_LEGAL_NAME = "Dongguan Qingzheng Trade Co., Ltd.";
export const SITE_COMPANY_ADDRESS = "Humen, Dongguan, Guangdong, China";
export const SITE_EMAIL = "suhujing3@gmail.com";
/** E.164 digits only, e.g. 8613800138000 for +86 138 0013 8000 */
export const SITE_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "";
export const SITE_WHATSAPP_URL = SITE_WHATSAPP_NUMBER
  ? `https://wa.me/${SITE_WHATSAPP_NUMBER}`
  : "/contact-us";
export const SITE_PAYMENT_TERMS = "50% deposit, 50% before shipment";
export const SITE_GOVERNING_LAW = "the laws of the People's Republic of China";

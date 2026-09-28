type InquiryNotifyPayload = {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  productCategory?: string;
  estimatedQty?: string;
  sourcePage?: string;
  message: string;
};

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1)}…`;
}

export function isWecomNotifyConfigured(): boolean {
  return Boolean(process.env.WECOM_WEBHOOK_URL?.trim());
}

/** Send inquiry alert to WeCom group. Failures are logged and never thrown. */
export async function notifyWecomInquiry(data: InquiryNotifyPayload): Promise<boolean> {
  const webhook = process.env.WECOM_WEBHOOK_URL?.trim();
  if (!webhook) return false;

  const content = truncate(
    [
      "【SuhuCustom 新询盘】",
      `姓名: ${data.fullName}`,
      `邮箱: ${data.email}`,
      `公司: ${data.company || "-"}`,
      `电话/WhatsApp: ${data.phone || "-"}`,
      `品类: ${data.productCategory || "-"}`,
      `数量: ${data.estimatedQty || "-"}`,
      `来源: ${data.sourcePage || "-"}`,
      "留言:",
      data.message,
    ].join("\n"),
    2000
  );

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msgtype: "text",
        text: { content },
      }),
    });
    const result = (await response.json()) as { errcode?: number; errmsg?: string };
    if (result.errcode && result.errcode !== 0) {
      console.error("WeCom inquiry notify rejected:", result.errcode, result.errmsg);
      return false;
    }
    return true;
  } catch (error) {
    console.error("WeCom inquiry notify failed:", error);
    return false;
  }
}

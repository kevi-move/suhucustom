/** Browser-side image upload to /api/upload (requires admin session cookie). */
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("请先登录后台（/admin/login），再上传图片。");
    }
    throw new Error(data.error || "Upload failed");
  }

  if (!data.url) {
    throw new Error("Upload failed: no URL returned");
  }

  return data.url;
}

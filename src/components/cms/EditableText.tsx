"use client";

import { useCMS } from "@/contexts/CMSContext";

export function EditableText({
  path,
  value,
  className,
}: {
  path: string;
  value: string;
  className?: string;
}) {
  const { isEditMode, getValue, getDisplayValue, setValue } = useCMS();
  const display = getDisplayValue<string>(path, value);
  const editValue = getValue<string>(path, value);

  if (!isEditMode) {
    return <span className={className}>{display}</span>;
  }

  return (
    <input
      value={editValue}
      onChange={(e) => setValue(path, e.target.value)}
      className={className}
      style={{
        background: "rgba(17,17,17,0.85)",
        color: "inherit",
        border: "1px dashed #D09947",
        borderRadius: 4,
        padding: "2px 6px",
        width: "100%",
        minWidth: 120,
      }}
    />
  );
}

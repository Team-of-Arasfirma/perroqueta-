"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Upload } from "lucide-react";
import { isProductImageUrl, moveItem, productSections, validateProduct } from "./productForm";

const inputClass = "mt-1 min-w-0 w-full rounded-lg border border-[#E5DDF1] bg-white px-3 py-2 text-sm text-[#25202D] focus:border-[#6030C6] focus:outline-none focus:ring-2 focus:ring-[#6030C6]/20 disabled:bg-[#F7F4FC] read-only:bg-[#F7F4FC]";
export const primaryButton = "inline-flex min-h-10 min-w-0 max-w-full items-center justify-center gap-2 rounded-xl text-center wrap-anywhere [&_svg]:shrink-0 bg-[#6030C6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5127AE] disabled:opacity-50";
export const secondaryButton = "inline-flex min-h-10 min-w-0 max-w-full items-center justify-center gap-2 rounded-xl text-center wrap-anywhere [&_svg]:shrink-0 border border-[#E5DDF1] bg-white px-3 py-2 text-sm font-semibold text-[#6030C6] hover:bg-[#F7F4FC] disabled:opacity-40";

export function ProductImage({ media, className = "" }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg border border-[#EEEAF5] bg-[#F7F4FC] ${className}`}>
      {isProductImageUrl(media?.url) &&
        <Image unoptimized fill sizes="100px" src={media.url} alt={media.alt || ""} className="object-contain" />}
    </div>
  );
}

function Input({ label, value, onChange, config = {}, choices, readOnly }) {
  const inputId = useId();
  const isNumber = config.type === "number";
  const useTextarea = config.type === "textarea" || config.multiline;
  const props = {
    id: inputId, value: value ?? "", className: inputClass, readOnly,
    onChange: (event) => {
      const next = event.target.value;
      onChange(isNumber && next !== "" ? Number(next) : next);
    },
    "aria-required": config.required || undefined,
  };

  return (
    <div className={`min-w-0 ${useTextarea ? "sm:col-span-2" : ""}`}>
      <label htmlFor={inputId} className="text-sm font-semibold text-[#332940]">
        {label}{config.required && !readOnly ? " *" : ""}
      </label>
      {choices ? (
        <select {...props} disabled={readOnly}>
          <option value="">Choose {label.toLowerCase()}</option>
          {value && !choices.some((entry) => entry.value === value) &&
            <option value={value} disabled>{value} (unavailable)</option>}
          {choices.map(({ value: key, label: title }, index) =>
            <option key={key + ":" + index} value={key}>{title}</option>)}
        </select>
      ) : useTextarea ? (
        <textarea {...props} rows={3} />
      ) : (
        <input {...props} type={isNumber ? "number" : "text"} min={isNumber ? 0 : undefined} />
      )}
      {config.immutable && <p className="mt-1 text-xs text-[#655D70]">
        {readOnly ? "The slug is locked after creation." : "The slug determines the product URL and locks after creation."}
      </p>}
      {config.guidance && <p className="mt-1 text-xs text-[#655D70]">
        {(value ?? "").length} characters · Aim for {config.guidance}
      </p>}
    </div>
  );
}

function MediaField({ config, value, onChange, context }) {
  const { readOnly, upload } = context;
  const fileInput = useRef(null);
  const uploadButton = useRef(null);
  async function chooseFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await upload(file, value?.alt ?? "", onChange);
    requestAnimationFrame(() => {
      if (document.activeElement === document.body) uploadButton.current?.focus({ preventScroll: true });
    });
  }

  return (
    <div className="min-w-0 rounded-xl border border-[#EEEAF5] p-3 sm:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{config.label}{config.required && !readOnly ? " *" : ""}</h4>
        {!readOnly && !config.required && value != null &&
          <button type="button" className={secondaryButton} onClick={() => onChange(null)}>Remove {config.label}</button>}
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        {value?.url && <ProductImage media={value} className="size-20" />}
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
          {["URL", "Public ID", "Alt Text"].map((label, index) => {
            const key = ["url", "publicId", "alt"][index];
            return <Input key={key} label={`${config.label} ${label}`} value={value?.[key]}
              onChange={(next) => onChange({ publicId: "", ...value, [key]: next, ...(key === "url" && next !== value?.url ? { publicId: "" } : {}) })}
              readOnly={readOnly} />;
          })}
          {!readOnly && <div className="flex flex-wrap items-center gap-2 self-end">
            <input ref={fileInput} type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={chooseFile}
              onCancel={() => uploadButton.current?.focus({ preventScroll: true })} />
            <button ref={uploadButton} type="button" className={secondaryButton}
              aria-label={`${value?.url ? "Replace" : "Upload"} ${config.label}`}
              onClick={() => {
                uploadButton.current?.focus({ preventScroll: true });
                fileInput.current?.click();
              }}>
              <Upload size={15} /> {value?.url ? "Replace" : "Upload"}
            </button>
            <span className="text-xs text-[#655D70]">JPG, PNG or WEBP · 5 MB</span>
          </div>}
        </div>
      </div>
    </div>
  );
}

function Repeatable({ config, value, onChange, context }) {
  const items = value ?? [];
  const { readOnly } = context;
  const replace = (index, next) => onChange(items.map((item, current) => index === current ? next : item));
  const add = () => onChange([...items, config.fields
    ? (config.ordered ? { displayOrder: items.length + 1 } : {}) : ""]);

  return (
    <div className="min-w-0 space-y-3 rounded-xl border border-[#EEEAF5] p-2.5 sm:col-span-2 sm:p-4">
      <h4 className="text-sm font-bold text-[#332940]">{config.label} <span className="font-normal text-[#655D70]">({items.length})</span></h4>
      {items.map((item, index) => {
        const label = `${config.itemLabel} ${index + 1}`;
        const lockHero = config.fixed && index === 0;
        return (
          <div key={index} className="min-w-0 rounded-lg border border-[#EEEAF5] bg-[#FAF8FD] p-2.5 sm:p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 text-sm font-semibold wrap-anywhere">
                {label}{config.fields && (item?.label || item?.title) ? ` · ${item.label || item.title}` : ""}
              </span>
              {!readOnly && <div className="flex flex-wrap items-center gap-1.5">
                <button type="button" className={secondaryButton} aria-label={`Move ${label} up`}
                  disabled={index === 0 || (config.fixed && index === 1)}
                  onClick={() => onChange(moveItem(items, index, index - 1))}><ArrowUp size={14} /></button>
                <button type="button" className={secondaryButton} aria-label={`Move ${label} down`}
                  disabled={lockHero || index === items.length - 1}
                  onClick={() => onChange(moveItem(items, index, index + 1))}><ArrowDown size={14} /></button>
                {!config.fixed && <button type="button" className={secondaryButton} aria-label={`Remove ${label}`}
                  onClick={() => onChange(items.filter((_, current) => current !== index))}>Remove</button>}
              </div>}
            </div>
            {config.fields ? (
              <div className="mt-3">
                <Fields fields={config.fields} data={item} onChange={(next) => replace(index, next)} context={context} />
              </div>
            ) : config.fixed ? (
              <p className="mt-1 text-sm capitalize text-[#655D70]">{item}</p>
            ) : (
              <Input label={label + " text"} value={item} config={{ multiline: config.multiline }}
                onChange={(next) => replace(index, next)} readOnly={readOnly} />
            )}
          </div>
        );
      })}
      {!readOnly && !config.fixed && <button className={secondaryButton} type="button" onClick={add}>
        <Plus size={15} /> Add {config.itemLabel}
      </button>}
    </div>
  );
}

function Fields({ fields, data, onChange, context }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {fields.map((config) => {
        const value = data?.[config.key];
        const change = (next) => onChange({ ...data, [config.key]: next });
        const { readOnly, existing, product } = context;

        if (config.type === "group") {
          return (
            <div key={config.key} className="min-w-0 space-y-3 rounded-lg border border-[#EEEAF5] p-2.5 sm:col-span-2 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold">{config.label}</h3>
                {config.optional && !readOnly && (
                  <button type="button" className={secondaryButton} onClick={() => change(value == null ? {} : null)}>
                    {value == null ? "Add" : "Remove"} {config.label}
                  </button>
                )}
              </div>
              {value != null || !config.optional ? (
                <Fields fields={config.fields} data={value} onChange={change} context={context} />
              ) : readOnly && <p className="text-sm text-[#655D70]">None</p>}
            </div>
          );
        }
        if (config.type === "array") {
          return <Repeatable key={config.key} config={config} value={value} onChange={change} context={context} />;
        }
        if (config.type === "media") {
          return <MediaField key={config.key} config={config} value={value} onChange={change} context={context} />;
        }
        const choices = config.options?.(product) ?? config.choices;
        return (
          <Input key={config.key} label={config.label} config={config} value={value}
            choices={choices} readOnly={readOnly || (config.immutable && existing)}
            onChange={(next) => {
              // Empty selects represent an unset reference, not an empty referenced ID.
              const updated = { ...data, [config.key]: choices && next === "" ? null : next };
              if (config.key === "defaultProfileId" && next !== value) updated.defaultColorId = null;
              onChange(updated);
            }} />
        );
      })}
    </div>
  );
}

export default function ProductEditor({ initial, existing, readOnly, onSave, onClose, onUpload }) {
  const [product, setProduct] = useState(initial);
  const [busy, setBusy] = useState("");
  const [errors, setErrors] = useState([]);
  const feedback = useRef(null);
  const dirty = JSON.stringify(product) !== JSON.stringify(initial);
  const showErrors = (messages) => {
    setErrors(messages);
    requestAnimationFrame(() => feedback.current?.focus());
  };
  const upload = async (file, alt, setMedia) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      showErrors(["Choose a JPG, PNG or WEBP image of 5 MB or smaller."]);
      return;
    }
    setBusy("Uploading image…");
    setErrors([]);
    try {
      setMedia(await onUpload(file, alt));
    } catch (error) {
      showErrors([error.message]);
    } finally {
      setBusy("");
    }
  };

  async function submit(event) {
    event.preventDefault();
    if (readOnly || busy) return;
    const validationErrors = validateProduct(product);
    if (validationErrors.length) {
      showErrors(validationErrors);
      return;
    }
    setBusy("Saving…");
    setErrors([]);
    try {
      await onSave(product);
    } catch (error) {
      showErrors([error.message]);
    } finally {
      setBusy("");
    }
  }

  const context = { product, readOnly, existing, upload };
  return (
    <form noValidate onSubmit={submit} className="min-w-0 space-y-4">
      {errors.length > 0 && (
        <div ref={feedback} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-bold">Review these changes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 wrap-anywhere">
            {errors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}
      <fieldset disabled={Boolean(busy)} className="min-w-0 space-y-3">
        {!readOnly && <p className="px-1 text-sm text-[#655D70]">Replacing or removing an image changes the product when you save. Existing files are kept.</p>}
        {productSections.map(({ title, fields }, index) => (
          <details key={title} open={index === 0 || undefined}
            className="group rounded-2xl border border-[#E8E1F3] bg-white shadow-[0_8px_24px_rgba(49,29,91,0.04)]">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 font-bold text-[#332940] [&::-webkit-details-marker]:hidden">
              {title}<ChevronDown size={17} className="shrink-0 text-[#6030C6] group-open:rotate-180" />
            </summary>
            <div className="min-w-0 border-t border-[#EEEAF5] p-3 sm:p-4">
              <Fields fields={fields} data={product} onChange={setProduct} context={context} />
            </div>
          </details>
        ))}
      </fieldset>
      <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border border-[#E8E1F3] bg-white p-3">
        <button type="button" className={secondaryButton} disabled={Boolean(busy)}
          onClick={() => { if (!dirty || window.confirm("Discard unsaved product changes?")) onClose(); }}>
          {readOnly ? "Back to products" : "Cancel"}
        </button>
        {!readOnly && <button type="submit" className={primaryButton} disabled={Boolean(busy)}>{busy || "Save product"}</button>}
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import ProductEditor, { ProductImage, primaryButton, secondaryButton } from "@/components/Admin/Products/ProductEditor";
import { createDraft, matchesProduct, productContent, statuses } from "@/components/Admin/Products/productForm";
import { hasPermission } from "@/lib/adminPermissions";
import { getProduct, listProducts, saveProduct, uploadProductImage } from "@/services/productService";

const statusStyle = {
  draft: "bg-amber-50 text-amber-800",
  published: "bg-emerald-50 text-emerald-800",
  archived: "bg-[#EEEAF5] text-[#5F566D]",
};
const actionLabel = { draft: "Move to draft", published: "Publish", archived: "Archive" };
const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });
const columns = "xl:grid xl:grid-cols-[minmax(0,2.25fr)_minmax(0,.85fr)_minmax(0,.5fr)_minmax(0,.78fr)_minmax(0,1.4fr)] xl:items-center xl:gap-4";

function UpdatedDate({ value }) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime())
    ? <time dateTime={value}>{dateFormatter.format(date)}</time> : "—";
}

function ProductRow({ product, disabled, editable, onOpen, onStatus }) {
  return (
    <li className={columns + " min-w-0 space-y-3 border-t border-[#EEEAF5] px-4 py-4 xl:space-y-0"}>
      <div className="flex min-w-0 items-center gap-3">
        <ProductImage media={product.cards?.listing?.image ?? product.hero?.fixedImage} className="size-14 sm:size-16" />
        <div className="min-w-0">
          <p className="font-semibold text-[#1F1A28] wrap-anywhere">{product.name}</p>
          <p className="mt-1 text-xs text-[#655D70] wrap-anywhere">{product.slug}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm xl:contents">
        <div><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[product.status]}`}>{product.status}</span></div>
        <div className="text-[#51495B]"><span className="xl:sr-only">Order </span>{product.displayOrder}</div>
        <div className="text-[#51495B]"><span className="xl:sr-only">Updated </span><UpdatedDate value={product.updatedAt} /></div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={secondaryButton} disabled={disabled} onClick={() => onOpen(product, "view")}>View</button>
        {editable && <>
          <button type="button" className={secondaryButton} disabled={disabled} onClick={() => onOpen(product, "edit")}>Edit</button>
          <details className="group/actions min-w-0">
            <summary className={secondaryButton + " cursor-pointer list-none [&::-webkit-details-marker]:hidden"}>Status</summary>
            <div className="mt-1 grid gap-1 rounded-lg border border-[#E5DDF1] bg-[#FAF8FD] p-1">
              {statuses.filter((status) => status !== product.status).map((status) => (
                <button type="button" key={status} className={secondaryButton} disabled={disabled}
                  onClick={(event) => {
                    event.currentTarget.closest("details").open = false;
                    onStatus(product, status);
                  }}>{actionLabel[status]}</button>
              ))}
            </div>
          </details>
        </>}
      </div>
    </li>
  );
}

function ProductManagement({ token, canCreate, canEdit }) {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    listProducts(token).then((items) => {
      if (active) setProducts(items);
    }).catch((failure) => {
      if (active) setError(failure.message);
    });
    return () => { active = false; };
  }, [token, reload]);

  function replaceRecord(updated) {
    setProducts((current) => [
      ...(current ?? []).filter(({ _id }) => _id !== updated._id), updated,
    ].sort((a, b) => a.displayOrder - b.displayOrder || a.slug.localeCompare(b.slug)));
  }

  async function openEditor(item, mode) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const product = await getProduct(token, item._id);
      const { fields, metadata } = productContent(product);
      setEditor({ fields, id: metadata._id, mode });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(item, next) {
    if (next === "archived" && !window.confirm(`Archive ${item.name}?`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      replaceRecord(await saveProduct(token, item._id, { status: next }));
      setNotice(`${item.name} is now ${next}.`);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function commit(fields) {
    const saved = await saveProduct(token, editor.id, fields);
    replaceRecord(saved);
    setEditor(null);
    setNotice(`Saved ${saved.name}.`);
  }

  const visible = products?.filter((product) => matchesProduct(product, query, status)) ?? [];
  const editorTitle = editor?.mode === "create" ? "Add Product" : editor?.mode === "edit" ? "Edit Product" : "Product Details";

  return (
    <div className="mx-auto w-full max-w-[1240px] min-w-0">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#FF8626]">Product Management</p>
          <h1 className="mt-2 text-[30px] font-bold text-[#171717]">{editor ? editorTitle : "Products"}</h1>
          {editor?.fields.name && <p className="mt-1 text-sm text-[#655D70] wrap-anywhere">{editor.fields.name}</p>}
        </div>
        {!editor && canCreate && <button type="button" className={primaryButton} disabled={busy || !products}
          onClick={() => { setError(""); setNotice(""); setEditor({ fields: createDraft(), mode: "create" }); }}>
          <Plus size={17} /> Add Product
        </button>}
      </div>

      {editor ? (
        <ProductEditor initial={editor.fields} existing={Boolean(editor.id)} readOnly={editor.mode === "view"}
          onSave={commit} onClose={() => setEditor(null)}
          onUpload={(file, alt) => uploadProductImage(token, file, alt)} />
      ) : (
        <div className="space-y-4">
          {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <span>{error}</span>
            {!products && <button type="button" className={secondaryButton} onClick={() => { setError(""); setReload((value) => value + 1); }}>Retry</button>}
          </div>}
          {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
          <section className="overflow-hidden rounded-2xl border border-[#E8E1F3] bg-white shadow-[0_10px_35px_rgba(49,29,91,0.05)]">
            <div className="grid items-end gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
              <label className="min-w-0 text-sm font-semibold text-[#332940]">
                Search
                <span className="relative mt-1 block">
                  <Search size={17} className="pointer-events-none absolute left-3 top-3 text-[#6030C6]" />
                  <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or slug" className="w-full rounded-xl border border-[#E5DDF1] py-2.5 pl-9 pr-3 font-normal focus:outline-[#6030C6]" />
                </span>
              </label>
              <div className="text-sm font-semibold text-[#332940]">
                <label htmlFor="product-status-filter">Status</label>
                <select id="product-status-filter" value={status} onChange={(event) => setStatus(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5DDF1] bg-white px-3 py-2.5 font-normal capitalize focus:outline-[#6030C6]">
                  <option value="">All statuses</option>
                  {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
              {products && <p className="pb-2.5 text-sm text-[#655D70]" role="status">{visible.length} of {products.length} products</p>}
            </div>
            {visible.length > 0 && <>
              <div aria-hidden="true" className={columns + " hidden border-t border-[#EEEAF5] bg-[#FAF8FD] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#655D70]"}>
                <span>Product</span><span>Status</span><span>Order</span><span>Updated</span><span>Actions</span>
              </div>
              <ul aria-label="Product results">
                {visible.map((product) => <ProductRow key={product._id} product={product} disabled={busy}
                  editable={canEdit} onOpen={openEditor} onStatus={changeStatus} />)}
              </ul>
            </>}
            {products && !visible.length && <p className="border-t border-[#EEEAF5] px-4 py-8 text-center text-sm text-[#655D70]">
              {products.length ? "No products match the current search and status." : "No products yet."}
            </p>}
            {!products && !error && <p role="status" className="border-t border-[#EEEAF5] p-4 text-sm text-[#655D70]">Loading products…</p>}
          </section>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const { user, token } = useAdminAuth();
  if (!hasPermission(user, "products", "view")) return <AdminAccessDenied />;
  return <ProductManagement key={token} token={token}
    canCreate={hasPermission(user, "products", "create")}
    canEdit={hasPermission(user, "products", "edit")} />;
}

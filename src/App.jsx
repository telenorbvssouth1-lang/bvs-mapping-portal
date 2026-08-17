import React, { useState } from "react";

// Paste your deployed Google Apps Script Web App URL here to sync
// submissions to your Google Sheet.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwK70tydZg1lvJ56Q1DOHLyjIlurIipVhcfLwtgx4xZRHR0cskvNCDmX_wekittLEjR5g/exec";

const emptyForm = {
  franchiseId: "",
  easyload: "",
  sellerCode: "",
  postpaid: "",
  imei: "",
  fsMapping: "",
  easypaisaPos: "",
  epFsUserId: "",
};

function Field({ label, required, children }) {
  return (
    <div className="mb-5">
      <span className="block text-xs uppercase text-blue-900/60 font-bold mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-cyan-500 ml-1">*</span>}
      </span>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-white border-2 border-cyan-100 focus:border-cyan-400 outline-none rounded-2xl px-4 py-2.5 text-blue-950 placeholder-blue-300 text-sm";

// Apps Script Web Apps often don't send CORS headers for plain fetch() calls
// from external sites, so we use JSONP (a <script> tag) instead, which isn't
// subject to CORS.
function jsonpRequest(url) {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonp_cb_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    let done = false;

    window[callbackName] = (data) => {
      done = true;
      resolve(data);
      cleanup();
    };

    function cleanup() {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    script.onerror = () => {
      if (!done) {
        reject(new Error("Network error — the request could not be reached"));
        cleanup();
      }
    };

    const sep = url.includes("?") ? "&" : "?";
    script.src = url + sep + "callback=" + callbackName;
    document.body.appendChild(script);

    setTimeout(() => {
      if (!done) {
        reject(new Error("Request timed out"));
        cleanup();
      }
    }, 15000);
  });
}

export default function BVSPortal() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.franchiseId.trim()) e.franchiseId = "Required";
    if (!form.easyload.trim()) e.easyload = "Required";
    if (!form.postpaid.trim()) e.postpaid = "Required";
    if (!form.imei.trim()) e.imei = "Required";
    if (!form.fsMapping) e.fsMapping = "Required";
    if (form.fsMapping === "Yes FS Mapping") {
      if (!form.easypaisaPos.trim()) e.easypaisaPos = "Required";
      else if (!/^92\d{10}$/.test(form.easypaisaPos.trim()))
        e.easypaisaPos = 'Use format 92XXXXXXXXXX, e.g. "923452821234"';
      if (!form.epFsUserId.trim()) e.epFsUserId = "Required";
      else if (!/^\d{4}$/.test(form.epFsUserId.trim()))
        e.epFsUserId = "Must be 4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    const record = {
      ...form,
      franchiseId: form.franchiseId.trim().toUpperCase(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const params = new URLSearchParams({ action: "submit", ...record });
      const data = await jsonpRequest(`${APPS_SCRIPT_URL}?${params.toString()}`);
      if (data.status !== "ok") throw new Error(data.message || "Failed to save");
      setForm(emptyForm);
      setJustSubmitted(true);
    } catch (err) {
      setSubmitError(
        "Couldn't save to the sheet: " + ((err && err.message) || "unknown error")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <header className="bg-white border-b border-cyan-100 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow shadow-cyan-200">
          <span className="text-white font-black text-base">T</span>
        </div>
        <div>
          <div className="text-blue-950 font-bold text-base leading-tight">BVS Mapping Portal</div>
          <div className="text-cyan-600 font-bold text-[10px] uppercase tracking-[0.2em]">
            telenor
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {justSubmitted && (
          <div className="mb-6 border-2 border-cyan-200 bg-cyan-50 text-cyan-700 text-sm rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">Mapping submitted and saved to sheet.</span>
            <button
              onClick={() => setJustSubmitted(false)}
              className="text-cyan-600 hover:text-cyan-800 text-xs uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {submitError && (
          <div className="mb-6 border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm rounded-2xl px-4 py-3">
            {submitError}
          </div>
        )}

        <h2 className="text-blue-950 font-bold mb-1">Submit a mapping</h2>
        <p className="text-blue-400 text-sm mb-6">Fill in the details below.</p>

        <div className="bg-white border-2 border-cyan-100 rounded-3xl p-6 shadow-sm shadow-cyan-100">
          <Field label="Franchise ID" required>
            <input
              className={inputClass}
              value={form.franchiseId}
              onChange={(e) => updateField("franchiseId", e.target.value)}
              placeholder="e.g. SKHI1258"
            />
            {errors.franchiseId && <p className="text-rose-500 text-xs mt-1">{errors.franchiseId}</p>}
          </Field>

          <Field label="Retailer EasyLOAD Number" required>
            <input
              className={inputClass}
              value={form.easyload}
              onChange={(e) => updateField("easyload", e.target.value)}
              placeholder="Your answer"
            />
            {errors.easyload && <p className="text-rose-500 text-xs mt-1">{errors.easyload}</p>}
          </Field>

          <Field label="GSM Seller Code / Retailer ID">
            <input
              className={inputClass}
              value={form.sellerCode}
              onChange={(e) => updateField("sellerCode", e.target.value)}
              placeholder="Your answer"
            />
          </Field>

          <Field label="MB Postpaid Number" required>
            <input
              className={inputClass}
              value={form.postpaid}
              onChange={(e) => updateField("postpaid", e.target.value)}
              placeholder="Your answer"
            />
            {errors.postpaid && <p className="text-rose-500 text-xs mt-1">{errors.postpaid}</p>}
          </Field>

          <Field label="IMEI Number" required>
            <input
              className={inputClass}
              value={form.imei}
              onChange={(e) => updateField("imei", e.target.value)}
              placeholder="Your answer"
            />
            {errors.imei && <p className="text-rose-500 text-xs mt-1">{errors.imei}</p>}
          </Field>

          <Field label="Enter FS Mapping as well?" required>
            <select
              className={inputClass}
              value={form.fsMapping}
              onChange={(e) => updateField("fsMapping", e.target.value)}
            >
              <option value="">Choose</option>
              <option value="No FS Mapping">No FS Mapping</option>
              <option value="Yes FS Mapping">Yes FS Mapping</option>
            </select>
            {errors.fsMapping && <p className="text-rose-500 text-xs mt-1">{errors.fsMapping}</p>}
          </Field>

          {form.fsMapping === "Yes FS Mapping" && (
            <div className="border-t-2 border-cyan-50 pt-5 mt-1">
              <div className="text-xs font-black uppercase tracking-widest text-cyan-600 mb-4">
                FS BVS Mapping
              </div>
              <Field label="Retailer Easy PAISA POS Number" required>
                <input
                  className={inputClass}
                  value={form.easypaisaPos}
                  onChange={(e) => updateField("easypaisaPos", e.target.value)}
                  placeholder='92XXXXXXXXXX e.g. "923452821234"'
                  inputMode="numeric"
                />
                {errors.easypaisaPos && (
                  <p className="text-rose-500 text-xs mt-1">{errors.easypaisaPos}</p>
                )}
              </Field>
              <Field label="EP/FS USER ID (4-Digit)" required>
                <input
                  className={inputClass}
                  value={form.epFsUserId}
                  onChange={(e) => updateField("epFsUserId", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="Your answer"
                  inputMode="numeric"
                />
                {errors.epFsUserId && (
                  <p className="text-rose-500 text-xs mt-1">{errors.epFsUserId}</p>
                )}
              </Field>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold rounded-full py-3 mt-2 transition-colors"
          >
            {submitting ? "Submitting…" : "Submit mapping"}
          </button>
        </div>
      </main>
    </div>
  );
}

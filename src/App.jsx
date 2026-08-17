import React, { useState, useEffect } from "react";

// Franchise ID -> password. Edit any password directly here.
const FRANCHISES = {
  DDKH3007: "3451595065",
  DDSKHI3002: "3408866866",
  DKHI3004: "3433335525",
  DSKZ3001: "3493700373",
  SCHG5201: "3498079591",
  SCMN1203: "3464223868",
  SDAL1202: "3493091115",
  SDAY1201: "3433951800",
  SDMJ1202: "3432734550",
  SDUK1202: "3462131080",
  SHUB1202: "3400986665",
  SKHI1221: "3442159005",
  SKHI1232: "3412405167",
  SKHI1235: "3493300000",
  SKHI1241: "3432039477",
  SKHI1244: "3462677723",
  SKHI1251: "3493330030",
  SKHI1253: "3403712992",
  SKHI1254: "3418093117",
  SKHI1255: "3410859919",
  SKHI1257: "3410867974",
  SKHI1258: "3411809440",
  SKHI1259: "3410871363",
  SKHI1260: "3410854988",
  SKHI1262: "3414500307",
  SKHI1265: "3492574778",
  SKHI1266: "3442608478",
  SKHI1268: "3442666557",
  SKHI1271: "3498688862",
  SKHI1272: "3462205040",
  SKHI1273: "3472000440",
  SKHI1274: "3452288014",
  SKHI1276: "3451807773",
  SKHI1277: "3423465545",
  SKHI1278: "3451746262",
  SKHI1279: "3430022069",
  SKHI1280: "3412801280",
  SKHI1282: "3462244462",
  SKHI1283: "3474193979",
  SKHI1285: "3418235135",
  SKHI1287: "3453587881",
  SKHI1288: "3410261288",
  SKHI1289: "3438062292",
  SKHI1290: "3438005557",
  SKHI1291: "3442902993",
  SKHI1292: "3432371082",
  SKHI1293: "3443006200",
  SKHI1294: "3432667994",
  SKHZ5201: "3464479993",
  SKLT5201: "3495913499",
  SKRN5201: "3493875859",
  SLRI7201: "3468102352",
  SMST5201: "3410228825",
  SNAS7201: "3458343780",
  SNKI1201: "3491800616",
  SNKI7201: "3468537505",
  SPJG5202: "3491800650",
  SPSI1202: "3463051122",
  SQSU5201: "3429515820",
  SRIB1201: "3457216710",
  SSBI1202: "3462139043",
  STRB1201: "3462741821",
  SUET1207: "3498078211",
  SUET1213: "3410837680",
  SUET1214: "3412266351",
  SUET1215: "3477851100",
  SUET1216: "3422882015",
  SUET5201: "3403111136",
  SUTH5201: "3410871018",
  SZHB1201: "3492928830",
};

// Paste your deployed Google Apps Script Web App URL here to sync
// submissions to your Google Sheet.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwK70tydZg1lvJ56Q1DOHLyjIlurIipVhcfLwtgx4xZRHR0cskvNCDmX_wekittLEjR5g/exec";

const emptyForm = {
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
  const [franchiseId, setFranchiseId] = useState(() => {
    try {
      return localStorage.getItem("bvs_logged_in_franchise") || null;
    } catch (e) {
      return null;
    }
  });
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (franchiseId) loadHistory(franchiseId);
  }, [franchiseId]);

  function loadHistory(fid) {
    try {
      const raw = localStorage.getItem("bvs_submissions");
      const all = raw ? JSON.parse(raw) : [];
      const rows = all.filter((v) => v.franchiseId === fid);
      rows.sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""));
      setHistory(rows);
    } catch (e) {
      // ignore — local history is just a convenience view
    }
  }

  function handleLogin() {
    const id = loginId.trim().toUpperCase();
    const correctPassword = FRANCHISES[id];
    if (!correctPassword || correctPassword !== loginPass) {
      setLoginError("ID or password is incorrect.");
      return;
    }
    setLoginError("");
    try {
      localStorage.setItem("bvs_logged_in_franchise", id);
    } catch (e) {
      // ignore — session just won't persist across refresh
    }
    setFranchiseId(id);
  }

  function handleLoginKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  function handleLogout() {
    try {
      localStorage.removeItem("bvs_logged_in_franchise");
    } catch (e) {
      // ignore
    }
    setFranchiseId(null);
    setLoginId("");
    setLoginPass("");
    setForm(emptyForm);
    setErrors({});
    setJustSubmitted(false);
    setHistory([]);
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.easyload.trim()) e.easyload = "Required";
    else if (!/^03\d{9}$/.test(form.easyload.trim()))
      e.easyload = 'Must be 11 digits, e.g. "03401118899"';
    if (!form.postpaid.trim()) e.postpaid = "Required";
    else if (!/^03\d{9}$/.test(form.postpaid.trim()))
      e.postpaid = 'Must be 11 digits, e.g. "03401118899"';
    if (!form.imei.trim()) e.imei = "Required";
    else if (!/^\d{15}$/.test(form.imei.trim()))
      e.imei = 'Must be 15 digits, e.g. "350925890354812"';
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
      franchiseId,
      ...form,
      submittedAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem("bvs_submissions");
      const all = raw ? JSON.parse(raw) : [];
      all.unshift(record);
      localStorage.setItem("bvs_submissions", JSON.stringify(all));
      setHistory((h) => [record, ...h]);
    } catch (e) {
      // local cache is best-effort only
    }

    try {
      const params = new URLSearchParams({ action: "submit", ...record });
      const data = await jsonpRequest(`${APPS_SCRIPT_URL}?${params.toString()}`);
      if (data.status !== "ok") throw new Error(data.message || "Failed to save");
      setForm(emptyForm);
      setJustSubmitted(true);
    } catch (err) {
      setSubmitError(
        "Saved locally, but couldn't sync to the sheet: " +
          ((err && err.message) || "unknown error")
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- LOGIN SCREEN ----------
  if (!franchiseId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-400 mb-4 shadow-lg shadow-cyan-200">
              <span className="text-white font-black text-2xl">T</span>
            </div>
            <h1 className="text-3xl font-black text-blue-950 leading-tight">
              BVS Mapping Portal
            </h1>
            <div className="text-cyan-600 font-bold text-xs uppercase tracking-[0.2em] mt-1.5">
              telenor
            </div>
            <p className="text-blue-400 text-sm mt-3">Franchise sign-in required</p>
          </div>

          <div className="bg-white border-2 border-cyan-100 rounded-3xl p-6 shadow-sm shadow-cyan-100">
            <Field label="Franchise ID" required>
              <input
                className={inputClass}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyDown={handleLoginKeyDown}
                placeholder="e.g. SKHI1258"
              />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass + " pr-16"}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  onKeyDown={handleLoginKeyDown}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-700 text-xs uppercase font-bold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {loginError && (
              <p className="text-rose-500 text-sm mb-4">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-full py-3 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- PORTAL SCREEN ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <header className="bg-white border-b border-cyan-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow shadow-cyan-200">
            <span className="text-white font-black text-base">T</span>
          </div>
          <div>
            <div className="text-blue-950 font-bold text-base leading-tight">BVS Mapping Portal</div>
            <div className="text-cyan-600 font-bold text-[10px] uppercase tracking-[0.2em]">
              telenor
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-sm font-semibold">{franchiseId}</span>
          <button
            onClick={handleLogout}
            className="text-blue-500 hover:text-blue-700 text-sm border-2 border-cyan-100 hover:border-cyan-300 rounded-full px-4 py-1.5 font-semibold transition-colors"
          >
            Sign out
          </button>
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
        <p className="text-blue-400 text-sm mb-6">
          Submitting as <span className="font-semibold text-blue-600">{franchiseId}</span>
        </p>

        <div className="bg-white border-2 border-cyan-100 rounded-3xl p-6 shadow-sm shadow-cyan-100">
          <Field label="Retailer EasyLOAD Number" required>
            <input
              className={inputClass}
              value={form.easyload}
              onChange={(e) => updateField("easyload", e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="03401118899"
              inputMode="numeric"
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
              onChange={(e) => updateField("postpaid", e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="03401118899"
              inputMode="numeric"
            />
            {errors.postpaid && <p className="text-rose-500 text-xs mt-1">{errors.postpaid}</p>}
          </Field>

          <Field label="IMEI Number" required>
            <input
              className={inputClass}
              value={form.imei}
              onChange={(e) => updateField("imei", e.target.value.replace(/\D/g, "").slice(0, 15))}
              placeholder="350925890354812"
              inputMode="numeric"
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

        <div className="mt-10">
          <h3 className="text-blue-950 font-bold text-sm mb-3">
            Your submissions {history.length > 0 && `(${history.length})`}
          </h3>
          {history.length === 0 ? (
            <p className="text-blue-300 text-sm">No mappings submitted yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((r, i) => (
                <div
                  key={i}
                  className="border-2 border-cyan-100 rounded-2xl px-4 py-3 text-sm bg-white"
                >
                  <div className="flex justify-between text-blue-300 text-xs mb-1.5">
                    <span>{new Date(r.submittedAt).toLocaleString()}</span>
                    <span className="text-cyan-600 font-semibold">{r.fsMapping}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-blue-950 text-xs">
                    <span>EasyLOAD: {r.easyload}</span>
                    <span>Postpaid: {r.postpaid}</span>
                    <span>IMEI: {r.imei}</span>
                    <span>Seller: {r.sellerCode || "—"}</span>
                    {r.fsMapping === "Yes FS Mapping" && (
                      <>
                        <span>EasyPaisa POS: {r.easypaisaPos}</span>
                        <span>EP/FS User ID: {r.epFsUserId}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";

// Official Telenor brand colors (brand.telenor.com/group/identity/colors)
const BRAND = {
  darkBlue: "#070452",
  midBlue: "#1C16C5",
  telenorBlue: "#00C8FF",
  lightBlue: "#B4FFFF",
  offWhite: "#E8FDFF",
};

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

// Master (team) accounts. Login IDs are matched case-insensitively.
// role "super" = full analytics dashboard. role "ops" = operational dashboard.
const MASTER_ACCOUNTS = {
  "sohaib.zuberi": { name: "Sohaib Zuberi", password: "zuberitpbvs", role: "super" },
  "hammad.aziz": { name: "Hammad Aziz", password: "hammadtpbvs", role: "ops" },
  "syed.hasnain": { name: "Syed Husnain", password: "hasnaintpbvs", role: "ops" },
};

const TEAM_NAMES = ["Sohaib Zuberi", "Hammad Aziz", "Syed Husnain"];

const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAANLUlEQVR42u2de3BcVR3HP+fcu7vZ3WSTbdKmTR9pSlsQikIZRZj6QCsqjAojCAWfo+MDnEFhfCHqKD4YBhgtKkixPkcRZ2SQUcEROgj4QnyALVrSEmhq82iaZjfJJrt7z/GPc3f3ZrNs9nHTZoN3djLTdHNzz2d/v+/5ve6N0Frz/+OFD/vFsEjt+Vp0CM/XFxcgbV4aIZBzUdCgNEIgZr1NLDIX0zlLkZ5vZjUJh6MOCYeUQgGaoCRmEbdotQh53q2YgcleVGg0Urhrm1A8neLvkzw1yTNT9KcZzTKpmNIojYCQJCyJWXQFWN/EyyKc2cxLwy4slUO8GCxIeUxmSvH4BPePsSvBnhRjWY/2zNYbrzgJWm1Oj3LpEi5pp81yGTU2IONQBk1/ml8e5ecjPD7BRNZds2tQAnQ5kUagNcqcTvDKFq5fxdYYunEBedHsn+aHh/npCHtT7netmXpU4ZGXHkcRD3BHDxctaUxAeYE4mGHHED84TF+qYC/Vcpl9WJDVdAW5d2MDAjJ0spofHeamAfZMgMASBTHy5ZDgaC7vaDRAhs7+aT5zgLtHACzhg8mUdDetWR1qqG3e0Hk4yZV97J5ASoSvVjP7aLEaB5Ch86ujfOBZBqaxJc48GI5XrRW8o1FE2tD57Rjv2sdQBkvMo+EIo3EOW+Pctb4RLMjQ+dskH3h2fumInPwrzevi3NFDu73gAZlgZzDDFX0cmMKS80LHBA2ORmk6gnx4GdesoM1CL/BcLL89ffEgf064uuOz1gi0xtGgiQe5oI0rOzkjWrBce+Gbzy+OsHMY6ZPtiBwXZXILBYL1Yd7axmXtLhpvPcBeyHQEHM7y5f8y7dTrXPk0QlHg0hXkrGbOj3NujJXB4gyGhQ9Iws5h/j5RI51iY9EAlqSniZc38/oYr2phY1NxcldUMFuggIz/96fZMVwdEUpBQdAR4JQwZzazpZnTo6wKFn7KyVWRSpYcF7QG/ewIvSlk2X3dW+RRoD1Q4gHWh9gc4awWNkfY0ESTnMHF1FgtUe4a7AXrXAmHn42ARogSEbP7gQuU9kCRdATY0MRpEV4e5bQoG0I0WzMM01QdmYvLQgck4LEk/5xEyBl0CiUbCpXElUFOjrA5whlRTg6zNkRUzjhbviAvKVu7bxRAZgkPjJF2sCyUnhHLGWDNNidHObuFs5s5PUp3kIAoDUVUbCyNAciYT9LhsXHyMYnMoYkF2BxhayvnxDg1TMss9/EFSgMA2pPiP1Mg3H86ig0R3tnOm9s4NUKTKAGlBvdpTEAaBE+mSGZdNVWad3Rww2p6QjkuGuYTynEAlO+vmOKK2YCKGzAaDVqgYHcKNJYk4/CWJXx3Hc0SJyfSUhy7D8yeVyglmr/ihYXZ81/7plxJjgW4tsulYx0Pi7bng4vyxqYCIKM5nOVQmkMZBjMMZhhzGHeY1m5I0ixps1kR4IQQh7M8MYEQKMXGKJvChTZGAwMyXCxPbDrmsHeKpyb55yR7UjyXZjhDwvFkAKUMKShRkNVYAgfGHCY1zZAFa94Fp9QV1V9y9XZ+geem+cM4v0/yl3H2TXuavwLwTFAIjzhRaH7mz6ZzheGPLOMLK+kMFHK0xgBUVBkYzLArya9GeTRJXzq3UFGYJqCCOZ0iUc/va5siXNHJ5e3ELC/thQpIezIa4IkJ7j7CfUd5OuXWWYRA5ixCV1DTQxdKhdas1qgApUCwpYXPruRNrcfUlKoGpDxR/+8SfH+YBxKMpgtczPkqOan0pFSWJChJaxzHPVXROzUoRcTmI8v4TBft9jFiVAWg/GSRo/n1GHcM8bsEU9lC57fyDqdbnVBEbF7TwutjvCRMi0XC4aEEO4cZc9wue0mgW2J8vZszosXDTscNkFdudiX4xiC/PkrGcecoqu38uokVnB/nmuW8qgV75hKveo7th0pXEUUu81gZ4uY1XNI+7+5mV+hTJj+6ZYC7RpjIgsSShU2nOjqKeIDrVnJFp5tVOdrd1xyNLWi35/iobMnBNO/bT+80n1qBLeaRkV2J4Yw7fGeYrw/QP1U7mjydTVG2d3NOzC3rSG/mLRCQmcsgHbAEKc11B+ib5sbVxOdNkuw5DeeP43yunwfHACwLrWvsLhg6W9u4vYcTQq58lMwehKh4rxDcOcjBNLetpTs0L+mILPPrM5pbBnjLXh48iiWQpr5ZUwHM0Lmog5+s54SQazh1iqu5Ekvym1Eu7mVPCgufO4ulARk6B9O8dz/XPMdIxtXLmiNuI6uXL2VnD0ttlH+fs/F0W/J4kouf4YkJ/xnJ2e4t4clJLurlJ8NIMUdToULPumwpt62lxapIKarF54At2TPJtl7+6jcjWWQ7Fjyc5O3P8KcEtqw05CtP5+IObq+QjgYIVy+2htEzKS7fxz8msfwbrJJFnvXAGNt66U35MKFk6JwXr5hO7tdFpFtsrYHR3knevY+9U0ifGEkvnYcSvGcfh9I+zFEYOmfH2NHDkir34FitEmUYPTXB+/dzKOMmKD4AMlf/j0ne/yyDabcQUz+dkyJ8t4euYNURSpuFzJXra2P0aIIr+5hQ9UoEIE0oOJThij76Uth1T5mYZK0zxI4eTgq7ql/pzwqAVpugrH1hDliSe0a4rr+6DPEFLUjDFw7yxwRW3Z5lpmejFrd2s6WlxsgtbhGpzz00SMmtA+wYqtfRpID7x/jeMFLWa435+x6+tIqLl9QS75gzLLFprS9SMgtRmmv7eSRZl2DLScX2AaZLlRdqAKQUH+7kY51uJlHb0WrRYYOuK9TWIAUjaa5+nsE6BFs+kuSRZPGMQM3CfG6cr64qN25TyRGRLLV9KKwqsCR/TfL5g24mUMMa5b2jTNRtPobOxgi3drt3WomaJQws4Q7E1V8JM2L0vSHuGqnRiKQ7I1CnZ2liAbZ3s7Gp3rKDWYPpMtc/425ihYzm8/3sn65FjGR/upawtViY4fpVvLHVh6KMgbKuCSHrErIZjibYl+KLB91KZnX1z2lVt/koPtjJlcv8WY8JhcwQlF83SRhHu2uEe0ardjRp17EmKyfMX1vl9lR9AATAmiArgvVuZEWOlna4/r8MZaq7R0jWvKFKyCo2RbltrVvx9LG7sNSmJ+Tn3TxmR3tynG8PVXed8vRIrduWZmUTO3pYF/KzHmw+XluwKezDTj/bf+8Y4l+pKtRanteGLWrp27Tb3NnDK5ury7Yq1+nTIu4Qq49GJAWHptk+UEUmLM9vY1MErSpdpGXoBNixjje1zkud3Oj0qRHiNlr7aUMahOTuI/xlvFIlkssCXL3cnUWWcxmO0Z1VIX64jgvjflaXZ+v0hiZODPum04XtDMYy3DZUqWhKDZe18/EVKIWjsXL9hvxL4qYOjsZRvLqVezdwXts89urMZxuVnNnsvwxpEIJ7R/nbREVGJAFLcMNqbuxmeZCswlHujQ7mxhhH4zgozYlhbuzmlxvZHJ33wQEjQ+e0YEn3URt+GpHgaIYfH64IvtBa5xVrd4qfjvBwkr4pxhRaE5F0BtgU4Q2tvDFGVxCOyeiJuaShDK95mn+nfL4NU4LSrA7x8EtYO9cW7A4veMcTUopDGY5kUZqYRWeAuF3YCMSxGl4yjD7ax7cG/L8T0+SPt67lo52VAcqvnxd4t6NnzIodg8Nc9/1jvG0vGe1Duapkcea+jQTL1r/l7H3KtCvzL50rQRzjAUrz685u5rQIWvn82zUgeHyc3ak50ldZ8sqk5yWOx2xpfi+LWVwY9/8KjFSPZnk0SXlCx2v8uIrjbXE6g7kZIn/DUc2jSRdWQwIy/n5SmPNafY4Y87vAU5MMZ8rZ0EK3ICOf7+og4nfBwMjQgTT7pxsZkNm8trTwupjPUp0fnuudKoSmjQooIPjQMkKWz0YkAM2z6UKG3JAibRid28q5rT4bkdHpA9Plco6GARQUfGw5UbvGoYYyZx/JuufUDQoov529toVt7Sj/jMjoTlK53Q4aF1A+tPvkCrrDONrP686WndttGECmiryhiWu75n6Ebw05TcMDyicf7+3gkg4c/xwtJMrVRRsMEBAU3LCKU6I4qt6rN1t73HafNSgaHVDe0bpDfLOb9mDdYqSBwpODWASAyN0U9doYN68hVF9BVgGCE5saOZIuY0fv6eArq91xT1mTwyposTg10uCRdMm1mbjumuV8ZbXbyJQ1nESxKcIp4QaPpMsItoZPreDGNTRJt2dVrQRdECdads6mUQF5GV29nJ3r6AqSVW4VtCIh05wQ5tL2ud9JozNSsK2d+zaytQ1Hu+4mK1jzJ1awJlhNV6NxD7PIpMPtQ3xzkOen3Fv2zV3Y3qcXCEFWgeaqLm5aPfe86eL5sxF5Q9g7xZ3D3HOE3imKH0OgAeIBrlrOp7sIVXDDw6L6uxre9ufzaXYl2JVgd4qBDBlNk2B5kLOa2dbOK3JP3Kyo9cziOoranwmHUYeUIizoCLjPf6v8+RZisf7xI+9Tesrge/ECKvI7b4RZ1bH4/zpUnZ3h/wFOS03klvmoGQAAAABJRU5ErkJggg==";

// Paste your deployed Google Apps Script Web App URL here to sync
// submissions to your Google Sheet.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyLnBD4i1ccR1mJeewAE8FU-DZrszAakHzDJjE8yakdOSjF_4IxxkRYcG3rX96d3pRwlg/exec";

const emptyForm = {
  easyload: "",
  sellerCode: "",
  postpaid: "",
  imei: "",
  fsMapping: "",
  easypaisaPos: "",
  epFsUserId: "",
};

// ---------------------------------------------------------------------------
// JSONP helper — Apps Script Web Apps don't reliably send CORS headers for
// plain fetch() calls from external sites, so we load the response as a
// <script> tag instead, which isn't subject to CORS.
// ---------------------------------------------------------------------------
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
    }, 20000);
  });
}

// ---------------------------------------------------------------------------
// Date & analytics helpers
// ---------------------------------------------------------------------------
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function startOfWeek(d) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sunday
  return addDays(x, -day);
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

const DATE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7", label: "Last 7 Days" },
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
  { key: "prevMonth", label: "Previous Month" },
  { key: "allTime", label: "All Time" },
  { key: "custom", label: "Custom Range" },
];

function getRangeForPreset(key, customStart, customEnd) {
  const now = new Date();
  switch (key) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "yesterday": {
      const y = addDays(now, -1);
      return { start: startOfDay(y), end: endOfDay(y) };
    }
    case "last7":
      return { start: startOfDay(addDays(now, -6)), end: endOfDay(now) };
    case "thisWeek":
      return { start: startOfWeek(now), end: endOfDay(now) };
    case "thisMonth":
      return { start: startOfMonth(now), end: endOfDay(now) };
    case "prevMonth": {
      const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { start: startOfMonth(prevMonthDate), end: endOfMonth(prevMonthDate) };
    }
    case "custom":
      return {
        start: customStart ? startOfDay(new Date(customStart)) : startOfDay(addDays(now, -30)),
        end: customEnd ? endOfDay(new Date(customEnd)) : endOfDay(now),
      };
    case "allTime":
    default:
      return { start: new Date(2000, 0, 1), end: endOfDay(now) };
  }
}

// Previous period of equal length immediately before the given range.
function getPreviousRange(start, end) {
  const lengthMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - lengthMs);
  return { start: prevStart, end: prevEnd };
}

function inRange(iso, start, end) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function filterByRange(rows, start, end) {
  return rows.filter((r) => inRange(r.timestamp, start, end));
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function fmtHours(hrs) {
  if (hrs == null || isNaN(hrs)) return "—";
  if (hrs < 1) return Math.round(hrs * 60) + "m";
  if (hrs < 24) return hrs.toFixed(1) + "h";
  const d = Math.floor(hrs / 24);
  const h = Math.round(hrs % 24);
  return `${d}d ${h}h`;
}

function pct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 1000) / 10;
}

function computeKPIs(rows) {
  const total = rows.length;
  const pending = rows.filter((r) => r.status === "Pending" || !r.status).length;
  const completed = rows.filter((r) => r.status === "Done").length;
  const rejected = rows.filter((r) => r.status === "Rejected").length;
  const processedRows = rows.filter((r) => r.processedAt);
  const avgHrs =
    processedRows.length > 0
      ? processedRows.reduce((sum, r) => {
          const h = (new Date(r.processedAt) - new Date(r.timestamp)) / 36e5;
          return sum + Math.max(h, 0);
        }, 0) / processedRows.length
      : null;
  const franchises = new Set(rows.map((r) => r.franchiseId)).size;
  return {
    total,
    pending,
    completed,
    rejected,
    completionRate: pct(completed, total),
    rejectionRate: pct(rejected, total),
    avgProcessingHours: avgHrs,
    totalFranchises: franchises,
    totalProcessed: completed + rejected,
  };
}

function computeAging(pendingRows) {
  const now = Date.now();
  const buckets = {
    "0-2h": 0, "2-4h": 0, "4-8h": 0, "8-24h": 0, "24h+": 0,
  };
  let oldest = null;
  pendingRows.forEach((r) => {
    const hrs = (now - new Date(r.timestamp).getTime()) / 36e5;
    if (hrs <= 2) buckets["0-2h"]++;
    else if (hrs <= 4) buckets["2-4h"]++;
    else if (hrs <= 8) buckets["4-8h"]++;
    else if (hrs <= 24) buckets["8-24h"]++;
    else buckets["24h+"]++;
    if (!oldest || new Date(r.timestamp) < new Date(oldest.timestamp)) oldest = r;
  });
  return { buckets, oldest };
}

function computeFranchiseStats(rows) {
  const map = {};
  rows.forEach((r) => {
    const id = r.franchiseId || "Unknown";
    if (!map[id]) {
      map[id] = { franchiseId: id, total: 0, completed: 0, pending: 0, rejected: 0, lastSubmission: null, rejectionReasons: {} };
    }
    const f = map[id];
    f.total++;
    if (r.status === "Done") f.completed++;
    else if (r.status === "Rejected") {
      f.rejected++;
      const reason = r.rejectionReason || "Unspecified";
      f.rejectionReasons[reason] = (f.rejectionReasons[reason] || 0) + 1;
    } else f.pending++;
    if (!f.lastSubmission || new Date(r.timestamp) > new Date(f.lastSubmission)) {
      f.lastSubmission = r.timestamp;
    }
  });
  return Object.values(map).map((f) => {
    let topReason = null, topCount = 0;
    Object.entries(f.rejectionReasons).forEach(([reason, count]) => {
      if (count > topCount) { topReason = reason; topCount = count; }
    });
    return {
      ...f,
      completionPct: pct(f.completed, f.total),
      rejectionPct: pct(f.rejected, f.total),
      topRejectionReason: topReason,
    };
  }).sort((a, b) => b.total - a.total);
}

function computeTeamStats(rows) {
  const map = {};
  TEAM_NAMES.forEach((name) => {
    map[name] = { name, processed: 0, completed: 0, rejected: 0, totalHrs: 0, hrsCount: 0 };
  });
  rows.forEach((r) => {
    if (!r.processedBy || !map[r.processedBy]) return;
    const m = map[r.processedBy];
    m.processed++;
    if (r.status === "Done") m.completed++;
    else if (r.status === "Rejected") m.rejected++;
    if (r.processedAt) {
      const h = (new Date(r.processedAt) - new Date(r.timestamp)) / 36e5;
      m.totalHrs += Math.max(h, 0);
      m.hrsCount++;
    }
  });
  const totalProcessed = Object.values(map).reduce((s, m) => s + m.processed, 0);
  return Object.values(map).map((m) => ({
    ...m,
    rejectionPct: pct(m.rejected, m.processed),
    sharePct: pct(m.processed, totalProcessed),
    avgHrs: m.hrsCount > 0 ? m.totalHrs / m.hrsCount : null,
  }));
}

function computeRejectionStats(rows) {
  const rejectedRows = rows.filter((r) => r.status === "Rejected");
  const reasonCounts = {};
  rejectedRows.forEach((r) => {
    const reason = r.rejectionReason || "Unspecified";
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });
  const total = rejectedRows.length;
  const breakdown = Object.entries(reasonCounts)
    .map(([reason, count]) => ({ reason, count, pct: pct(count, total) }))
    .sort((a, b) => b.count - a.count);

  const byFranchise = {};
  rejectedRows.forEach((r) => {
    byFranchise[r.franchiseId] = (byFranchise[r.franchiseId] || 0) + 1;
  });
  const byMember = {};
  rejectedRows.forEach((r) => {
    if (r.processedBy) byMember[r.processedBy] = (byMember[r.processedBy] || 0) + 1;
  });

  const byDay = {};
  rejectedRows.forEach((r) => {
    const day = new Date(r.timestamp).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  });

  return {
    total,
    breakdown,
    top5: breakdown.slice(0, 5),
    byFranchise: Object.entries(byFranchise).sort((a, b) => b[1] - a[1]),
    byMember: Object.entries(byMember).sort((a, b) => b[1] - a[1]),
    trend: Object.entries(byDay).sort((a, b) => (a[0] < b[0] ? -1 : 1)),
  };
}

function computeDailyVolume(rows) {
  const byDay = {};
  rows.forEach((r) => {
    const day = new Date(r.timestamp).toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = { total: 0, completed: 0, pending: 0, rejected: 0 };
    byDay[day].total++;
    if (r.status === "Done") byDay[day].completed++;
    else if (r.status === "Rejected") byDay[day].rejected++;
    else byDay[day].pending++;
  });
  return Object.entries(byDay).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([day, v]) => ({ day, ...v }));
}

function computeInsights(periodRows, prevRows, franchiseStats, teamStats, rejectionStats, aging) {
  const insights = [];

  if (franchiseStats.length > 0) {
    const topVolume = franchiseStats[0];
    const totalAll = periodRows.length;
    if (totalAll > 0) {
      insights.push(
        `${topVolume.franchiseId} submitted ${pct(topVolume.total, totalAll)}% of all mappings in this period` +
        (topVolume.pending === Math.max(...franchiseStats.map((f) => f.pending)) && topVolume.pending > 0
          ? " and currently has the highest pending workload."
          : ".")
      );
    }
    const byRejection = [...franchiseStats].filter((f) => f.total >= 3).sort((a, b) => b.rejectionPct - a.rejectionPct)[0];
    if (byRejection && byRejection.rejectionPct > 0) {
      insights.push(`${byRejection.franchiseId} has the highest rejection rate at ${byRejection.rejectionPct}%.`);
    }
    const byPending = [...franchiseStats].sort((a, b) => b.pending - a.pending)[0];
    if (byPending && byPending.pending > 0) {
      insights.push(`${byPending.franchiseId} has the most pending mappings (${byPending.pending}).`);
    }
  }

  if (rejectionStats.top5.length > 0) {
    insights.push(`Most common rejection reason: "${rejectionStats.top5[0].reason}" (${rejectionStats.top5[0].count} cases, ${rejectionStats.top5[0].pct}% of rejections).`);
  }

  const byProcessed = [...teamStats].sort((a, b) => b.processed - a.processed)[0];
  if (byProcessed && byProcessed.processed > 0) {
    insights.push(`${byProcessed.name} processed the most mappings (${byProcessed.processed}, ${byProcessed.sharePct}% of team total).`);
  }
  const byRejectionRate = [...teamStats].filter((m) => m.processed >= 3).sort((a, b) => b.rejectionPct - a.rejectionPct)[0];
  if (byRejectionRate && byRejectionRate.rejectionPct > 0) {
    insights.push(`${byRejectionRate.name} has the highest rejection rate among the team at ${byRejectionRate.rejectionPct}%.`);
  }

  // Peak submission hour
  if (periodRows.length > 0) {
    const hourCounts = {};
    periodRows.forEach((r) => {
      const h = new Date(r.timestamp).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    if (peakHour) {
      const h = parseInt(peakHour[0]);
      const label = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
      insights.push(`Peak submission hour is around ${label} (${peakHour[1]} mappings).`);
    }

    const dayCounts = {};
    periodRows.forEach((r) => {
      const d = new Date(r.timestamp).toLocaleDateString(undefined, { weekday: "long" });
      dayCounts[d] = (dayCounts[d] || 0) + 1;
    });
    const peakDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
    if (peakDay) insights.push(`${peakDay[0]}s see the highest mapping volume (${peakDay[1]} total).`);
  }

  // Trend vs previous period
  if (prevRows) {
    const curTotal = periodRows.length;
    const prevTotal = prevRows.length;
    if (prevTotal > 0) {
      const change = pct(curTotal - prevTotal, prevTotal);
      insights.push(`Mapping volume is ${change >= 0 ? "up" : "down"} ${Math.abs(change)}% vs the previous period (${prevTotal} → ${curTotal}).`);
    }
    const curRejPct = pct(periodRows.filter((r) => r.status === "Rejected").length, curTotal);
    const prevRejPct = pct(prevRows.filter((r) => r.status === "Rejected").length, prevTotal);
    if (prevTotal > 0 && curTotal > 0) {
      insights.push(`Rejection rate is ${curRejPct <= prevRejPct ? "improving" : "worsening"} (${prevRejPct}% → ${curRejPct}%).`);
    }
  }

  if (aging && aging.buckets["24h+"] > 0) {
    insights.push(`${aging.buckets["24h+"]} mapping(s) have been pending for over 24 hours and need attention.`);
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Small reusable UI pieces
// ---------------------------------------------------------------------------
function Field({ label, required, children }) {
  return (
    <div className="mb-5">
      <span className="block text-xs uppercase text-blue-900/60 font-bold mb-1.5 tracking-wide">
        {label}
        {required && <span style={{ color: BRAND.telenorBlue }} className="ml-1">*</span>}
      </span>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-white outline-none rounded-2xl px-4 py-2.5 text-blue-950 placeholder-blue-300 text-sm border-2 tel-input";

function StatusBadge({ status }) {
  const s = status || "Pending";
  const style =
    s === "Done"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : s === "Rejected"
      ? "bg-rose-50 text-rose-600 border-rose-200"
      : "bg-amber-50 text-amber-600 border-amber-200";
  return (
    <span className={`border rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${style}`}>
      {s}
    </span>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="bg-white border-2 tel-card rounded-2xl px-4 py-3 min-w-[140px]">
      <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wide mb-1">{label}</div>
      <div className="text-xl font-black" style={{ color: BRAND.darkBlue }}>{value}</div>
      {sub && <div className="text-[11px] text-blue-300 mt-0.5">{sub}</div>}
    </div>
  );
}

function HBar({ label, value, total, color }) {
  const width = total > 0 ? Math.max((value / total) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-blue-950 font-medium truncate pr-2">{label}</span>
        <span className="text-blue-400 font-semibold whitespace-nowrap">{value}</span>
      </div>
      <div className="w-full bg-blue-50 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full" style={{ width: `${width}%`, backgroundColor: color || BRAND.telenorBlue }} />
      </div>
    </div>
  );
}

function TrendBars({ data, valueKey = "total", height = 90 }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
          <div
            className="w-full rounded-t"
            style={{
              height: `${Math.max((d[valueKey] / max) * 100, d[valueKey] > 0 ? 4 : 0)}%`,
              backgroundColor: BRAND.telenorBlue,
              minWidth: 4,
            }}
            title={`${d.day}: ${d[valueKey]}`}
          />
        </div>
      ))}
    </div>
  );
}

function Modal({ onClose, children, title }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ color: BRAND.darkBlue }}>{title}</h3>
          <button onClick={onClose} className="text-blue-300 hover:text-blue-600 text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-blue-50 text-sm">
      <span className="text-blue-400">{label}</span>
      <span className="font-semibold text-right" style={{ color: BRAND.darkBlue }}>{value || "—"}</span>
    </div>
  );
}

function MappingDetailModal({ record, onClose }) {
  if (!record) return null;
  return (
    <Modal onClose={onClose} title="Mapping Details">
      <div className="mb-3"><StatusBadge status={record.status} /></div>
      <DetailRow label="Franchise ID" value={record.franchiseId} />
      <DetailRow label="EasyLOAD Number" value={record.easyload} />
      <DetailRow label="Seller Code / Retailer ID" value={record.sellerCode} />
      <DetailRow label="MB Postpaid Number" value={record.postpaid} />
      <DetailRow label="IMEI Number" value={record.imei} />
      <DetailRow label="FS Mapping" value={record.fsMapping} />
      {record.fsMapping === "Yes FS Mapping" && (
        <>
          <DetailRow label="EasyPaisa POS Number" value={record.easypaisaPos} />
          <DetailRow label="EP/FS User ID" value={record.epFsUserId} />
        </>
      )}
      <DetailRow label="Submitted" value={fmtDate(record.timestamp)} />
      <DetailRow label="Processed By" value={record.processedBy} />
      <DetailRow label="Processed At" value={fmtDate(record.processedAt)} />
      {record.status === "Rejected" && (
        <DetailRow label="Rejection Reason" value={record.rejectionReason} />
      )}
    </Modal>
  );
}

function DateFilterBar({ preset, setPreset, customStart, setCustomStart, customEnd, setCustomEnd, compare, setCompare }) {
  return (
    <div className="bg-white border-2 tel-card rounded-2xl p-3 mb-5 flex flex-wrap items-center gap-2">
      {DATE_PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => setPreset(p.key)}
          className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          style={
            preset === p.key
              ? { backgroundColor: BRAND.telenorBlue, color: "#fff" }
              : { backgroundColor: BRAND.offWhite, color: BRAND.midBlue }
          }
        >
          {p.label}
        </button>
      ))}
      {preset === "custom" && (
        <div className="flex items-center gap-2 ml-1">
          <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="text-xs border-2 tel-input rounded-lg px-2 py-1.5" />
          <span className="text-blue-300 text-xs">to</span>
          <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="text-xs border-2 tel-input rounded-lg px-2 py-1.5" />
        </div>
      )}
      <label className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-blue-400 cursor-pointer">
        <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
        Compare to previous period
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------
export default function BVSPortal() {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem("bvs_session");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    const rawId = loginId.trim();
    const masterKey = rawId.toLowerCase();

    if (MASTER_ACCOUNTS[masterKey] && MASTER_ACCOUNTS[masterKey].password === loginPass) {
      const acc = MASTER_ACCOUNTS[masterKey];
      const newSession = { type: "master", id: masterKey, name: acc.name, role: acc.role };
      setLoginError("");
      try { localStorage.setItem("bvs_session", JSON.stringify(newSession)); } catch (e) {}
      setSession(newSession);
      return;
    }

    const franchiseId = rawId.toUpperCase();
    if (FRANCHISES[franchiseId] && FRANCHISES[franchiseId] === loginPass) {
      const newSession = { type: "franchise", id: franchiseId };
      setLoginError("");
      try { localStorage.setItem("bvs_session", JSON.stringify(newSession)); } catch (e) {}
      setSession(newSession);
      return;
    }

    setLoginError("ID or password is incorrect.");
  }

  function handleLoginKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  function handleLogout() {
    try { localStorage.removeItem("bvs_session"); } catch (e) {}
    setSession(null);
    setLoginId("");
    setLoginPass("");
  }

  // ---------- LOGIN SCREEN ----------
  if (!session) {
    return (
      <div className="min-h-screen tel-bg-gradient flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg overflow-hidden bg-white"
              style={{ boxShadow: `0 10px 25px -5px ${BRAND.telenorBlue}66` }}
            >
              <img src={LOGO_DATA_URI} alt="Telenor" className="w-11 h-11 object-contain" />
            </div>
            <h1 className="text-3xl font-black leading-tight" style={{ color: BRAND.darkBlue }}>
              BVS Mapping Portal
            </h1>
            <div className="font-bold text-xs uppercase tracking-[0.2em] mt-1.5" style={{ color: BRAND.telenorBlue }}>
              telenor — south 1
            </div>
            <p className="text-blue-400 text-sm mt-3">Sign in to continue</p>
          </div>

          <div className="bg-white border-2 tel-card rounded-3xl p-6 shadow-sm" style={{ boxShadow: `0 4px 20px -8px ${BRAND.lightBlue}` }}>
            <Field label="Franchise ID or Team Login" required>
              <input
                className={inputClass}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyDown={handleLoginKeyDown}
                placeholder="Enter your user ID"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase font-bold"
                  style={{ color: BRAND.midBlue }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {loginError && <p className="text-rose-500 text-sm mb-4">{loginError}</p>}

            <button onClick={handleLogin} className="w-full tel-btn-primary text-white font-bold rounded-full py-3">
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (session.type === "master") {
    return <MasterDashboard session={session} onLogout={handleLogout} />;
  }

  return <FranchisePortal franchiseId={session.id} onLogout={handleLogout} />;
}

// ---------------------------------------------------------------------------
// Franchise portal: submission form + Past Mappings view
// ---------------------------------------------------------------------------
function FranchisePortal({ franchiseId, onLogout }) {
  const [view, setView] = useState("form"); // "form" | "past"

  return (
    <div className="min-h-screen tel-bg-gradient">
      <header className="tel-header-gradient px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
            <img src={LOGO_DATA_URI} alt="Telenor" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">BVS Mapping Portal</div>
            <div className="font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: BRAND.telenorBlue }}>telenor — south 1</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: BRAND.lightBlue }}>{franchiseId}</span>
          <button onClick={onLogout} className="text-white text-sm border-2 border-white/30 hover:border-white/60 rounded-full px-4 py-1.5 font-semibold transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("form")}
            className="text-sm font-bold px-4 py-2 rounded-full"
            style={view === "form" ? { backgroundColor: BRAND.telenorBlue, color: "#fff" } : { backgroundColor: BRAND.offWhite, color: BRAND.midBlue }}
          >
            Submit Mapping
          </button>
          <button
            onClick={() => setView("past")}
            className="text-sm font-bold px-4 py-2 rounded-full"
            style={view === "past" ? { backgroundColor: BRAND.telenorBlue, color: "#fff" } : { backgroundColor: BRAND.offWhite, color: BRAND.midBlue }}
          >
            Show Past Mappings
          </button>
        </div>

        {view === "form" ? (
          <MappingForm franchiseId={franchiseId} />
        ) : (
          <PastMappingsView franchiseId={franchiseId} />
        )}
      </main>
    </div>
  );
}

function MappingForm({ franchiseId }) {
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
    if (!form.easyload.trim()) e.easyload = "Required";
    else if (!/^03\d{9}$/.test(form.easyload.trim())) e.easyload = 'Must be 11 digits, e.g. "03401118899"';
    if (!form.postpaid.trim()) e.postpaid = "Required";
    else if (!/^03\d{9}$/.test(form.postpaid.trim())) e.postpaid = 'Must be 11 digits, e.g. "03401118899"';
    if (!form.imei.trim()) e.imei = "Required";
    else if (!/^\d{15}$/.test(form.imei.trim())) e.imei = 'Must be 15 digits, e.g. "350925890354812"';
    if (!form.fsMapping) e.fsMapping = "Required";
    if (form.fsMapping === "Yes FS Mapping") {
      if (!form.easypaisaPos.trim()) e.easypaisaPos = "Required";
      else if (!/^92\d{10}$/.test(form.easypaisaPos.trim())) e.easypaisaPos = 'Use format 92XXXXXXXXXX, e.g. "923452821234"';
      if (!form.epFsUserId.trim()) e.epFsUserId = "Required";
      else if (!/^\d{4}$/.test(form.epFsUserId.trim())) e.epFsUserId = "Must be 4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    const record = { franchiseId, ...form, submittedAt: new Date().toISOString() };

    try {
      const params = new URLSearchParams({ action: "submit", ...record });
      const data = await jsonpRequest(`${APPS_SCRIPT_URL}?${params.toString()}`);
      if (data.status !== "ok") throw new Error(data.message || "Failed to save");
      setForm(emptyForm);
      setJustSubmitted(true);
    } catch (err) {
      setSubmitError("Couldn't sync to the sheet: " + ((err && err.message) || "unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {justSubmitted && (
        <div className="mb-6 border-2 rounded-2xl px-4 py-3 flex items-center justify-between" style={{ borderColor: BRAND.telenorBlue, backgroundColor: BRAND.offWhite, color: BRAND.darkBlue }}>
          <span className="font-semibold">Mapping submitted and saved to sheet.</span>
          <button onClick={() => setJustSubmitted(false)} className="text-xs uppercase font-bold" style={{ color: BRAND.midBlue }}>Dismiss</button>
        </div>
      )}
      {submitError && (
        <div className="mb-6 border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm rounded-2xl px-4 py-3">{submitError}</div>
      )}

      <h2 className="font-bold mb-1" style={{ color: BRAND.darkBlue }}>Submit a mapping</h2>
      <p className="text-blue-400 text-sm mb-6">Submitting as <span className="font-semibold" style={{ color: BRAND.midBlue }}>{franchiseId}</span></p>

      <div className="bg-white border-2 tel-card rounded-3xl p-6 shadow-sm" style={{ boxShadow: `0 4px 20px -8px ${BRAND.lightBlue}` }}>
        <Field label="Retailer EasyLOAD Number" required>
          <input className={inputClass} value={form.easyload} onChange={(e) => updateField("easyload", e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="03401118899" inputMode="numeric" />
          {errors.easyload && <p className="text-rose-500 text-xs mt-1">{errors.easyload}</p>}
        </Field>
        <Field label="GSM Seller Code / Retailer ID">
          <input className={inputClass} value={form.sellerCode} onChange={(e) => updateField("sellerCode", e.target.value)} placeholder="Your answer" />
        </Field>
        <Field label="MB Postpaid Number" required>
          <input className={inputClass} value={form.postpaid} onChange={(e) => updateField("postpaid", e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="03401118899" inputMode="numeric" />
          {errors.postpaid && <p className="text-rose-500 text-xs mt-1">{errors.postpaid}</p>}
        </Field>
        <Field label="IMEI Number" required>
          <input className={inputClass} value={form.imei} onChange={(e) => updateField("imei", e.target.value.replace(/\D/g, "").slice(0, 15))} placeholder="350925890354812" inputMode="numeric" />
          {errors.imei && <p className="text-rose-500 text-xs mt-1">{errors.imei}</p>}
        </Field>
        <Field label="Enter FS Mapping as well?" required>
          <select className={inputClass} value={form.fsMapping} onChange={(e) => updateField("fsMapping", e.target.value)}>
            <option value="">Choose</option>
            <option value="No FS Mapping">No FS Mapping</option>
            <option value="Yes FS Mapping">Yes FS Mapping</option>
          </select>
          {errors.fsMapping && <p className="text-rose-500 text-xs mt-1">{errors.fsMapping}</p>}
        </Field>

        {form.fsMapping === "Yes FS Mapping" && (
          <div className="border-t-2 pt-5 mt-1" style={{ borderColor: BRAND.offWhite }}>
            <div className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: BRAND.telenorBlue }}>FS BVS Mapping</div>
            <Field label="Retailer Easy PAISA POS Number" required>
              <input className={inputClass} value={form.easypaisaPos} onChange={(e) => updateField("easypaisaPos", e.target.value)} placeholder='92XXXXXXXXXX e.g. "923452821234"' inputMode="numeric" />
              {errors.easypaisaPos && <p className="text-rose-500 text-xs mt-1">{errors.easypaisaPos}</p>}
            </Field>
            <Field label="EP/FS USER ID (4-Digit)" required>
              <input className={inputClass} value={form.epFsUserId} onChange={(e) => updateField("epFsUserId", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Your answer" inputMode="numeric" />
              {errors.epFsUserId && <p className="text-rose-500 text-xs mt-1">{errors.epFsUserId}</p>}
            </Field>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting} className="w-full tel-btn-primary disabled:opacity-60 text-white font-bold rounded-full py-3 mt-2">
          {submitting ? "Submitting…" : "Submit mapping"}
        </button>
      </div>

      <div className="mt-6 border-2 tel-card rounded-2xl px-5 py-4 bg-white">
        <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: BRAND.telenorBlue }}>
          Need Help?
        </div>
        <p className="text-sm mb-1" style={{ color: BRAND.darkBlue }}>
          For any kind of support and concerns, please contact:
        </p>
        <p className="text-sm font-semibold" style={{ color: BRAND.darkBlue }}>
          Sohaib Zuberi — Operational Support Officer, South 1
        </p>
        <p className="text-sm text-blue-400">
          03401118899 · sohaib.zubairi-tpc@telenor.com.pk
        </p>
      </div>
    </>
  );
}

function PastMappingsView({ franchiseId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, [franchiseId]);

  function load() {
    setLoading(true);
    setError("");
    const url = `${APPS_SCRIPT_URL}?action=getSubmissions&franchiseId=${encodeURIComponent(franchiseId)}`;
    jsonpRequest(url)
      .then((data) => {
        if (data.status === "ok" && Array.isArray(data.submissions)) {
          setRows(data.submissions);
        } else {
          setError(data.message || "Failed to load");
        }
      })
      .catch((err) => setError((err && err.message) || "Failed to load"))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold" style={{ color: BRAND.darkBlue }}>Past Mappings {rows.length > 0 && `(${rows.length})`}</h2>
        <button onClick={load} disabled={loading} className="text-xs font-bold uppercase disabled:opacity-50" style={{ color: BRAND.midBlue }}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && <div className="mb-4 border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm rounded-2xl px-4 py-3">{error}</div>}

      {rows.length === 0 && !loading ? (
        <p className="text-blue-300 text-sm">No mappings submitted yet.</p>
      ) : (
        <div className="bg-white border-2 tel-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: BRAND.offWhite }}>
                <th className="text-left px-4 py-2.5 font-bold text-xs uppercase" style={{ color: BRAND.midBlue }}>eLoad Number</th>
                <th className="text-left px-4 py-2.5 font-bold text-xs uppercase" style={{ color: BRAND.midBlue }}>IMEI Number</th>
                <th className="text-left px-4 py-2.5 font-bold text-xs uppercase" style={{ color: BRAND.midBlue }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(r)}
                  className="border-t border-blue-50 cursor-pointer hover:bg-blue-50/40"
                >
                  <td className="px-4 py-2.5" style={{ color: BRAND.darkBlue }}>{r.easyload}</td>
                  <td className="px-4 py-2.5" style={{ color: BRAND.darkBlue }}>{r.imei}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <MappingDetailModal record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Master Dashboard (Sohaib = "super" role gets everything, Hammad/Husnain =
// "ops" role get the operational subset)
// ---------------------------------------------------------------------------
function MasterDashboard({ session, onLogout }) {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const [preset, setPreset] = useState("thisMonth");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [compare, setCompare] = useState(false);

  const [franchiseFilter, setFranchiseFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const isSuper = session.role === "super";

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    setError("");
    jsonpRequest(`${APPS_SCRIPT_URL}?action=getAllSubmissions`)
      .then((data) => {
        if (data.status === "ok" && Array.isArray(data.submissions)) {
          setAllRows(data.submissions);
        } else {
          setError(data.message || "Failed to load");
        }
      })
      .catch((err) => setError((err && err.message) || "Failed to load"))
      .finally(() => setLoading(false));
  }

  const { start, end } = useMemo(() => getRangeForPreset(preset, customStart, customEnd), [preset, customStart, customEnd]);
  const { start: prevStart, end: prevEnd } = useMemo(() => getPreviousRange(start, end), [start, end]);

  const periodRows = useMemo(() => filterByRange(allRows, start, end), [allRows, start, end]);
  const prevRows = useMemo(() => (compare ? filterByRange(allRows, prevStart, prevEnd) : null), [allRows, prevStart, prevEnd, compare]);

  const kpis = useMemo(() => computeKPIs(periodRows), [periodRows]);
  const prevKpis = useMemo(() => (prevRows ? computeKPIs(prevRows) : null), [prevRows]);

  const todayCount = useMemo(() => filterByRange(allRows, startOfDay(new Date()), endOfDay(new Date())).length, [allRows]);
  const thisMonthCount = useMemo(() => filterByRange(allRows, startOfMonth(new Date()), endOfDay(new Date())).length, [allRows]);

  const pendingRows = useMemo(() => periodRows.filter((r) => r.status === "Pending" || !r.status), [periodRows]);
  const allPendingRows = useMemo(() => allRows.filter((r) => r.status === "Pending" || !r.status), [allRows]);
  const aging = useMemo(() => computeAging(allPendingRows), [allPendingRows]);

  const franchiseStats = useMemo(() => computeFranchiseStats(periodRows), [periodRows]);
  const teamStats = useMemo(() => computeTeamStats(periodRows), [periodRows]);
  const rejectionStats = useMemo(() => computeRejectionStats(periodRows), [periodRows]);
  const dailyVolume = useMemo(() => computeDailyVolume(periodRows), [periodRows]);
  const insights = useMemo(
    () => computeInsights(periodRows, prevRows, franchiseStats, teamStats, rejectionStats, aging),
    [periodRows, prevRows, franchiseStats, teamStats, rejectionStats, aging]
  );

  const pendingByFranchise = useMemo(() => {
    const map = {};
    pendingRows.forEach((r) => { map[r.franchiseId] = (map[r.franchiseId] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [pendingRows]);

  const pendingByDay = useMemo(() => {
    const map = {};
    pendingRows.forEach((r) => {
      const day = new Date(r.timestamp).toISOString().slice(0, 10);
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, [pendingRows]);

  const selectedFranchiseStats = useMemo(
    () => franchiseStats.find((f) => f.franchiseId === franchiseFilter) || null,
    [franchiseStats, franchiseFilter]
  );

  const searchResults = useMemo(() => {
    if (!search.trim() && !searchStatus) return [];
    const q = search.trim().toLowerCase();
    return allRows.filter((r) => {
      if (searchStatus && r.status !== searchStatus) return false;
      if (!q) return true;
      return (
        (r.easyload || "").toLowerCase().includes(q) ||
        (r.imei || "").toLowerCase().includes(q) ||
        (r.franchiseId || "").toLowerCase().includes(q) ||
        (r.processedBy || "").toLowerCase().includes(q) ||
        (r.rejectionReason || "").toLowerCase().includes(q)
      );
    }).slice(0, 100);
  }, [allRows, search, searchStatus]);

  function delta(cur, prev) {
    if (prev == null) return null;
    if (prev === 0) return cur > 0 ? "+100%" : "0%";
    const d = Math.round(((cur - prev) / prev) * 1000) / 10;
    return `${d >= 0 ? "+" : ""}${d}%`;
  }

  return (
    <div className="min-h-screen tel-bg-gradient">
      <header className="tel-header-gradient px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
            <img src={LOGO_DATA_URI} alt="Telenor" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">
              {isSuper ? "Mapping Operations Intelligence" : "Mapping Operations Dashboard"}
            </div>
            <div className="font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: BRAND.telenorBlue }}>telenor — south 1</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: BRAND.lightBlue }}>{session.name}</span>
          <button onClick={onLogout} className="text-white text-sm border-2 border-white/30 hover:border-white/60 rounded-full px-4 py-1.5 font-semibold transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && <div className="mb-4 border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm rounded-2xl px-4 py-3">{error}</div>}
        {loading ? (
          <p className="text-blue-300 text-sm">Loading data…</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-lg" style={{ color: BRAND.darkBlue }}>Overview</h2>
              <button onClick={load} className="text-xs font-bold uppercase" style={{ color: BRAND.midBlue }}>Refresh Data</button>
            </div>
            <DateFilterBar
              preset={preset} setPreset={setPreset}
              customStart={customStart} setCustomStart={setCustomStart}
              customEnd={customEnd} setCustomEnd={setCustomEnd}
              compare={compare} setCompare={setCompare}
            />

            {/* TOP-LEVEL KPI CARDS */}
            <div className="flex flex-wrap gap-3 mb-8">
              <KpiCard label="Total Mappings (all time)" value={allRows.length} />
              <KpiCard label="Today" value={todayCount} />
              <KpiCard label="This Month" value={thisMonthCount} />
              <KpiCard label="Pending (period)" value={kpis.pending} sub={compare ? delta(kpis.pending, prevKpis?.pending) : null} />
              <KpiCard label="Completed (period)" value={kpis.completed} sub={compare ? delta(kpis.completed, prevKpis?.completed) : null} />
              <KpiCard label="Rejected (period)" value={kpis.rejected} sub={compare ? delta(kpis.rejected, prevKpis?.rejected) : null} />
              <KpiCard label="Completion Rate" value={`${kpis.completionRate}%`} sub={compare ? delta(kpis.completionRate, prevKpis?.completionRate) : null} />
              <KpiCard label="Rejection Rate" value={`${kpis.rejectionRate}%`} sub={compare ? delta(kpis.rejectionRate, prevKpis?.rejectionRate) : null} />
              <KpiCard label="Avg Processing Time" value={fmtHours(kpis.avgProcessingHours)} />
              <KpiCard label="Franchises Submitting" value={kpis.totalFranchises} />
              <KpiCard label="Total Processed" value={kpis.totalProcessed} />
            </div>

            {/* OPERATIONS: PENDING WORKLOAD */}
            <SectionHeader title="Pending Workload (all time, real-time)" />
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border-2 tel-card rounded-2xl p-5">
                <div className="text-xs font-bold uppercase mb-3" style={{ color: BRAND.midBlue }}>Aging Buckets</div>
                {Object.entries(aging.buckets).map(([bucket, count]) => (
                  <HBar key={bucket} label={bucket} value={count} total={allPendingRows.length} color={bucket === "24h+" ? "#f43f5e" : BRAND.telenorBlue} />
                ))}
                <div className="text-xs text-blue-400 mt-3">
                  Oldest pending: {aging.oldest ? `${aging.oldest.franchiseId} — ${fmtDate(aging.oldest.timestamp)}` : "None"}
                </div>
              </div>
              <div className="bg-white border-2 tel-card rounded-2xl p-5">
                <div className="text-xs font-bold uppercase mb-3" style={{ color: BRAND.midBlue }}>Pending by Franchise (selected period)</div>
                {pendingByFranchise.length === 0 ? (
                  <p className="text-blue-300 text-sm">No pending mappings in this period.</p>
                ) : (
                  pendingByFranchise.slice(0, 8).map(([fid, count]) => (
                    <HBar key={fid} label={fid} value={count} total={pendingRows.length} />
                  ))
                )}
              </div>
            </div>

            {/* FRANCHISE INSIGHTS */}
            <SectionHeader title="Franchise Insights" />
            <div className="bg-white border-2 tel-card rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs font-bold uppercase" style={{ color: BRAND.midBlue }}>Select a franchise:</span>
                <select className={inputClass + " max-w-xs"} value={franchiseFilter} onChange={(e) => setFranchiseFilter(e.target.value)}>
                  <option value="">— Overview (all franchises) —</option>
                  {franchiseStats.map((f) => (
                    <option key={f.franchiseId} value={f.franchiseId}>{f.franchiseId}</option>
                  ))}
                </select>
              </div>

              {selectedFranchiseStats ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  <KpiCard label="Total Submitted" value={selectedFranchiseStats.total} />
                  <KpiCard label="Completed" value={selectedFranchiseStats.completed} />
                  <KpiCard label="Pending" value={selectedFranchiseStats.pending} />
                  <KpiCard label="Rejected" value={selectedFranchiseStats.rejected} />
                  <KpiCard label="Completion %" value={`${selectedFranchiseStats.completionPct}%`} />
                  <KpiCard label="Rejection %" value={`${selectedFranchiseStats.rejectionPct}%`} />
                  <KpiCard label="Most Recent Submission" value={fmtDate(selectedFranchiseStats.lastSubmission)} />
                  <KpiCard label="Top Rejection Reason" value={selectedFranchiseStats.topRejectionReason || "—"} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: BRAND.offWhite }}>
                        {["Franchise", "Total", "Completed", "Pending", "Rejected", "Completion %", "Rejection %"].map((h) => (
                          <th key={h} className="text-left px-3 py-2 font-bold text-xs uppercase" style={{ color: BRAND.midBlue }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {franchiseStats.slice(0, 15).map((f) => (
                        <tr key={f.franchiseId} className="border-t border-blue-50 cursor-pointer hover:bg-blue-50/40" onClick={() => setFranchiseFilter(f.franchiseId)}>
                          <td className="px-3 py-2 font-semibold" style={{ color: BRAND.darkBlue }}>{f.franchiseId}</td>
                          <td className="px-3 py-2">{f.total}</td>
                          <td className="px-3 py-2 text-emerald-600">{f.completed}</td>
                          <td className="px-3 py-2 text-amber-600">{f.pending}</td>
                          <td className="px-3 py-2 text-rose-600">{f.rejected}</td>
                          <td className="px-3 py-2">{f.completionPct}%</td>
                          <td className="px-3 py-2">{f.rejectionPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {isSuper && (
              <>
                {/* TEAM PERFORMANCE */}
                <SectionHeader title="Team Performance" />
                <div className="bg-white border-2 tel-card rounded-2xl p-5 mb-8">
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: BRAND.offWhite }}>
                          {["Team Member", "Processed", "Done", "Rejected", "Rejection %", "Share of Total", "Avg Processing Time"].map((h) => (
                            <th key={h} className="text-left px-3 py-2 font-bold text-xs uppercase" style={{ color: BRAND.midBlue }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {teamStats.map((m) => (
                          <tr key={m.name} className="border-t border-blue-50">
                            <td className="px-3 py-2 font-semibold" style={{ color: BRAND.darkBlue }}>{m.name}</td>
                            <td className="px-3 py-2">{m.processed}</td>
                            <td className="px-3 py-2 text-emerald-600">{m.completed}</td>
                            <td className="px-3 py-2 text-rose-600">{m.rejected}</td>
                            <td className="px-3 py-2">{m.rejectionPct}%</td>
                            <td className="px-3 py-2">{m.sharePct}%</td>
                            <td className="px-3 py-2">{fmtHours(m.avgHrs)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-xs font-bold uppercase mb-2" style={{ color: BRAND.midBlue }}>Workload Share</div>
                  {teamStats.map((m) => (
                    <HBar key={m.name} label={m.name} value={m.processed} total={kpis.totalProcessed} />
                  ))}
                </div>

                {/* REJECTION INTELLIGENCE */}
                <SectionHeader title="Rejection Intelligence" />
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white border-2 tel-card rounded-2xl p-5">
                    <div className="text-xs font-bold uppercase mb-3" style={{ color: BRAND.midBlue }}>Rejection Reasons</div>
                    {rejectionStats.breakdown.length === 0 ? (
                      <p className="text-blue-300 text-sm">No rejections in this period.</p>
                    ) : (
                      rejectionStats.breakdown.map((r) => (
                        <HBar key={r.reason} label={`${r.reason} (${r.pct}%)`} value={r.count} total={rejectionStats.total} color="#f43f5e" />
                      ))
                    )}
                  </div>
                  <div className="bg-white border-2 tel-card rounded-2xl p-5">
                    <div className="text-xs font-bold uppercase mb-3" style={{ color: BRAND.midBlue }}>Rejections by Franchise</div>
                    {rejectionStats.byFranchise.length === 0 ? (
                      <p className="text-blue-300 text-sm">None in this period.</p>
                    ) : (
                      rejectionStats.byFranchise.slice(0, 8).map(([fid, count]) => (
                        <HBar key={fid} label={fid} value={count} total={rejectionStats.total} color="#f43f5e" />
                      ))
                    )}
                  </div>
                </div>

                {/* TRENDS & INSIGHTS */}
                <SectionHeader title="Trends & Insights" />
                <div className="bg-white border-2 tel-card rounded-2xl p-5 mb-4">
                  <div className="text-xs font-bold uppercase mb-3" style={{ color: BRAND.midBlue }}>Daily Mapping Volume</div>
                  <TrendBars data={dailyVolume} />
                  <div className="flex justify-between text-[10px] text-blue-300 mt-1">
                    <span>{dailyVolume[0]?.day}</span>
                    <span>{dailyVolume[dailyVolume.length - 1]?.day}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-8">
                  {insights.length === 0 ? (
                    <p className="text-blue-300 text-sm">Not enough data yet for insights.</p>
                  ) : (
                    insights.map((text, i) => (
                      <div key={i} className="border-2 rounded-2xl px-4 py-3 text-sm" style={{ borderColor: BRAND.lightBlue, backgroundColor: BRAND.offWhite, color: BRAND.darkBlue }}>
                        💡 {text}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* DETAILED SEARCH */}
            <SectionHeader title="Detailed Mapping Search" />
            <div className="bg-white border-2 tel-card rounded-2xl p-5 mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  className={inputClass + " max-w-xs"}
                  placeholder="Search eLoad, IMEI, franchise, processor, reason…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className={inputClass + " max-w-[160px]"} value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                  <option value="">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-blue-300 text-sm">{search || searchStatus ? "No matches." : "Type to search across all mappings."}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: BRAND.offWhite }}>
                        {["Franchise", "eLoad", "IMEI", "Status", "Processed By"].map((h) => (
                          <th key={h} className="text-left px-3 py-2 font-bold text-xs uppercase" style={{ color: BRAND.midBlue }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((r, i) => (
                        <tr key={i} className="border-t border-blue-50 cursor-pointer hover:bg-blue-50/40" onClick={() => setSelected(r)}>
                          <td className="px-3 py-2 font-semibold" style={{ color: BRAND.darkBlue }}>{r.franchiseId}</td>
                          <td className="px-3 py-2">{r.easyload}</td>
                          <td className="px-3 py-2">{r.imei}</td>
                          <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                          <td className="px-3 py-2">{r.processedBy || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {selected && <MappingDetailModal record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h3 className="font-bold text-sm uppercase tracking-wide mb-3 mt-2" style={{ color: BRAND.midBlue }}>
      {title}
    </h3>
  );
}

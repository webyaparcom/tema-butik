/* menu-blok — Hücre ızgaralı (brütalist) menü (15 Kas 2026, G3 · mcp:webmaker/20261115-202336-i5p2).
   Yer tutucular (koşulsuz): blksinif blkhucre blkpanel blkcta blkduyuru. {{langbar}} motor çözer; @anahtar@ lang.json'dan.
   Öğeler: @home@ + pagesetting sayfaları (status play, category "") + json.data[] ({name{dil…}, url}).
   desing.max_oge'dan fazlası masaüstünde «menü» hücresine taşar (panelde hepsi görünür) — taşma olmaz. */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");

const { desing: des = {}, data: ek = [] } = json;
const sayfa = page || {};

const ogeler = [{ ad: "@home@", href: wxLangInternalHref(""), aktif: !sayfa.path }];
const ps = Array.isArray(webmakerdata?.pagesetting?.data)
  ? webmakerdata.pagesetting.data.find((it) => it?.modulestatus?.page)
  : null;
const satirlar = ps && Array.isArray(webmakerdata?.[ps.path]?.data) ? webmakerdata[ps.path].data : [];
for (const r of satirlar) {
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const ad = pick(r.name).trim();
  if (!ad) continue;
  ogeler.push({ ad: esc(ad), href: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && sayfa.path === r.path });
}
for (const e of Array.isArray(ek) ? ek : []) {
  const ad = pick(e?.name ?? e?.text).trim();
  const url = href(e?.url ?? e?.href);
  if (ad && url) ogeler.push({ ad: esc(ad), href: url, aktif: false });
}

let maxOge = parseInt(des.max_oge, 10);
if (!Number.isFinite(maxOge) || maxOge < 1) maxOge = 6;
const tasar = ogeler.length > maxOge;
const akim = (o) => (o.aktif ? ' aria-current="page"' : "");
const blkHucre = ogeler.map((o, i) =>
  `<li class="modulex-blk-hucre${i >= maxOge ? " modulex-blk-hucre--fazla" : ""}"><a class="modulex-blk-oge" href="${esc(o.href)}"${akim(o)}><span class="modulex-blk-ad">${o.ad}</span></a></li>`
).join("");
const blkPanel = ogeler.map((o) =>
  `<li><a class="modulex-blk-panel-oge" href="${esc(o.href)}"${akim(o)}><span class="modulex-blk-ad">${o.ad}</span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a></li>`
).join("");

const ctaAd = pick(des.cta_ad).trim();
const ctaUrl = href(des.cta_url);
const blkCta = ctaAd && ctaUrl ? `<a class="modulex-blk-cta" href="${esc(ctaUrl)}">${esc(ctaAd)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">north_east</span></a>` : "";

const duyuru = pick(des.duyuru).trim();
const duyuruUrl = href(des.duyuru_url);
const blkDuyuru = duyuru
  ? `<div class="modulex-blk-duyuru">${duyuruUrl ? `<a href="${esc(duyuruUrl)}">${esc(duyuru)}</a>` : `<span>${esc(duyuru)}</span>`}</div>`
  : "";

const blkSinif = [
  tasar ? " modulex-blk--tasar" : "",
  dogru(des.numara, true) ? " modulex-blk--numara" : "",
  dogru(des.sticky, false) ? " modulex-blk--sticky" : "",
  blkCta ? " modulex-blk--ctali" : "",
].join("");

html = html
  .replaceAll("{{blksinif}}", () => blkSinif)
  .replaceAll("{{blkhucre}}", () => blkHucre)
  .replaceAll("{{blkpanel}}", () => blkPanel)
  .replaceAll("{{blkcta}}", () => blkCta)
  .replaceAll("{{blkduyuru}}", () => blkDuyuru);

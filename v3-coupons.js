"use strict";

let allCoupons = [];
let merchantIndex = new Map();

const LOGO_RETRY_LIMIT = 2;
const LOGO_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230f4c81'/%3E%3Cstop offset='1' stop-color='%230ea5a3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='72' height='72' rx='14' fill='url(%23g)'/%3E%3Cpath d='M18 27h36l-3 25H21l-3-25Zm6-8h24l4 8H20l4-8Z' fill='%23fff' fill-opacity='.96'/%3E%3Cpath d='M28 35h16v4H28zm0 8h16v4H28z' fill='%230f4c81' fill-opacity='.9'/%3E%3C/svg%3E";

const dom = {};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
}

function cleanCouponUrl(coupon) {
  const raw = coupon["url-with-code"] || coupon.url || "";
  return String(raw).split("<")[0].trim();
}

function inferMerchantNameFromCouponUrl(coupon) {
  const rawUrl = cleanCouponUrl(coupon);
  if (!rawUrl) return "";

  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function hasPromoCode(code) {
  const norm = String(code ?? "").trim().toLowerCase();
  return norm && norm !== "none" && norm !== "not required" && norm !== "не требуется";
}

function formatDate(value) {
  if (!value) return "Не указано";
  const dt = new Date(value.replace(" ", "T"));
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleDateString("ru-RU", { year: "numeric", month: "short", day: "numeric" });
}

function getMerchantName(coupon) {
  const nestedName = String(coupon?.merchant?.name ?? "").trim();
  if (nestedName) return nestedName;
  const name = String(coupon.merchantname ?? "").trim();
  if (name) return name;
  const mid = String(coupon["merchant-id"] ?? "").trim();
  if (mid && merchantIndex.has(mid)) return merchantIndex.get(mid);
  const inferredName = inferMerchantNameFromCouponUrl(coupon);
  if (inferredName) return inferredName;
  return mid ? `Merchant #${mid}` : "Магазин";
}

function getLogo(coupon) {
  const responseLogo = String(coupon.logo ?? "").trim();
  if (responseLogo) return responseLogo;
  const mid = String(coupon["merchant-id"] ?? "").trim();
  if (mid) return `logos/${mid}.webp`;
  return "";
}

function getCategoryName(coupon) {
  const nestedCategory = String(coupon?.category?.name ?? "").trim();
  if (nestedCategory) return nestedCategory;
  return String(coupon.couponcategory ?? "").trim() || "Без категории";
}

function buildRetriedLogoUrl(src, attempt) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}img_retry=${attempt}_${Date.now()}`;
}

function setFallbackLogo(img) {
  img.dataset.logoFailed = "1";
  img.classList.add("is-fallback");
  img.removeAttribute("data-logo-src");
  img.src = LOGO_PLACEHOLDER;
}

function attachLogoRecovery(root) {
  const logos = root.querySelectorAll(".v3-logo");

  for (const img of logos) {
    const originalSrc = img.dataset.logoSrc || "";

    if (!originalSrc) {
      setFallbackLogo(img);
      continue;
    }

    img.addEventListener("load", () => {
      img.classList.remove("is-fallback");
      img.dataset.logoFailed = "0";
    });

    img.addEventListener("error", () => {
      const retries = Number.parseInt(img.dataset.retryCount || "0", 10);
      if (retries < LOGO_RETRY_LIMIT) {
        img.dataset.retryCount = String(retries + 1);
        window.setTimeout(() => {
          img.src = buildRetriedLogoUrl(originalSrc, retries + 1);
        }, 250 * (retries + 1));
        return;
      }

      setFallbackLogo(img);
    }, { once: false });
  }
}

function applyFilters() {
  const query = dom.search.value.trim().toLowerCase();
  const promoOnly = dom.promo.checked;
  const category = dom.category.value;
  const merchant = dom.merchant.value;

  let rows = allCoupons;

  if (promoOnly) {
    rows = rows.filter((x) => hasPromoCode(x.code));
  }

  if (category !== "all") {
    rows = rows.filter((x) => getCategoryName(x) === category);
  }

  if (merchant !== "all") {
    rows = rows.filter((x) => getMerchantName(x) === merchant);
  }

  if (query) {
    rows = rows.filter((x) => {
      const bag = [x.name, x.description, x.instruction, x.kind, getCategoryName(x), x.code, x.tagging_ads, getMerchantName(x)]
        .join(" ")
        .toLowerCase();
      return bag.includes(query);
    });
  }

  renderRows(rows);
}

function renderRows(rows) {
  dom.count.textContent = `${rows.length} акций`;

  if (!rows.length) {
    dom.grid.innerHTML = '<div class="v3-empty">Ничего не найдено. Попробуйте изменить фильтры или запрос.</div>';
    return;
  }

  dom.grid.innerHTML = rows
    .map((coupon) => {
      const merchant = getMerchantName(coupon);
      const code = String(coupon.code ?? "").trim();
      const hasCode = hasPromoCode(code);
      const url = cleanCouponUrl(coupon);
      const logo = getLogo(coupon);
      const finish = formatDate(coupon["finish-at"]);
      const category = getCategoryName(coupon);
      const taggingAds = String(coupon.tagging_ads ?? "").trim();

      return `
        <article class="v3-card">
          <div class="v3-card-top ${hasCode ? "code" : ""}"></div>
          <div class="v3-card-head">
            <img class="v3-logo ${logo ? "" : "is-fallback"}" src="${escapeHtml(logo || LOGO_PLACEHOLDER)}" data-logo-src="${escapeHtml(logo)}" data-retry-count="0" alt="${escapeHtml(merchant)}" decoding="async" />
            <div>
              <div class="v3-merchant">${escapeHtml(merchant)}</div>
              <div class="v3-category">${escapeHtml(category)}</div>
            </div>
          </div>
          <div class="v3-body">
            <h3 class="v3-name">${escapeHtml(coupon.name || coupon.description || "Без названия")}</h3>
            <div class="v3-dates">Действует до: ${escapeHtml(finish)}</div>
            <div class="v3-code ${hasCode ? "" : "none"}">${hasCode ? escapeHtml(code) : "Промокод не требуется"}</div>
            <div class="v3-footer">
              <span class="v3-dates">${escapeHtml(coupon.kind || "Акция")}</span>
              <a class="v3-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Перейти</a>
            </div>
            ${taggingAds ? `<div class="v3-tagging">${escapeHtml(taggingAds)}</div>` : ""}
          </div>
        </article>`;
    })
    .join("");

  attachLogoRecovery(dom.grid);
}

function fillFilterOptions() {
  const categories = uniq(allCoupons.map((x) => getCategoryName(x)));
  const merchants = uniq(allCoupons.map((x) => getMerchantName(x)));

  dom.category.innerHTML = '<option value="all">Все категории</option>' +
    categories.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");

  dom.merchant.innerHTML = '<option value="all">Все магазины</option>' +
    merchants.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
}

async function loadCoupons() {
  const primary = await fetch("data/coupon_stringv3.json", { cache: "no-store" });
  if (!primary.ok) {
    throw new Error(`Ошибка загрузки v3: ${primary.status}`);
  }

  const payload = await primary.json();
  if (Array.isArray(payload?.merchants)) {
    merchantIndex = new Map(
      payload.merchants
        .map((item) => [String(item?.id ?? "").trim(), String(item?.name ?? "").trim()])
        .filter(([id, name]) => id && name)
    );
  }

  allCoupons = Array.isArray(payload?.coupons) ? payload.coupons : [];
}

function bind() {
  dom.search.addEventListener("input", applyFilters);
  dom.searchBtn.addEventListener("click", applyFilters);
  dom.promo.addEventListener("change", applyFilters);
  dom.category.addEventListener("change", applyFilters);
  dom.merchant.addEventListener("change", applyFilters);
}

document.addEventListener("DOMContentLoaded", async () => {
  dom.search = document.getElementById("v3-search");
  dom.searchBtn = document.getElementById("v3-search-btn");
  dom.promo = document.getElementById("v3-promo-only");
  dom.category = document.getElementById("v3-category");
  dom.merchant = document.getElementById("v3-merchant");
  dom.count = document.getElementById("v3-count");
  dom.grid = document.getElementById("v3-grid");

  const params = new URLSearchParams(window.location.search);
  dom.search.value = params.get("search") || "";

  bind();

  try {
    await loadCoupons();
    fillFilterOptions();
    applyFilters();
  } catch (err) {
    dom.grid.innerHTML = `<div class="v3-empty">${escapeHtml(err.message || "Ошибка")}</div>`;
  }
});

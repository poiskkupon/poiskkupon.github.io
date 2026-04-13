"use strict";

let allCoupons = [];

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
  const name = String(coupon.merchantname ?? "").trim();
  if (name) return name;
  const mid = String(coupon["merchant-id"] ?? "").trim();
  return mid ? `Merchant #${mid}` : "Магазин";
}

function getLogo(coupon) {
  const mid = String(coupon["merchant-id"] ?? "").trim();
  if (mid) return `logos/${mid}.webp`;
  return coupon.logo || "";
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
    rows = rows.filter((x) => String(x.couponcategory ?? "") === category);
  }

  if (merchant !== "all") {
    rows = rows.filter((x) => getMerchantName(x) === merchant);
  }

  if (query) {
    rows = rows.filter((x) => {
      const bag = [x.name, x.description, x.instruction, x.kind, x.couponcategory, x.code, getMerchantName(x)]
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

      return `
        <article class="v3-card">
          <div class="v3-card-top ${hasCode ? "code" : ""}"></div>
          <div class="v3-card-head">
            <img class="v3-logo" src="${escapeHtml(logo)}" alt="${escapeHtml(merchant)}" onerror="this.style.display='none'" />
            <div>
              <div class="v3-merchant">${escapeHtml(merchant)}</div>
              <div class="v3-category">${escapeHtml(coupon.couponcategory || "Без категории")}</div>
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
          </div>
        </article>`;
    })
    .join("");
}

function fillFilterOptions() {
  const categories = uniq(allCoupons.map((x) => x.couponcategory));
  const merchants = uniq(allCoupons.map((x) => getMerchantName(x)));

  dom.category.innerHTML = '<option value="all">Все категории</option>' +
    categories.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");

  dom.merchant.innerHTML = '<option value="all">Все магазины</option>' +
    merchants.map((x) => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
}

async function loadCoupons() {
  const response = await fetch("data/coupon_string", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  const text = await response.text();
  allCoupons = JSON.parse(text);
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

"use strict";

const TOKEN = "09561f1ac45fb4b1bb8db333c498181b2561be99";
const EXCLUDED_MERCHANTS = "101124,82012";
const EXCLUDED_TID_ACCESSORIES = "2,3,59,63,64,107,108,110,120,150,159,249,473,481,525,535,571,685,687,689,691,693,695,697,699,717,721,727,729,733,739,743,749,751,753,755,757,759,761,763,765,769,771,773,775,777,779,781,783,785,799,801,803,813,815,817,863,887,889,891,911,913,915,917,919,921,923,925,927,957,997,1078,1086,1660,1661,1662,1666,1667,1668,1675,1679,1680,1681,1682,1690,1694,1695,1696,1708,1712,1716,1717,1725,1735,1736,1752,1753,1768,1772,1773,1781,1791,1792,1808,1809,1826,1827,1835,1840,1849,1850,1851,1852,1853,1854,1855,1856,1857,1858,1859,1860,1861,1862,1863,1864,1865,1866,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1892,1893,1894,1895,1896,1897,1898,1899,1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1990,1991,1992,1993,1994";
const EXCLUDED_TID_BOOKS = "121,123,128,629,655,1105,1984";

const state = {
  page: 1,
  hasNext: false,
  lastQuery: "",
};

const dom = {};
let categoryMap = new Map();

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function byId(id) {
  return document.getElementById(id);
}

function readTag(node, names) {
  for (const name of names) {
    const found = node.querySelector(name);
    if (found?.textContent?.trim()) {
      return found.textContent.trim();
    }
  }
  return "";
}

function initCategories() {
  if (typeof catlist !== "string") return;
  const parsed = JSON.parse(catlist);
  categoryMap = new Map(Object.entries(parsed).map(([k, v]) => [String(k), v]));

  const top = [...categoryMap.values()]
    .filter((x) => x && (x.parent_id === null || x.parent_id === undefined))
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));

  dom.category.innerHTML = '<option value="">Все категории</option>';
  for (const c of top) {
    dom.category.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(c._id)}">${escapeHtml(c.name)}</option>`);
  }

  fillSubcategories();
}

function fillSubcategories() {
  const parent = dom.category.value;
  dom.subcategory.innerHTML = '<option value="">Все подкатегории</option>';

  if (!parent) return;

  const subs = [...categoryMap.values()]
    .filter((x) => x && String(x.parent_id) === String(parent))
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));

  for (const c of subs) {
    dom.subcategory.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(c._id)}">${escapeHtml(c.name)}</option>`);
  }
}

function buildNoTid() {
  const chunks = [];
  if (dom.noAccessories.checked) chunks.push(EXCLUDED_TID_ACCESSORIES);
  if (dom.noBooks.checked) chunks.push(EXCLUDED_TID_BOOKS);
  return chunks.filter(Boolean).join(",");
}

function buildQueryText() {
  return dom.search.value.trim().replace(/\s+/g, " AND ");
}

function buildUrl(page) {
  const q = buildQueryText();
  const params = new URLSearchParams();
  params.set("q", q);
  params.set("l", "60");
  params.set("p", String(page));
  params.set("order", "price");
  params.set("_gs_at", TOKEN);

  if (dom.noAliexpress.checked) {
    params.set("no_m", EXCLUDED_MERCHANTS);
  }

  const noTid = buildNoTid();
  if (noTid) {
    params.set("no_tid", noTid);
  }

  const tid = dom.subcategory.value || dom.category.value;
  if (tid) {
    params.set("tid", tid);
  }

  return `https://api.gdeslon.ru/api/search.xml?${params.toString()}`;
}

async function fetchOffers(page) {
  const url = buildUrl(page);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xmlText = await response.text();
  const xml = new DOMParser().parseFromString(xmlText, "text/xml");

  const parserError = xml.querySelector("parsererror");
  if (parserError) throw new Error("Ошибка XML ответа");

  return [...xml.querySelectorAll("offer")].map((offer) => {
    const name = readTag(offer, ["name", "title"]);
    const price = readTag(offer, ["price", "sale-price", "discount-price"]);
    const oldPrice = readTag(offer, ["oldprice", "old-price", "price_old"]);
    const merchant = readTag(offer, ["merchant", "merchant-name", "shop", "vendor"]);
    const img = readTag(offer, ["image", "picture", "img", "photo", "thumb"]);
    const link = readTag(offer, ["url", "link", "goto", "offer-url"]);

    return {
      name,
      price,
      oldPrice,
      merchant,
      img,
      link,
    };
  });
}

function renderOffers(items) {
  if (!items.length) {
    dom.results.innerHTML = '<div class="v3p-empty">Ничего не найдено. Попробуйте другой запрос.</div>';
    return;
  }

  dom.results.innerHTML = items
    .map((x) => `
      <article class="v3p-card">
        <img src="${escapeHtml(x.img)}" alt="${escapeHtml(x.name)}" loading="lazy" onerror="this.style.display='none'" />
        <div class="v3p-card-body">
          <h3 class="v3p-name">${escapeHtml(x.name || "Товар")}</h3>
          <div class="v3p-shop">${escapeHtml(x.merchant || "Магазин")}</div>
          <div class="v3p-price-row">
            <span class="v3p-price">${escapeHtml(x.price || "Цена не указана")}</span>
            ${x.oldPrice ? `<span class="v3p-old">${escapeHtml(x.oldPrice)}</span>` : ""}
          </div>
          <a class="v3p-open" href="${escapeHtml(x.link || "#")}" target="_blank" rel="noopener noreferrer">Открыть товар</a>
        </div>
      </article>
    `)
    .join("");
}

function renderPagination() {
  dom.pagination.innerHTML = `
    <button class="v3p-page-btn" id="v3p-prev" ${state.page <= 1 ? "disabled" : ""}>Назад</button>
    <span>Страница ${state.page}</span>
    <button class="v3p-page-btn" id="v3p-next" ${state.hasNext ? "" : "disabled"}>Вперед</button>
  `;

  byId("v3p-prev")?.addEventListener("click", () => {
    if (state.page > 1) {
      runSearch(state.page - 1);
    }
  });

  byId("v3p-next")?.addEventListener("click", () => {
    if (state.hasNext) {
      runSearch(state.page + 1);
    }
  });
}

async function runSearch(page = 1) {
  const queryRaw = dom.search.value.trim();
  if (!queryRaw) {
    alert("Введите слово для поиска");
    return;
  }

  state.page = page;
  state.lastQuery = queryRaw;

  dom.searchBtn.disabled = true;
  dom.searchBtn.textContent = "Поиск...";
  dom.meta.textContent = "Загрузка результатов...";

  try {
    const offers = await fetchOffers(page);
    state.hasNext = offers.length >= 60;
    renderOffers(offers);
    renderPagination();
    dom.meta.textContent = `Найдено на странице: ${offers.length}`;
  } catch (err) {
    dom.results.innerHTML = `<div class="v3p-empty">${escapeHtml(err.message || "Ошибка")}</div>`;
    dom.pagination.innerHTML = "";
    dom.meta.textContent = "";
  } finally {
    dom.searchBtn.disabled = false;
    dom.searchBtn.textContent = "Искать";
  }
}

function bindEvents() {
  dom.category.addEventListener("change", fillSubcategories);
  dom.searchBtn.addEventListener("click", () => runSearch(1));
  dom.search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      runSearch(1);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  dom.search = byId("v3p-search");
  dom.category = byId("v3p-category");
  dom.subcategory = byId("v3p-subcategory");
  dom.noAccessories = byId("v3p-no-accessories");
  dom.noAliexpress = byId("v3p-no-aliexpress");
  dom.noBooks = byId("v3p-no-books");
  dom.searchBtn = byId("v3p-search-btn");
  dom.meta = byId("v3p-meta");
  dom.results = byId("v3p-results");
  dom.pagination = byId("v3p-pagination");

  initCategories();
  bindEvents();
});

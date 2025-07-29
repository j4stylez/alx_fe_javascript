// =============================
// Dynamic Quote Generator (script.js)
// =============================

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const allCategories = [...new Set(quotes.map(q => q.category))];
  [categorySelect, categoryFilter].forEach(select => {
    select.querySelectorAll("option:not([value='all'])").forEach(opt => opt.remove());
    allCategories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selected);

  const filteredQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selected.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes found in this category.";
    return;
  }

  const quoteList = filteredQuotes.map(q =>
    `<p>\"${q.text}\" — <em>${q.category}</em></p>`
  ).join("");

  quoteDisplay.innerHTML = quoteList;
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<strong>No quotes available in this category.</strong>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `\"${quote.text}\" — <em>${quote.category}</em>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  pushQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format.");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      notifyUser("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    const serverQuotes = serverData.map(item => ({ text: item.title, category: item.body }));
    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Failed to fetch from server:", error);
  }
}

function resolveConflicts(serverQuotes) {
  let updated = false;
  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(q => q.text === serverQuote.text && q.category === serverQuote.category);
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    notifyUser("New quotes synced from server.");
  }
}

async function pushQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  } catch (err) {
    console.error("Failed to push quote:", err);
  }
}

function notifyUser(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.position = "fixed";
  div.style.bottom = "10px";
  div.style.right = "10px";
  div.style.padding = "10px";
  div.style.background = "#28a745";
  div.style.color = "white";
  div.style.borderRadius = "5px";
  document.body.appendChild(div);
  setTimeout(() => document.body.removeChild(div), 4000);
}

window.onload = () => {
  populateCategories();

  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuotes();
  }

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const parsed = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `\"${parsed.text}\" — <em>${parsed.category}</em>`;
  }

  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 15000);
};

document.getElementById("newQuote").addEventListener("click", showRandomQuote);



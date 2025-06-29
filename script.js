let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch {
      quotes = [];
    }
  } else {
    quotes = [
      { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
      { text: "To be or not to be, that is the question.", category: "Philosophy" },
      { text: "Stay hungry, stay foolish.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function saveSelectedFilter(category) {
  localStorage.setItem("lastCategory", category);
}

function loadSelectedFilter() {
  return localStorage.getItem("lastCategory") || "all";
}

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteButton = document.getElementById("newQuote");

function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = loadSelectedFilter();
}

function filterQuotes() {
  const selected = categoryFilter.value;
  saveSelectedFilter(selected);
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
  } else {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.textContent = `"${random.text}" — [${random.category}]`;
    saveLastViewedQuote(random);
  }
}

function showRandomQuote() {
  filterQuotes();
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  alert("Quote added!");

  // Clear form
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        throw new Error("Invalid format");
      }
    } catch {
      alert("Failed to import: Invalid JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Initialize
loadQuotes();
populateCategories();
newQuoteButton.addEventListener("click", showRandomQuote);
filterQuotes();



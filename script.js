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

// === Simulated Server Sync ===
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let hasConflict = false;
    const newQuotes = [];

    serverQuotes.forEach(serverQuote => {
      const exists = localQuotes.some(local =>
        local.text === serverQuote.text &&
        local.category === serverQuote.category
      );
      if (!exists) {
        newQuotes.push(serverQuote);
        hasConflict = true;
      }
    });

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
    }

    if (hasConflict) {
      showNotification("✅ Quotes synced from server. Conflicts resolved by prioritizing server data.");
    }
  } catch (err) {
    console.error("Failed to sync with server:", err);
    showNotification("⚠️ Failed to sync with server.");
  }
}

function showNotification(message) {
  let notice = document.getElementById("syncNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "syncNotice";
    notice.style.background = "#ffffcc";
    notice.style.border = "1px solid #aaa";
    notice.style.padding = "10px";
    notice.style.marginTop = "20px";
    document.body.prepend(notice);
  }
  notice.textContent = message;
}

// Initialization
loadQuotes();
populateCategories();
newQuoteButton.addEventListener("click", showRandomQuote);
filterQuotes();
syncWithServer();
setInterval(syncWithServer, 60000);



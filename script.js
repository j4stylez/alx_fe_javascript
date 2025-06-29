const quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "To be or not to be, that is the question.", category: "Philosophy" },
  { text: "Stay hungry, stay foolish.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const newQuoteButton = document.getElementById("newQuote");

function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categories.forEach(cat => {
    if (![...categorySelector.options].some(opt => opt.value === cat)) {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelector.appendChild(option);
    }
  });
}

function showRandomQuote() {
  const selectedCategory = categorySelector.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — [${randomQuote.category}]`;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  populateCategories();
  alert("Quote added!");
}

newQuoteButton.addEventListener("click", showRandomQuote);
populateCategories();


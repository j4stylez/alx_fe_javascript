// Initial array of quotes
const quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "wisdom" },
  { text: "Success is not final, failure is not fatal.", category: "inspiration" },
  { text: "I think, therefore I am.", category: "philosophy" },
];

document.addEventListener('DOMContentLoaded', function () {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const categorySelect = document.getElementById('categorySelect');

  // Populate category dropdown initially
  populateCategories();

  // Event: Show random quote
  newQuoteBtn.addEventListener('click', showRandomQuote);

  // Event: Add new quote
  addQuoteBtn.addEventListener('click', addQuote);

  function populateCategories() {
    // Clear all except "all"
    categorySelect.innerHTML = `<option value="all">All</option>`;
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categorySelect.appendChild(option);
    });
  }

  function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = filteredQuotes[randomIndex].text;
  }

  function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim().toLowerCase();

    if (!newText || !newCategory) {
      alert("Please fill in both quote and category.");
      return;
    }

    quotes.push({ text: newText, category: newCategory });

    // Update UI
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  }
});

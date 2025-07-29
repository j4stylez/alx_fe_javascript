// Quote data
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal.", category: "Success" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");

// Show random quote based on selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<strong>No quotes available in this category.</strong>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // Use innerHTML instead of textContent
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Add new category to dropdown if it doesn't exist
  const exists = Array.from(categorySelect.options).some(
    (option) => option.value.toLowerCase() === category.toLowerCase()
  );

  if (!exists) {
    const newOption = document.createElement("option");
    newOption.value = category;
    newOption.textContent = category;
    categorySelect.appendChild(newOption);
  }

  // Clear form fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Populate category dropdown on page load
window.onload = () => {
  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
};

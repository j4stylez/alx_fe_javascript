// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Initial array of quote objects with text and category
    let quotes = [
        { text: "The best way to predict the future is to create it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Humor" },
        { text: "Learning never exhausts the mind.", category: "Education" }
    ];

    // Function to display a random quote
    function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available. Add a new quote!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>${quote.text}</strong> <em>(${quote.category})</em></p>`;
    }

    // Function to add a new quote dynamically
    function addQuote() {
        const quoteText = document.getElementById('newQuoteText').value.trim();
        const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

        // Validate input
        if (quoteText === '' || quoteCategory === '') {
            alert('Please enter both a quote and a category!');
            return;
        }

        // Add new quote to the array
        quotes.push({ text: quoteText, category: quoteCategory });

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Optional: Show the newly added quote
        showRandomQuote();
    }

    // Attach event listeners
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Initial display of a quote
    showRandomQuote();
});
// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Array of quote objects containing text and category properties
    let quotes = [
        { text: "The best way to predict the future is to create it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Humor" },
        { text: "Learning never exhausts the mind.", category: "Education" }
    ];

    // Function to display a random quote and update the DOM
    function displayRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available. Add a new quote!";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${quote.text} <em>(${quote.category})</em></p>`;
    }

    // Function to add a new quote to the quotes array and update the DOM
    function addQuote() {
        const quoteTextInput = document.getElementById('newQuoteText');
        const quoteCategoryInput = document.getElementById('newQuoteCategory');
        const quoteText = quoteTextInput.value.trim();
        const quoteCategory = quoteCategoryInput.value.trim();

        // Validate input
        if (!quoteText || !quoteCategory) {
            alert('Please enter both a quote and a category!');
            return;
        }

        // Add new quote to the array
        quotes.push({ text: quoteText, category: quoteCategory });

        // Clear input fields
        quoteTextInput.value = '';
        quoteCategoryInput.value = '';

        // Update the DOM by showing the new quote
        displayRandomQuote();
    }

    // Add event listener on the "Show New Quote" button
    const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.addEventListener('click', displayRandomQuote);

    // Initial display of a quote
    displayRandomQuote();
});

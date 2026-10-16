
  // CampusNest community suggestion form
  const communityForm = document.querySelector("#community-form");
  const formMessage = document.querySelector("#form-message");
  const suggestionList = document.querySelector("#suggestion-list");

  let suggestions = [];

  try {
    const storedSuggestions = localStorage.getItem("campusNestSuggestions");
    suggestions = storedSuggestions ? JSON.parse(storedSuggestions) : [];

    if (!Array.isArray(suggestions)) {
      suggestions = [];
    }
  } catch (error) {
    suggestions = [];
  }

  function saveSuggestions() {
    try {
      localStorage.setItem(
        "campusNestSuggestions",
        JSON.stringify(suggestions)
      );
      return true;
    } catch (error) {
      console.error("Could not save suggestions:", error);
      return false;
    }
  }

  function renderSuggestions() {
    if (!suggestionList) return;

    suggestionList.replaceChildren();

    if (suggestions.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No suggestions submitted yet.";
      suggestionList.appendChild(emptyMessage);
      return;
    }

    suggestions.slice().reverse().forEach((suggestion) => {
      const card = document.createElement("article");
      card.className = "content-card";

      const heading = document.createElement("h3");
      heading.textContent = suggestion.category;

      const author = document.createElement("p");
      author.textContent = `Submitted by ${suggestion.name}`;

      const message = document.createElement("p");
      message.textContent = suggestion.message;

      const date = document.createElement("p");
      date.className = "small-note";
      date.textContent = suggestion.date;

      card.append(heading, author, message, date);
      suggestionList.appendChild(card);
    });
  }

  if (communityForm) {
    communityForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#student-name").value.trim();
      const email = document.querySelector("#student-email").value.trim();
      const category = document.querySelector("#suggestion-category").value;
      const message = document.querySelector("#suggestion-message").value.trim();

      if (!name || !email || !category || message.length < 10) {
        formMessage.textContent =
          "Please complete every field and enter at least 10 characters for your suggestion.";
        return;
      }

      const newSuggestion = {
        name,
        email,
        category,
        message,
        date: new Date().toLocaleDateString()
      };

      suggestions.push(newSuggestion);

      if (saveSuggestions()) {
        formMessage.textContent = "Your suggestion has been saved in this browser.";
        communityForm.reset();
        renderSuggestions();
      } else {
        suggestions.pop();
        formMessage.textContent =
          "Your suggestion could not be saved. Please check your browser storage settings.";
      }
    });
  }

  renderSuggestions();

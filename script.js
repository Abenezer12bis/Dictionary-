const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const translationAPI = "https://api.mymemory.translated.net/get?q=";

document.getElementById("search-btn").addEventListener("click", () => {
  const word = document.getElementById("word-input").value.trim();
  const targetLanguage = document.getElementById("language-select").value;

  if (word === "") {
    alert("Please enter a word.");
    return;
  }

  fetchDefinition(word);
  fetchTranslation(word, targetLanguage);
});

function fetchDefinition(word) {
  fetch(dictionaryAPI + word)
    .then(response => {
      if (!response.ok) {
        throw new Error("Word not found.");
      }
      return response.json();
    })
    .then(data => {
      displayDefinition(data[0]);
    })
    .catch(err => {
      const resultBox = document.getElementById("result");
      resultBox.innerHTML = `<p class="error">${err.message}</p>`;
      resultBox.style.display = "block";
    });
}

function fetchTranslation(word, language) {
  const translationURL = `${translationAPI}${encodeURIComponent(word)}&langpair=en|${language}`;

  fetch(translationURL)
    .then(response => response.json())
    .then(data => {
      if (data.responseData.translatedText) {
        displayTranslation(data.responseData.translatedText);
      } else {
        displayTranslation("Translation not available.");
      }
    })
    .catch(err => {
      console.error("Translation Error:", err);
      displayTranslation("An error occurred while fetching the translation.");
    });
}

function displayDefinition(data) {
  const word = data.word;
  const meaning = data.meanings[0].definitions[0].definition;

  const resultBox = document.getElementById("result");
  resultBox.innerHTML = `
    <h2>${word}</h2>
    <p><strong>Definition:</strong> ${meaning}</p>
    <p id="translation"><strong>Translation:</strong> Loading...</p>
  `;
  resultBox.style.display = "block";
}

function displayTranslation(translation) {
  const translationElement = document.getElementById("translation");
  translationElement.innerHTML = `<strong>Translation:</strong> ${translation}`;
}
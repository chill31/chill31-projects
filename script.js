const colorsMap = {
  "JavaScript": "f1e05a",
  "HTML": "e34c26",
  "CSS": "563d7c",
  "Python": "3572a5",
  "C++": "f34b7d",
  "C": "555555",
  "Shell": "89e051",
  "TypeScript": "3178c6",
  "Ruby": "701516",
  "Java": "b07219",
  "Go": "00add8",
  "PHP": "4f5d95",
  "C#": "178600",
  "Jupyter Notebook": "da5b0b",
  "Objective-C": "438eff",
  "Swift": "ffac45",
  "Rust": "dea584",
  "Scala": "c22d40",
  "Dart": "00b4ab",
  "Kotlin": "f18e33",
  "Clojure": "db5855",
  "Lua": "000080",
  "Assembly": "6E4C13",
  "Perl": "0298c3",
  "CoffeeScript": "244776",
  "Emacs Lisp": "c065db",
  "Elixir": "6e4a7e",
  "Haskell": "5e5086",
  "Dockerfile": "384d54",
  "PowerShell": "012456",
  "R": "198ce7",
  "Makefile": "427819",
  "TeX": "3d6117",
  "Vue": "41b883",
  "Clojure": "db5855",
  "Lua": "000080",
  "Assembly": "6E4C13",
  "Perl": "0298c3",
  "CoffeeScript": "244776",
  "Emacs Lisp": "c065db",
  "Elixir": "6e4a7e",
  "Haskell": "5e5086",
  "Dockerfile": "384d54",
  "PowerShell": "012456",
  "R": "198ce7",
  "Makefile": "427819",
  "TeX": "3d6117"
};

const repoList = document.querySelector(".repository-list");
const fetchMessageSpan = document.querySelector(".fetch-message");

const cacheTimestamp = localStorage.getItem("repoCacheTimestamp");
const currentTimestamp = new Date().getTime();
const cacheAgeInDays = (currentTimestamp - cacheTimestamp) / (1000 * 60 * 60 * 24);

if (cacheTimestamp && cacheAgeInDays < 15) {

  const cachedData = JSON.parse(localStorage.getItem("repoCache"));
  const cachedLanguages = JSON.parse(localStorage.getItem("repoLanguagesCache"));

  displayRepos(cachedData, cachedLanguages);

} else {

  showFetchMessages();

  fetch("https://api.github.com/users/chill31/repos")
    .then(response => response.json())
    .then(async data => {

      if (data.message === 'Not Found') {
        showError();
        return;
      }

      let filteredData = data.filter(repo => !repo.fork).filter(repo => repo.name !== 'chill31');

      filteredData = filteredData.map(repo => {
        const filteredRepo = {
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          topics: repo.topics,
          languages: repo.languages_url
        };
        return filteredRepo;
      });

      filteredData.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      const fetched = await fetchLanguages(filteredData)
      localStorage.setItem("repoCache", JSON.stringify(filteredData));
      localStorage.setItem("repoLanguagesCache", JSON.stringify(fetched));
      localStorage.setItem("repoCacheTimestamp", currentTimestamp);


      displayRepos(filteredData, fetched);
    })
    .catch(error => {
      console.log(error);
      showError();
    });

}

function displayRepos(repos, languages) {
  fetchMessageSpan.style.display = "none";

  repos.forEach((repo, index) => {
    const repoEl = document.createElement("div");
    repoEl.classList.add("repository");

    let truncatedTitle = repo.name;
    if (truncatedTitle.length > 20) {
      truncatedTitle = truncatedTitle.substring(0, 20) + "...";
    }

    const languagesString = languages[index] ? Object.keys(languages[index]).map(language => {

      let percentage = (languages[index][language] / Object.values(languages[index]).reduce((a, b) => a + b, 0)) * 100
      percentage = Math.round(percentage * 100) / 100;

      if (percentage === 0) return '';

      return `<span class="language" style="background-color: #${colorsMap[language]}; width: ${percentage}%; height: 1rem;"></span>`;

    }).join('') : '';

    const languagesKeys = languages[index] ? Object.keys(languages[index]).map((language, langIndex) => {

      let percentage = (languages[index][language] / Object.values(languages[index]).reduce((a, b) => a + b, 0)) * 100
      percentage = Math.round(percentage * 100) / 100;

      const html =
        `<span class="language-key" style="transition-delay: ${200 * (langIndex + 1)}ms">
  <span class="lang-bullet" style="background-color: #${colorsMap[language]}"></span>
  <span class="lang-name">${language}</span>
  <span class="lang-percentage">${percentage}%</span>
</span>`;

      return html;
    }).join('') : '';

    const sourceButton = document.createElement('button');
    sourceButton.classList.add('repo-source-button');
    sourceButton.innerHTML = 
`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
Source`;

    sourceButton.addEventListener('click', () => goToGitHub(repo.html_url));

    repoEl.innerHTML =
      `<a href="${repo.homepage}"><h2 class="repo-title">${truncatedTitle}</h2></a>

<div class="repo-topics">${repo.topics.length === 0 ? `` : repo.topics.map(topic => `<span class="topic">#${topic}</span>`).join('')}</div>

<div class="repo-languages">${languagesString}</div>
<div class="repo-languages-keys">${languagesKeys}</div>
</div>
`;


    repoEl.appendChild(sourceButton);
    repoList.appendChild(repoEl);
  });

  const allRepoCards = document.querySelectorAll('.repository');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: .3
  });

  allRepoCards.forEach((card) => {
    cardObserver.observe(card)
  });
}

function showError() {
  console.error("Error fetching data from GitHub");
  const errorSpan = document.createElement('span');
  errorSpan.classList.add('error-span');
  errorSpan.textContent = 'Error fetching data from GitHub. Try reloading this page.';
  repoList.appendChild(errorSpan);

  // reset the local storage cache
  localStorage.removeItem("repoCache");
  localStorage.removeItem("repoLanguagesCache");
  localStorage.removeItem("repoCacheTimestamp");
}

async function fetchLanguages(filteredData) {
  const languages = [];
  for (const repo of filteredData) {
    try {
      const response = await fetch(repo.languages);
      const language = await response.json();
      languages.push(language);
    } catch (error) {
      console.log(error);
      showError();
    }
  }
  return languages;
}

function goToGitHub(link) {
  window.location.href = link;
}

function showFetchMessages() {
  const randomFetchMessages = [
    "Be patient...",
    "Just believe in the process...",
    "Almost there",
    "Fetching data from GitHub...",
    "Getting the projects...",
  ];

  let previousChoice = '';
  const msgInterval = setInterval(() => {
    let choice = randomFetchMessages[Math.floor(Math.random() * randomFetchMessages.length)];
    while (choice === previousChoice) {
      choice = randomFetchMessages[Math.floor(Math.random() * randomFetchMessages.length)];
    }
    previousChoice = choice;
    fetchMessageSpan.textContent = choice;
  }, 1500);

  setTimeout(() => {
    clearInterval(msgInterval);
    fetchMessageSpan.textContent = "This is taking longer than expected...";
  }, 6000);
}
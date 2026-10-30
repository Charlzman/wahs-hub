// WAHS Hub interactions. Each section only runs when its controls exist.

// Open and close the mobile navigation menu.
const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
    if (mobileMenu && menuButton && mobileMenu.classList.contains("is-open")) {
        mobileMenu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
    }
}

if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function() {
        const isOpen = mobileMenu.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        if (isOpen && closeMenuButton) closeMenuButton.focus();
    });
}
if (closeMenuButton) closeMenuButton.addEventListener("click", closeMobileMenu);
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeMobileMenu();
});

// Filter news cards by the selected category.
const filterButtons = document.querySelectorAll(".filterButton[data-filter]");
const newsItems = document.querySelectorAll(".newsItem");
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const filter = button.getAttribute("data-filter");
        filterButtons.forEach(function(item) {
            item.classList.toggle("active", item === button);
            item.setAttribute("aria-pressed", String(item === button));
        });
        newsItems.forEach(function(item) {
            const category = item.getAttribute("data-category");
            item.classList.toggle("hidden", filter !== "all" && filter !== category);
        });
    });
});

// Show or hide the extra text in each news article.
document.querySelectorAll(".readMore").forEach(function(button) {
    button.addEventListener("click", function() {
        const card = button.closest(".card");
        const extraText = card ? card.querySelector(".extraText") : null;
        if (!extraText) return;
        const isHidden = extraText.classList.toggle("hidden");
        button.textContent = isHidden ? "Read more >" : "Show less <";
        button.setAttribute("aria-expanded", String(!isHidden));
    });
});

// Show or hide the latest result details on the homepage.
const matchButton = document.getElementById("matchDetailsButton");
const matchDetails = document.getElementById("matchDetails");
if (matchButton && matchDetails) {
    matchButton.setAttribute("aria-expanded", "false");
    matchButton.addEventListener("click", function() {
        const isHidden = matchDetails.classList.toggle("hidden");
        matchButton.textContent = isHidden ? "Show match details" : "Hide match details";
        matchButton.setAttribute("aria-expanded", String(!isHidden));
    });
}

// Filter the featured squad by position and search text.
const playerCards = document.querySelectorAll(".playerCard");
const playerFilterButtons = document.querySelectorAll("[data-player-filter]");
const playerSearch = document.getElementById("playerSearch");
const noPlayersMessage = document.getElementById("noPlayersMessage");
let selectedPlayerFilter = "all";

function filterPlayers() {
    const searchText = playerSearch ? playerSearch.value.trim().toLowerCase() : "";
    let visiblePlayers = 0;
    playerCards.forEach(function(card) {
        const categoryMatches = selectedPlayerFilter === "all" ||
            card.dataset.category === selectedPlayerFilter;
        const textMatches = card.dataset.name.includes(searchText) ||
            card.textContent.toLowerCase().includes(searchText);
        const showCard = categoryMatches && textMatches;
        card.classList.toggle("hidden", !showCard);
        if (showCard) visiblePlayers++;
    });
    if (noPlayersMessage) noPlayersMessage.classList.toggle("hidden", visiblePlayers > 0);
}

playerFilterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        selectedPlayerFilter = button.dataset.playerFilter;
        playerFilterButtons.forEach(function(item) {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });
        filterPlayers();
    });
});
if (playerSearch) playerSearch.addEventListener("input", filterPlayers);

// Expand the short profile details on the squad page.
document.querySelectorAll(".profileButton").forEach(function(button) {
    button.addEventListener("click", function() {
        const details = button.parentElement.querySelector(".profileDetails");
        if (!details) return;
        const isHidden = details.classList.toggle("hidden");
        button.textContent = isHidden ? "View profile >" : "Hide profile <";
        button.setAttribute("aria-expanded", String(!isHidden));
    });
});

// Fixtures: switch between upcoming matches, results and the ladder.
const fixtureTabButtons = document.querySelectorAll("[data-fixture-tab]");
fixtureTabButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const panelId = button.dataset.fixtureTab;
        fixtureTabButtons.forEach(function(item) {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });
        document.querySelectorAll(".fixturePanel").forEach(function(panel) {
            panel.classList.toggle("hidden", panel.id !== panelId);
        });
    });
});
// Allow links from the homepage to open a specific fixtures section.
const requestedPanel = window.location.hash.slice(1);
const requestedTab = Array.from(fixtureTabButtons).find(function(button) {
    return button.dataset.fixtureTab === requestedPanel;
});
if (requestedTab) requestedTab.click();

// Fan Zone: show poll results only after the supporter votes.
const fanPollForm = document.getElementById("fanPollForm");
const pollMessage = document.getElementById("pollMessage");
const pollResults = document.getElementById("pollResults");
if (fanPollForm && pollMessage && pollResults) {
    fanPollForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const choice = new FormData(fanPollForm).get("fanPoll");
        if (!choice) return;
        pollMessage.textContent = "Thanks for voting for " + choice + ". The poll results are now shown below.";
        pollResults.classList.remove("hidden");
        fanPollForm.querySelectorAll("input, button").forEach(function(control) {
            control.disabled = true;
        });
    });
}

// Fan Zone: show prediction feedback and results after submission.
const predictionForm = document.getElementById("predictionForm");
const predictionMessage = document.getElementById("predictionMessage");
const predictionResults = document.getElementById("predictionResults");
if (predictionForm && predictionMessage && predictionResults) {
    predictionForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const choice = new FormData(predictionForm).get("prediction");
        const score = document.getElementById("predictedScore");
        const scoreText = score && score.value !== "" ? " Your predicted Warriors score is " + score.value + "." : "";
        if (choice) {
            predictionMessage.textContent = "Thanks for submitting your prediction: " + choice + "." + scoreText;
            predictionResults.classList.remove("hidden");
            predictionForm.querySelectorAll("input, button").forEach(function(control) {
                control.disabled = true;
            });
        }
    });
}

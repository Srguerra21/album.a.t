const photoForm = document.getElementById("photoForm");
const albumGrid = document.getElementById("albumGrid");

const musicForm = document.getElementById("musicForm");
const soundtrackList = document.getElementById("soundtrackList");

photoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const photoUrl = document.getElementById("photoUrl").value.trim();
  const photoDescription = document.getElementById("photoDescription").value.trim();

  if (!photoUrl || !photoDescription) return;

  const photoCard = document.createElement("article");
  photoCard.classList.add("photo-card");

  photoCard.innerHTML = `
    <img src="${photoUrl}" alt="Foto adicionada ao álbum">
    <div class="photo-content">
      <p>${photoDescription}</p>
    </div>
  `;

  albumGrid.prepend(photoCard);
  photoForm.reset();
});

musicForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const musicTitle = document.getElementById("musicTitle").value.trim();
  const musicLink = document.getElementById("musicLink").value.trim();

  if (!musicTitle || !musicLink) return;

  const musicCard = document.createElement("div");
  musicCard.classList.add("music-card");

  musicCard.innerHTML = `
    <h3>${musicTitle}</h3>
    <a href="${musicLink}" target="_blank" rel="noopener noreferrer">Ouvir no YouTube</a>
  `;

  soundtrackList.prepend(musicCard);
  musicForm.reset();
});
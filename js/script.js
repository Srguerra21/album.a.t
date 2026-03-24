const supabaseUrl = "https://wevpkefyovotkkhbvmnw.supabase.co";
const supabaseKey = "sb_publishable_HFl6p8UF2FjReISPDE05JA_NrZYPfEn";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const photoForm = document.getElementById("photoForm");
const albumGrid = document.getElementById("albumGrid");

const musicForm = document.getElementById("musicForm");
const soundtrackList = document.getElementById("soundtrackList");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function createPhotoCard(imageUrl, description) {
  const photoCard = document.createElement("article");
  photoCard.classList.add("photo-card");

  photoCard.innerHTML = `
    <div class="image-frame">
      <img src="${imageUrl}" alt="Foto do álbum">
    </div>
    <div class="photo-content">
      <p>${escapeHtml(description || "")}</p>
    </div>
  `;

  return photoCard;
}

function createMusicCard(title, youtubeUrl) {
  const musicCard = document.createElement("div");
  musicCard.classList.add("music-card");

  musicCard.innerHTML = `
    <div class="music-ornament">✦</div>
    <h3>${escapeHtml(title || "")}</h3>
    <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer">Ouvir no YouTube</a>
  `;

  return musicCard;
}

async function loadPhotos() {
  if (!albumGrid) return;

  const { data, error } = await supabaseClient
    .from("foto")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar fotos:", error);
    return;
  }

  albumGrid.innerHTML = "";

  if (!data || data.length === 0) {
    albumGrid.innerHTML = `
      <p style="grid-column: 1 / -1; opacity: 0.8;">
        Ainda não há fotos no álbum.
      </p>
    `;
    return;
  }

  data.forEach((item) => {
    const card = createPhotoCard(item.img_url, item.description);
    albumGrid.appendChild(card);
  });
}

async function loadSongs() {
  if (!soundtrackList) return;

  const { data, error } = await supabaseClient
    .from("musicas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar músicas:", error);
    return;
  }

  soundtrackList.innerHTML = "";

  if (!data || data.length === 0) {
    soundtrackList.innerHTML = `
      <p style="opacity: 0.8;">
        Ainda não há músicas na trilha sonora.
      </p>
    `;
    return;
  }

  data.forEach((item) => {
    const card = createMusicCard(item.title, item.youtube_url);
    soundtrackList.appendChild(card);
  });
}

if (photoForm) {
  photoForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("photoFile");
    const descriptionInput = document.getElementById("photoDescription");

    const file = fileInput?.files?.[0];
    const description = descriptionInput?.value.trim();

    if (!file) {
      alert("Selecione uma imagem.");
      return;
    }

    if (!description) {
      alert("Escreva uma descrição para a foto.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("O arquivo selecionado não é uma imagem válida.");
      return;
    }

    const button = photoForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Enviando...";

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `fotos/${fileName}`;

      const { error: uploadError } = await supabaseClient
        .storage
        .from("album")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabaseClient
        .storage
        .from("album")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabaseClient
        .from("foto")
        .insert([
          {
            img_url: imageUrl,
            description: description
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      photoForm.reset();
      await loadPhotos();
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      alert("Não foi possível enviar a foto.");
    } finally {
      button.disabled = false;
      button.textContent = "Adicionar ao Álbum";
    }
  });
}

if (musicForm) {
  musicForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const musicTitle = document.getElementById("musicTitle").value.trim();
    const musicLink = document.getElementById("musicLink").value.trim();

    if (!musicTitle) {
      alert("Digite o título da música.");
      return;
    }

    if (!musicLink || !isValidUrl(musicLink)) {
      alert("Cole um link válido.");
      return;
    }

    const button = musicForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Salvando...";

    try {
      const { error } = await supabaseClient
        .from("musicas")
        .insert([
          {
            title: musicTitle,
            youtube_url: musicLink
          }
        ]);

      if (error) {
        throw error;
      }

      musicForm.reset();
      await loadSongs();
    } catch (error) {
      console.error("Erro ao salvar música:", error);
      alert("Não foi possível salvar a música.");
    } finally {
      button.disabled = false;
      button.textContent = "Adicionar à Trilha Sonora";
    }
  });
}

loadPhotos();
loadSongs();
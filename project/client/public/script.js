const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const messageBox = document.getElementById('message');
const gallery = document.getElementById('gallery');
const resizeForm = document.getElementById("resizeForm");
const resizeWidth = document.getElementById("resizeWidth");
const resizeHeight = document.getElementById("resizeHeight");
const resizedImageContainer = document.getElementById("resizedImageContainer");
const selectedImagePreview = document.getElementById("selectedImagePreview");

let selectedImageFilename = null; 


uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (imageInput.files.length === 0) {
    messageBox.textContent = "Please select an image.";
    messageBox.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);

  try {
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      messageBox.textContent = `${data.message}`;
      messageBox.style.color = "green";

      setTimeout(() => {
        const card = createImageCard(`/uploads/${data.filename}`);
        gallery.appendChild(card);
      }, 500);

    } else {
      messageBox.textContent = `${data.error || "Upload failed"}`;
      messageBox.style.color = "red";
    }
  } catch (err) {
    messageBox.textContent = `Error: ${err.message}`;
    messageBox.style.color = "red";
  }
});


function createImageCard(src) {
  const container = document.createElement("div");
  container.className = "image-item";

  const img = document.createElement("img");
  img.src = `http://localhost:3000${src}`;
  img.alt = src;
  img.width = 150;
  img.height = 150;


  container.appendChild(img);

  container.addEventListener("click", () => {
    selectedImageFilename = src.split("/").pop();

    document.querySelectorAll(".image-item").forEach(el => el.classList.remove("selected"));
    container.classList.add("selected");

    selectedImagePreview.innerHTML = `
      <h4>Selected Image:</h4>
      <img src="http://localhost:3000${src}" alt="${selectedImageFilename}" width="200" />
      <p>${selectedImageFilename}</p>
    `;
  });

  return container;
}



window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/images");
    const images = await res.json();

    images.forEach((src) => {
      const card = createImageCard(src);
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load images:", err);
  }
});

resizeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedImageFilename) {
    resizedImageContainer.innerHTML = `<p style="color:red;">Please select an image first.</p>`;
    return;
  }

  const width = resizeWidth.value;
  const height = resizeHeight.value;

  const url = `http://localhost:3000/api/images/resize?filename=${selectedImageFilename}&width=${width}&height=${height}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || "Resize failed");
    }

    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);

    resizedImageContainer.innerHTML = `
      <h4>Resized Image:</h4>
      <img src="${imgUrl}" alt="Resized image" />
    `;
  } catch (err) {
    resizedImageContainer.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});

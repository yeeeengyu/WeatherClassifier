const fileInput = document.getElementById("in");
const imageContainer = document.querySelector(".image-container");
const Jansori = document.getElementById("jansori");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "업로드된 이미지";
    img.style.maxWidth = "300px";
    img.style.marginTop = "10px";

    // 기존 이미지를 지우고 새로운 이미지를 추가
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);
  }
});
const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

// 파일 선택 후 파일 이름 표시 (선택 사항)
fileInput.addEventListener("change", (event) => {
  if (fileInput.files.length > 0) {
    uploadBtn.textContent = `선택된 파일: ${fileInput.files[0].name}`;
    Jansori.style.display = "none";
  }
});

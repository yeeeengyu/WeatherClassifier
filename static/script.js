const fileInput = document.getElementById("in");
const imageContainer = document.querySelector(".image-container");
const Jansori = document.getElementById("jansori");
const uploadBtn = document.getElementById("uploadBtn");
const classifyBtn = document.getElementById("Classify");
const resultDiv = document.getElementById("resultFUCK");

let selectedFile = null;

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "업로드된 이미지";
    img.style.maxWidth = "620px";
    img.style.marginTop = "40px";

    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);

    uploadBtn.textContent = `선택파일: ${file.name}`;
    if (Jansori) Jansori.style.display = "none";

    selectedFile = file;
  } else {
    imageContainer.innerHTML = "";
    uploadBtn.textContent = "사진 선택";
    selectedFile = null;
  }
});

classifyBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("먼저 이미지를 업로드해주세요!");
    return;
  }

  const fdata = new FormData();
  fdata.append("file", selectedFile);

  try {
    const response = await fetch("/predict/", {
      method: "POST",
      body: fdata,
    });

    if (!response.ok) {
      throw new Error("서버 응답 실패");
    }

    const data = await response.json();
    function sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec * 1000));
    }

    resultDiv.innerHTML = `<p>제가 보기에 이 날씨는...</p>`;
    await sleep(2);
    if (data.weather) {
      resultDiv.innerHTML = `<p>이 사진의 날씨는 <strong>${data.weather}</strong>이네요!! 맞나요???????</p>`;
    } else if (data.error) {
      resultDiv.innerHTML = `<p>에러 발생: ${data.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>에러 ${error.message}</p>`;
  }
});

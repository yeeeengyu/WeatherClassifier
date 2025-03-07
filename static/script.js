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

    // 기존 이미지 삭제 후 새로운 이미지 추가
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);

    // 버튼 텍스트 변경
    uploadBtn.textContent = `선택된 파일: ${file.name}`;
    Jansori && (Jansori.style.display = "none");

    selectedFile = file; // 선택한 파일 저장
  }
});

// 분류 시작 버튼 이벤트 리스너 추가
classifyBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("먼저 이미지를 업로드하세요!");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("/predict/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("서버 응답에 실패했습니다.");
    }

    const data = await response.json();
    function sleep(sec) {
      return new Promise((resolve) => setTimeout(resolve, sec * 1000));
    }
    resultDiv.innerHTML = `<p>제가 보기에 이 날씨는...</p>`;
    await sleep(2);
    if (data.weather == "rainy") {
      resultDiv.innerHTML = `<p>이 사진의 날씨는 <strong>${data.weather}</strong>네요!! 우산챙기세요 지금 당장 !!!!!!!!!!!!!!!!! ☔</p>`;
    } else if (data.weather) {
      resultDiv.innerHTML = `<p>이 사진의 날씨는 <strong>${data.weather}</strong>이네요!! 맞나요???????</p>`;
    } else if (data.error) {
      resultDiv.innerHTML = `<p>에러 발생: ${data.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>에러 발생: ${error.message}</p>`;
  }
});

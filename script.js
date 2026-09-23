// script.js

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvf9XMxHHJgVk6CCAUoTMUz7wU486LFsEIjaSh6T9GnqeJWZo53txvo6sUkOtS-oMW/exec";

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    formMessage.textContent = "Submitting...";

    try {

        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        });

        form.reset();

        formMessage.textContent =
            "Thank you! Your form has been submitted.";

    } catch (error) {

        formMessage.textContent =
            "Something went wrong. Please try again.";

        console.error(error);
    }
});






















































document.addEventListener("DOMContentLoaded", () => { const feed = document.getElementById("videoFeed"); const videos = document.querySelectorAll(".video"); const uploadModal = document.getElementById("uploadModal"); const commentModal = document.getElementById("commentModal"); const uploadBtn = document.getElementById("uploadBtn"); const bottomUpload = document.getElementById("bottomUpload"); const closeModal = document.getElementById("closeModal"); const closeComments = document.getElementById("closeComments"); const searchBtn = document.getElementById("searchBtn"); const searchBox = document.getElementById("searchBox"); const videoInput = document.getElementById("videoInput"); const captionInput = document.getElementById("captionInput"); const publishBtn = document.getElementById("publishBtn"); const commentInput = document.getElementById("commentInput"); const sendComment = document.getElementById("sendComment"); const commentsList = document.getElementById("commentsList"); /* ========================= VIDEO AUTOPLAY ========================= */ const observer = new IntersectionObserver( (entries) => { entries.forEach(entry => { const video = entry.target; if (entry.isIntersecting) { videos.forEach(v => { if (v !== video) { v.pause(); } }); video.play().catch(() => {}); } else { video.pause(); } }); }, { threshold: 0.65 } ); videos.forEach(video => { observer.observe(video); }); /* ========================= CLICK VIDEO = PLAY/PAUSE ========================= */ document.querySelectorAll(".video").forEach(video => { video.addEventListener("click", () => { if (video.paused) { video.play(); } else { video.pause(); } }); }); /* ========================= LIKE ========================= */ document.querySelectorAll(".like-btn").forEach(button => { button.addEventListener("click", () => { const icon = button.querySelector("strong"); const counter = button.querySelector("small"); const currentText = counter.textContent; let number = parseFloat( currentText.replace("K", "") ); if (!button.classList.contains("liked")) { button.classList.add("liked"); icon.textContent = "♥"; if (currentText.includes("K")) { number += 0.1; counter.textContent = number.toFixed(1) + "K"; } else { counter.textContent = (number + 1).toString(); } } else { button.classList.remove("liked"); icon.textContent = "♡"; if (currentText.includes("K")) { number -= 0.1; counter.textContent = Math.max(number, 0).toFixed(1) + "K"; } else { counter.textContent = Math.max(number - 1, 0).toString(); } } }); }); /* ========================= COMMENTS ========================= */ document.querySelectorAll(".comment-btn").forEach(button => { button.addEventListener("click", () => { commentModal.classList.add("show"); }); }); closeComments.addEventListener("click", () => { commentModal.classList.remove("show"); }); sendComment.addEventListener("click", addComment); commentInput.addEventListener("keydown", event => { if (event.key === "Enter") { addComment(); } }); function addComment() { const text = commentInput.value.trim(); if (!text) { return; } const comment = document.createElement("div"); comment.className = "comment"; comment.innerHTML = ` <strong>@you</strong> <p>${escapeHTML(text)}</p> `; commentsList.appendChild(comment); commentInput.value = ""; commentsList.scrollTop = commentsList.scrollHeight; } /* ========================= SHARE ========================= */ document.querySelectorAll(".share-btn").forEach(button => { button.addEventListener("click", async () => { const shareData = { title: "VibeShorts", text: "Check out this video!", url: window.location.href }; try { if (navigator.share) { await navigator.share(shareData); } else { await navigator.clipboard.writeText( window.location.href ); alert("Video link copied!"); } } catch (error) { console.log("Share cancelled."); } }); }); /* ========================= MUTE / UNMUTE ========================= */ document.querySelectorAll(".mute-btn").forEach(button => { button.addEventListener("click", () => { const card = button.closest(".video-card"); const video = card.querySelector(".video"); const icon = button.querySelector("strong"); video.muted = !video.muted; icon.textContent = video.muted ? "🔇" : "🔊"; }); }); /* ========================= SEARCH ========================= */ searchBtn.addEventListener("click", () => { searchBox.classList.toggle("show"); if (searchBox.classList.contains("show")) { document.getElementById("searchInput").focus(); } }); /* ========================= UPLOAD MODAL ========================= */ function openUploadModal() { uploadModal.classList.add("show"); } uploadBtn.addEventListener("click", openUploadModal); bottomUpload.addEventListener("click", openUploadModal); closeModal.addEventListener("click", () => { uploadModal.classList.remove("show"); }); /* ========================= VIDEO UPLOAD PREVIEW ========================= */ videoInput.addEventListener("change", () => { const file = videoInput.files[0]; if (!file) { return; } if (!file.type.startsWith("video/")) { alert("Please select a video file."); videoInput.value = ""; return; } alert( `Selected: ${file.name}\n\nClick Publish to add it to your local demo feed.` ); }); /* ========================= PUBLISH VIDEO ========================= */ publishBtn.addEventListener("click", () => { const file = videoInput.files[0]; if (!file) { alert("Please select a video first."); return; } const caption = captionInput.value.trim() || "New video 🎬"; const videoURL = URL.createObjectURL(file); const article = document.createElement("article"); article.className = "video-card"; article.innerHTML = ` <video class="video" src="${videoURL}" loop muted playsinline ></video> <div class="video-gradient"></div> <div class="video-info"> <h3>@you</h3> <p>${escapeHTML(caption)}</p> <span>🎵 Original Sound</span> </div> <div class="video-actions"> <button class="action like-btn"> <strong>♡</strong> <small>0</small> </button> <button class="action comment-btn"> <strong>💬</strong> <small>0</small> </button> <button class="action share-btn"> <strong>↗</strong> <small>Share</small> </button> <button class="action mute-btn"> <strong>🔇</strong> <small>Sound</small> </button> </div> `; feed.appendChild(article); setupNewVideo(article); uploadModal.classList.remove("show"); videoInput.value = ""; captionInput.value = ""; article.scrollIntoView({ behavior: "smooth" }); }); /* ========================= NEW VIDEO FUNCTIONS ========================= */ function setupNewVideo(card) { const video = card.querySelector(".video"); observer.observe(video); video.addEventListener("click", () => { if (video.paused) { video.play(); } else { video.pause(); } }); const likeBtn = card.querySelector(".like-btn"); likeBtn.addEventListener("click", () => { const icon = likeBtn.querySelector("strong"); const counter = likeBtn.querySelector("small"); let number = parseInt(counter.textContent) || 0; if (!likeBtn.classList.contains("liked")) { likeBtn.classList.add("liked"); icon.textContent = "♥"; counter.textContent = number + 1; } else { likeBtn.classList.remove("liked"); icon.textContent = "♡"; counter.textContent = Math.max(number - 1, 0); } }); const commentBtn = card.querySelector(".comment-btn"); commentBtn.addEventListener("click", () => { commentModal.classList.add("show"); }); const shareBtn = card.querySelector(".share-btn"); shareBtn.addEventListener("click", async () => { try { if (navigator.share) { await navigator.share({ title: "VibeShorts", text: "Check out this video!", url: window.location.href }); } else { await navigator.clipboard.writeText( window.location.href ); alert("Link copied!"); } } catch (error) {} }); const muteBtn = card.querySelector(".mute-btn"); muteBtn.addEventListener("click", () => { video.muted = !video.muted; muteBtn.querySelector("strong").textContent = video.muted ? "🔇" : "🔊"; }); } /* ========================= ESCAPE HTML ========================= */ function escapeHTML(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; } /* ========================= CLOSE MODAL BY BACKGROUND ========================= */ uploadModal.addEventListener("click", event => { if (event.target === uploadModal) { uploadModal.classList.remove("show"); } }); commentModal.addEventListener("click", event => { if (event.target === commentModal) { commentModal.classList.remove("show"); } }); });

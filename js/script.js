function toggleVinylPlay() {
  var audio = document.getElementById("myAudio");
  var vinyl = document.getElementById("musicVinyl");

  if (audio.paused) {
    audio.play();
    vinyl.style.animationPlayState = "running"; // تشغيل دوران الدسكة تلقائياً مع الصوت
  } else {
    audio.pause();
    vinyl.style.animationPlayState = "paused"; // إيقاف الدوران عند إيقاف الصوت
  }
}

// ================= Hover-to-play for song list (controls the vinyl) =================
(() => {
  const hoverAudio = new Audio();
  hoverAudio.loop = true;

  const vinylEl = document.getElementById("musicVinyl");
  const listCards = document.querySelectorAll(".divider .list .card");

  if (listCards.length === 0) return;

  listCards.forEach((card) => {
    const src = card.dataset.audio;
    if (!src) return;

    card.addEventListener("mouseenter", () => {
      try {
        if (hoverAudio.src !== src) hoverAudio.src = src;
        hoverAudio.play().catch(() => {});
        if (vinylEl) vinylEl.style.animationPlayState = "running";
      } catch (e) {}
    });

    card.addEventListener("mouseleave", () => {
      try {
        hoverAudio.pause();
        hoverAudio.currentTime = 0;
        if (vinylEl) vinylEl.style.animationPlayState = "paused";
      } catch (e) {}
    });

    // support touch/click: toggle play for that card
    card.addEventListener("click", (e) => {
      // ignore clicks on links inside card
      if (e.target.closest("a, button, input, textarea")) return;
      try {
        if (
          !hoverAudio.paused &&
          hoverAudio.src &&
          hoverAudio.src.includes(src)
        ) {
          hoverAudio.pause();
          hoverAudio.currentTime = 0;
          if (vinylEl) vinylEl.style.animationPlayState = "paused";
        } else {
          hoverAudio.src = src;
          hoverAudio.play().catch(() => {});
          if (vinylEl) vinylEl.style.animationPlayState = "running";
        }
      } catch (e) {}
    });
  });
})();

// ================= 3. سلايدر الورشة =================
const wCards = document.querySelectorAll(".workshop-card");
const wDotsContainer = document.getElementById("workshop-dotsContainer");

let wCurrent = 0;

if (wCards.length > 0) {
  // تنظيف الدوتس
  if (wDotsContainer) {
    wDotsContainer.innerHTML = "";

    // إنشاء الدوتس
    wCards.forEach((_, index) => {
      const dot = document.createElement("div");

      dot.classList.add("workshop-dot");

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.onclick = () => {
        wCurrent = index;
        updateWorkshopSlider();
      };

      wDotsContainer.appendChild(dot);
    });
  }

  // تحديث السلايدر
  function updateWorkshopSlider() {
    wCards.forEach((card, index) => {
      // حذف كل الكلاسات
      card.classList.remove("active", "left", "right");

      // الكرت الحالي
      if (index === wCurrent) {
        card.classList.add("active");
      }

      // الكرت اليسار
      else if (index === (wCurrent - 1 + wCards.length) % wCards.length) {
        card.classList.add("left");
      }

      // الكرت اليمين
      else if (index === (wCurrent + 1) % wCards.length) {
        card.classList.add("right");
      }
    });

    // تحديث الدوتس
    const dots = document.querySelectorAll(".workshop-dot");

    dots.forEach((dot, index) => {
      dot.classList.remove("active");

      if (index === wCurrent) {
        dot.classList.add("active");
      }
    });
  }

  // تشغيل أول مرة
  updateWorkshopSlider();

  // زر التالي
  const nextBtn = document.getElementById("workshop-next");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      wCurrent = (wCurrent + 1) % wCards.length;
      updateWorkshopSlider();
    });
  }

  // زر السابق
  const prevBtn = document.getElementById("workshop-prev");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      wCurrent = (wCurrent - 1 + wCards.length) % wCards.length;

      updateWorkshopSlider();
    });
  }
}

// ================= 4. Carousel صور =================
const carouselImages = document.querySelectorAll(".carousel-image");
const prevCarouselBtn = document.querySelector(".carousel-prev");
const nextCarouselBtn = document.querySelector(".carousel-next");
const carouselDotsContainer = document.querySelector(".carousel-dots");

let carouselIndex = 0;

if (carouselImages.length > 0) {
  const createDots = () => {
    if (!carouselDotsContainer) return;
    carouselDotsContainer.innerHTML = "";

    carouselImages.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.addEventListener("click", () => {
        carouselIndex = index;
        updateCarousel();
      });
      carouselDotsContainer.appendChild(dot);
    });
  };

  const updateCarousel = () => {
    carouselImages.forEach((image, index) => {
      image.classList.toggle("active", index === carouselIndex);
    });

    if (!carouselDotsContainer) return;
    carouselDotsContainer.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("active", index === carouselIndex);
    });
  };

  createDots();
  updateCarousel();

  if (nextCarouselBtn) {
    nextCarouselBtn.addEventListener("click", () => {
      carouselIndex = (carouselIndex + 1) % carouselImages.length;
      updateCarousel();
    });
  }

  if (prevCarouselBtn) {
    prevCarouselBtn.addEventListener("click", () => {
      carouselIndex =
        (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
      updateCarousel();
    });
  }
}

// ================= Hover sound for book cards (click sound) =================
(() => {
  const bookSound = new Audio("/assets/Raghad/click.mp3");
  bookSound.preload = "auto";

  const bookCards = document.querySelectorAll(".sec-3 .cards-container .card");
  if (bookCards.length === 0) return;

  bookCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      try {
        bookSound.currentTime = 0;
        bookSound.play().catch(() => {});
      } catch (e) {}
    });

    card.addEventListener("mouseleave", () => {
      try {
        bookSound.pause();
        bookSound.currentTime = 0;
      } catch (e) {}
    });

    // also support touch: play briefly on touchstart
    card.addEventListener(
      "touchstart",
      () => {
        try {
          bookSound.currentTime = 0;
          bookSound.play().catch(() => {});
        } catch (e) {}
      },
      { passive: true },
    );
  });
})();

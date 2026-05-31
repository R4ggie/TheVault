// ==========================================================================
// 1. جلب العناصر الأساسية من صفحة HTML
// ==========================================================================
const togglePostBtn = document.getElementById("togglePostBtn");
const createPost = document.getElementById("createPost");
const publishBtn = document.getElementById("publishBtn");
const feed = document.getElementById("feed");
const filterButtons = document.querySelectorAll(".filters button");

// جلب عناصر التحكم بالهوية داخل صندوق المنشور
const currentUserSelect = document.getElementById("currentUser");
const boxAvatar = document.getElementById("boxAvatar");
const boxAuthorName = document.getElementById("boxAuthorName");

// 🔥 جلب العناصر الخاصة بالـ Sidebar لتحديثها عند تغيير المستخدم 🔥
const sidebarAvatar = document.getElementById("sidebarAvatar");
const sidebarName = document.getElementById("sidebarName");

// ==========================================================================
// 2. قاعدة بيانات الهويات المحدثة بالصور المحلية الصحيحة ولينكات الصفحات
// ==========================================================================
const identities = {
  NOORHAN: {
    name: "Noorhanz",
    avatar: "/assets/DearDiary/noorhan.jpg", // صورتي
    color: "#4f8cff",
    type: "me",
    profileLink: "html/Noorhanz.html",
  },
  RAGAD: {
    name: "Raghadz",
    avatar: "/assets/DearDiary/raghad.jpg", // صورة رغد
    color: "#ff7f96",
    type: "friend",
    profileLink: "html/Raghadz.html",
  },
  USER: {
    name: "مشاهد خارجي",
    avatar: "/assets/DearDiary/money.jpg", // صورة عامة للزائر
    color: "#ccc",
    type: "visitor",
    profileLink: "#",
  },
};

// مصفوفة جلب البيانات المخزنة من ذاكرة المتصفح (Local Storage) لمنع اختفائها
let savedPosts = JSON.parse(localStorage.getItem("vault_posts")) || [];

// ==========================================================================
// 3. إدارة الأحداث والتحميل الأساسي
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
  handleIdentityChange(); // ضبط الهوية الافتراضية عند الإقلاع
});

// مراقبة القائمة المنسدلة (من أنت؟) عند التغيير فوراً
if (currentUserSelect) {
  currentUserSelect.addEventListener("change", handleIdentityChange);
}

// 🔥 دالة معالجة الهويات المصلحة بالكامل (تغير السايدبار والصندوق معاً) 🔥
function handleIdentityChange() {
  const selectedUser = currentUserSelect.value;
  const userConfig = identities[selectedUser];

  if (!userConfig) return;

  if (selectedUser === "USER") {
    // إذا كان زائر أو مستخدم عادي: يختفي زر الإضافة والصندوق تماماً
    if (togglePostBtn) togglePostBtn.classList.add("hidden");
    if (createPost) createPost.classList.add("hidden");

    // تحديث السايدبار لبيانات الزائر
    if (sidebarName) sidebarName.innerText = userConfig.name;
    if (sidebarAvatar) sidebarAvatar.src = userConfig.avatar;
  } else {
    // إذا كانت رغد أو نور هان: يظهر زر إضافة منشور
    if (togglePostBtn) togglePostBtn.classList.remove("hidden");

    // 1. التحديث السحري لعناصر الـ Sidebar الشخصي فوق
    if (sidebarAvatar) sidebarAvatar.src = userConfig.avatar;
    if (sidebarName) sidebarName.innerText = userConfig.name;

    // 2. تغيير الصورة والاسم واللون داخل صندوق إنشاء منشور فوراً ليطابق المختار
    if (boxAvatar) boxAvatar.src = userConfig.avatar;
    if (boxAuthorName) {
      boxAuthorName.innerText = userConfig.name;
      boxAuthorName.style.color = userConfig.color;
    }
  }
}

// تشغيل وإغلاق صندوق المنشور التبادلي
if (togglePostBtn) {
  togglePostBtn.addEventListener("click", () => {
    if (currentUserSelect.value !== "USER") {
      createPost.classList.toggle("hidden");
    }
  });
}

// ==========================================================================
// 4. منطق نشر وحفظ واسترجاع المنشورات
// ==========================================================================
if (publishBtn) {
  publishBtn.addEventListener("click", () => {
    const text = document.getElementById("postText").value;
    const imageInput = document.getElementById("postImage");
    const activeUser = currentUserSelect.value;

    if (activeUser === "USER") return; // منع الزائر من النشر حماية برمجية

    if (text.trim() === "") {
      alert("اكتبي منشور أولاً");
      return;
    }

    const userConfig = identities[activeUser];

    // التحقق من وجود صورة مرفقة لتحويلها لكود وحفظها
    if (imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        savePostToObj(
          userConfig.name,
          userConfig.avatar,
          userConfig.type,
          text,
          e.target.result,
          userConfig.profileLink,
        );
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      savePostToObj(
        userConfig.name,
        userConfig.avatar,
        userConfig.type,
        text,
        "",
        userConfig.profileLink,
      );
    }
  });
}

// دالة تجميع بيانات المنشور وحفظه الدائم في الـ LocalStorage
function savePostToObj(name, avatar, type, text, imgData, profileLink) {
  const newPostObj = {
    id: Date.now(),
    name: name,
    avatar: avatar,
    type: type, // 'me' أو 'friend'
    text: text,
    image: imgData,
    profileLink: profileLink, // حفظ رابط الحساب الشخصي ليعمل بشكل صحيح عند الضغط على الصورة
    time: Date.now(),
  };

  // إدراج المنشور الجديد في مقدمة مصفوفة التايم لاين
  savedPosts.unshift(newPostObj);

  // الحفظ النهائي داخل المتصفح
  localStorage.setItem("vault_posts", JSON.stringify(savedPosts));

  // إعادة رسم الساحة وتنظيف الخانات
  renderPosts();
  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";
  createPost.classList.add("hidden");
}

// دالة قراءة المصفوفة وطباعتها على الشاشة بهيكل الـ HTML الفخم
function renderPosts() {
  if (!feed) return;
  feed.innerHTML = ""; // مسح الساحة منعاً للتكرار

  savedPosts.forEach((postData) => {
    const post = document.createElement("div");
    post.className = `post ${postData.type}`;
    post.setAttribute("data-time", postData.time);

    let imageHTML = postData.image
      ? `<img class="post-image" src="${postData.image}" alt="Post Image">`
      : "";
    let linkHref = postData.profileLink ? postData.profileLink : "#";

    // ترتيب عرض العناصر بناء على النوع: إذا كان 'me' (أنتِ نور) يقلب الترتيب ليتوافق مع اتجاه الـ LTR برمجياً وبشكل مريح للعين
    if (postData.type === "me") {
      post.innerHTML = `
                <div class="content">
                    <h4>${postData.name}</h4>
                    <p>${postData.text}</p>
                    ${imageHTML}
                </div>
                <a href="${linkHref}">
                    <img class="avatar" src="${postData.avatar}" alt="${postData.name}">
                </a>
            `;
    } else {
      // كروت رغد (friend) تبدأ بالأفاتار يميناً ثم المحتوى يساراً
      post.innerHTML = `
                <a href="${linkHref}">
                    <img class="avatar" src="${postData.avatar}" alt="${postData.name}">
                </a>
                <div class="content">
                    <h4>${postData.name}</h4>
                    <p>${postData.text}</p>
                    ${imageHTML}
                </div>
            `;
    }
    feed.appendChild(post);
  });
}

// ==========================================================================
// 5. نظام الفلترة والفرز الذكي للمنشورات
// ==========================================================================
filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    const filterValue =
      e.target.getAttribute("data-filter") || e.target.innerText;
    const posts = Array.from(feed.querySelectorAll(".post"));

    posts.forEach((post) => {
      if (
        filterValue === "all" ||
        e.target.innerText === "الكل" ||
        e.target.innerText === "ALL"
      ) {
        post.style.display = "flex";
      } else if (
        filterValue === "me" ||
        e.target.innerText === "مناشيري" ||
        e.target.innerText === "Publications Noorhanz"
      ) {
        post.style.display = post.classList.contains("me") ? "flex" : "none";
      } else if (
        filterValue === "friend" ||
        e.target.innerText === "مناشير صديقتي" ||
        e.target.innerText === "Publications Raghadz"
      ) {
        post.style.display = post.classList.contains("friend")
          ? "flex"
          : "none";
      } else if (
        filterValue === "latest" ||
        e.target.innerText === "الأحدث" ||
        e.target.innerText === "Latest"
      ) {
        post.style.display = "flex";
        posts.sort(
          (a, b) => b.getAttribute("data-time") - a.getAttribute("data-time"),
        );
        posts.forEach((p) => feed.appendChild(p));
      }
    });
  });
});

// interactions.js — Theme switcher, ID Card Flip, Interactive Phone Chat, Copy to Clipboard, and UI widgets

// ---------- 1. Dark / Light Mode Switcher ----------
const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
const themeIconLight = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const themeIconDark = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function getPreferredTheme() {
  const saved = localStorage.getItem('ranjeet_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ranjeet_theme', theme);
  themeToggleBtns.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? themeIconLight : themeIconDark;
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

// Initial theme setup
applyTheme(getPreferredTheme());

themeToggleBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
});

// Listen for OS theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('ranjeet_theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});


// ---------- 2. Flip card (ID card <-> phone chat) ----------
const flipcard = document.getElementById('flipcard');
if (flipcard) {
  // Prevent flipping when interacting with phone inputs or chips
  flipcard.addEventListener('click', (e) => {
    if (e.target.closest('.phone-input') || e.target.closest('.phone-chips') || e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    flipcard.classList.toggle('flipped');
  });
}


// ---------- 3. Interactive Phone Chat (Back of Card) ----------
const phoneInput = document.getElementById('phoneInput');
const phoneSendBtn = document.getElementById('phoneSendBtn');
const phoneBody = document.getElementById('phoneChatBody');
const chatChips = document.querySelectorAll('.chat-chip');

const botReplies = {
  'projects': "I've built <strong>La Roche Cafe</strong> (Full-stack MERN + WebSockets) and am currently researching <strong>Echoes of the Ancient</strong> (AI photo-to-audio synthesis)! Check out the Work tab below 🚀",
  'skills': "My core stack includes <strong>Python, PyTorch, Scikit-learn, React, Node.js, SQL, and Streamlit</strong>. Plus SOP design & Operations management!",
  'background': "I'm a 2nd-year Electronics & CS undergrad at <strong>SAKEC Mumbai</strong>, concurrently in the <strong>Masai × IIT Patna</strong> AI/ML program with an 8.5 CGPA.",
  'contact': "Feel free to email me at <a href='mailto:ranjeet8022007@gmail.com' style='color:inherit;text-decoration:underline;'><strong>ranjeet8022007@gmail.com</strong></a> or connect on LinkedIn / GitHub!",
  'default': "Thanks for saying hi! Check out my work and feel free to reach out anytime via email or LinkedIn."
};

function appendUserMessage(text) {
  if (!phoneBody) return;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.innerHTML = `<p>${text}</p>`;
  phoneBody.appendChild(bubble);
  phoneBody.scrollTop = phoneBody.scrollHeight;
}

function appendBotMessage(html) {
  if (!phoneBody) return;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  bubble.innerHTML = `
    <img src="assets/ranjeet.png" alt="Ranjeet avatar">
    <p>${html}</p>
  `;
  phoneBody.appendChild(bubble);
  phoneBody.scrollTop = phoneBody.scrollHeight;
}

function handleChatSubmit(userQuery) {
  const clean = userQuery.trim().toLowerCase();
  if (!clean) return;

  appendUserMessage(userQuery);
  if (phoneInput) phoneInput.value = '';

  setTimeout(() => {
    let reply = botReplies.default;
    if (clean.includes('project') || clean.includes('work') || clean.includes('built') || clean.includes('la roche') || clean.includes('ancient')) {
      reply = botReplies.projects;
    } else if (clean.includes('skill') || clean.includes('tech') || clean.includes('stack') || clean.includes('python')) {
      reply = botReplies.skills;
    } else if (clean.includes('who') || clean.includes('about') || clean.includes('college') || clean.includes('iit') || clean.includes('background')) {
      reply = botReplies.background;
    } else if (clean.includes('contact') || clean.includes('hire') || clean.includes('email') || clean.includes('touch') || clean.includes('connect')) {
      reply = botReplies.contact;
    }
    appendBotMessage(reply);
  }, 400);
}

if (phoneSendBtn && phoneInput) {
  phoneSendBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleChatSubmit(phoneInput.value);
  });
  phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChatSubmit(phoneInput.value);
    }
  });
}

chatChips.forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const query = chip.dataset.query || chip.textContent;
    handleChatSubmit(query);
  });
});


// ---------- 4. Work / About tabs ----------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const targetPanel = document.getElementById('panel-' + tab.dataset.tab);
    if (targetPanel) targetPanel.classList.add('active');
  });
});


// ---------- 5. Copy to clipboard helper ----------
window.copyToClipboard = function(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = '✓ Copied!';
    btnElement.style.background = 'var(--accent)';
    btnElement.style.color = '#fff';
    setTimeout(() => {
      btnElement.innerHTML = originalText;
      btnElement.style.background = '';
      btnElement.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy', err);
  });
};


// ---------- 6. Sidebar "save profile" toggle ----------
const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
  const isSaved = localStorage.getItem('ranjeet_profile_saved') === 'true';
  if (isSaved) saveBtn.classList.add('active');

  saveBtn.addEventListener('click', () => {
    const active = saveBtn.classList.toggle('active');
    localStorage.setItem('ranjeet_profile_saved', active);
    saveBtn.setAttribute('title', active ? 'Profile saved to bookmarks' : 'Save profile');
  });
}


// ==========================================================================
// 7. NOT FOR RECRUITERS — Pinterest Scrapbook & Owner Studio Engine
// ==========================================================================

const OWNER_SECRET_PIN = '2029'; // Default master PIN
const pinterestGrid = document.getElementById('pinterestGrid');
const ownerModal = document.getElementById('ownerPostModal');
const ownerFab = document.getElementById('ownerPostFab');
const ownerTriggerBtn = document.getElementById('ownerTriggerBtn');
const postTypeSelect = document.getElementById('postType');
const mediaUrlGroup = document.getElementById('mediaUrlGroup');
const mediaUrlInput = document.getElementById('mediaUrl');
const postForm = document.getElementById('ownerPostForm');
const scrapbookFilterBtns = document.querySelectorAll('.filter-btn');

let scrapbookPosts = [];

// Helper: Convert any Spotify URL to standard embed URL
function getSpotifyEmbedUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('spotify.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      const type = parts[0] || 'track';
      const id = parts[1] || '';
      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    }
  } catch(e) {
    console.error('Invalid Spotify URL', e);
  }
  return url;
}

// Helper: Format Video Embed (YouTube / Direct)
function getVideoEmbedHtml(url) {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else {
      videoId = new URL(url).searchParams.get('v');
    }
    return `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
  }
  return `<video src="${url}" controls preload="metadata"></video>`;
}

// Render individual Pinterest Card
function createPinCardElement(post) {
  const card = document.createElement('div');
  card.className = 'pin-card';
  card.dataset.id = post.id;
  card.dataset.type = post.type;

  let mediaHtml = '';
  if (post.type === 'image' && (post.imageUrl || post.mediaUrl)) {
    mediaHtml = `
      <div class="pin-image-wrap">
        <img src="${post.imageUrl || post.mediaUrl}" alt="${post.title || 'Scrapbook visual'}" loading="lazy">
      </div>
    `;
  } else if (post.type === 'spotify' && (post.spotifyUrl || post.mediaUrl)) {
    const embedUrl = getSpotifyEmbedUrl(post.spotifyUrl || post.mediaUrl);
    mediaHtml = `
      <div class="pin-spotify-wrap">
        <iframe src="${embedUrl}" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    `;
  } else if (post.type === 'video' && (post.videoUrl || post.mediaUrl)) {
    mediaHtml = `
      <div class="pin-video-wrap">
        ${getVideoEmbedHtml(post.videoUrl || post.mediaUrl)}
      </div>
    `;
  }

  let textHtml = '';
  if (post.type === 'thought') {
    textHtml = `
      <p class="pin-thought-text">"${post.content}"</p>
      ${post.author ? `<div class="pin-thought-author">${post.author}</div>` : ''}
    `;
  } else {
    textHtml = `
      ${post.title ? `<h4 class="pin-title">${post.title}</h4>` : ''}
      ${post.caption || post.content ? `<p class="pin-caption">${post.caption || post.content}</p>` : ''}
    `;
  }

  // Reactions HTML
  const reactions = post.reactions || { "🔥": 0, "💡": 0 };
  const reactionButtons = Object.entries(reactions).map(([emoji, count]) => `
    <button class="pin-reaction-btn" data-emoji="${emoji}" data-id="${post.id}">
      <span>${emoji}</span> <span class="react-count">${count}</span>
    </button>
  `).join('');

  card.innerHTML = `
    <div class="pin-top">
      <span class="pin-tag">${post.tag || post.type}</span>
      <span class="pin-date">${post.date || 'Recent'}</span>
    </div>
    ${mediaHtml}
    ${textHtml}
    <div class="pin-footer">
      <div class="pin-reactions">
        ${reactionButtons}
      </div>
      <button class="pin-delete-btn" data-id="${post.id}" title="Delete post (Owner only)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  `;

  return card;
}

// Render full Pinterest Masonry Grid
function renderPinterestGrid(filter = 'all') {
  if (!pinterestGrid) return;
  pinterestGrid.innerHTML = '';

  const filtered = filter === 'all' ? scrapbookPosts : scrapbookPosts.filter(p => p.type === filter);

  if (filtered.length === 0) {
    pinterestGrid.innerHTML = `
      <div style="column-span:all;text-align:center;padding:40px;color:var(--ink-faint);font-size:14px;">
        No entries found in this category yet.
      </div>
    `;
    return;
  }

  filtered.forEach(post => {
    const card = createPinCardElement(post);
    pinterestGrid.appendChild(card);
  });

  // Attach Reaction Click Handlers
  document.querySelectorAll('.pin-reaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = btn.dataset.id;
      const emoji = btn.dataset.emoji;
      const countEl = btn.querySelector('.react-count');
      if (countEl) {
        let current = parseInt(countEl.textContent || '0', 10);
        countEl.textContent = current + 1;
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = '', 200);

        // Update in memory & storage
        const targetPost = scrapbookPosts.find(p => p.id === postId);
        if (targetPost) {
          if (!targetPost.reactions) targetPost.reactions = {};
          targetPost.reactions[emoji] = (targetPost.reactions[emoji] || 0) + 1;
          saveCustomPosts();
        }
      }
    });
  });

  // Attach Delete Handlers (Owner Mode)
  document.querySelectorAll('.pin-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = btn.dataset.id;
      if (confirm('Are you sure you want to delete this post?')) {
        scrapbookPosts = scrapbookPosts.filter(p => p.id !== postId);
        saveCustomPosts();
        renderPinterestGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
      }
    });
  });
}

function saveCustomPosts() {
  localStorage.setItem('ranjeet_scrapbook_posts', JSON.stringify(scrapbookPosts));
}

// Load Posts (combining data/thoughts.json with localStorage)
async function loadScrapbookPosts() {
  const localSaved = localStorage.getItem('ranjeet_scrapbook_posts');
  if (localSaved) {
    try {
      scrapbookPosts = JSON.parse(localSaved);
      renderPinterestGrid();
      return;
    } catch(e) {
      console.error('Error parsing local scrapbook', e);
    }
  }

  try {
    const res = await fetch('data/thoughts.json');
    if (res.ok) {
      scrapbookPosts = await res.json();
    } else {
      throw new Error('Failed to fetch thoughts.json');
    }
  } catch(e) {
    // Fallback initial dataset
    scrapbookPosts = [
      {
        id: "post-1",
        type: "thought",
        tag: "Hot Take",
        content: "Most ML bottlenecks aren't solved by tuning hyperparameters for 6 hours — they're solved by fixing the messy data pipeline and writing unambiguous SOPs.",
        author: "Ranjeet Epili",
        date: "Sep 2026",
        reactions: { "🔥": 14, "💡": 9 }
      },
      {
        id: "post-2",
        type: "spotify",
        tag: "Soundtrack",
        title: "Late Night Coding & Ops Focus",
        spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
        caption: "On repeat whenever building neural networks at 2 AM.",
        date: "Sep 2026",
        reactions: { "❤️": 21, "🎧": 12 }
      },
      {
        id: "post-3",
        type: "image",
        tag: "Lab Vibe",
        title: "Hardware & Late Night Builds",
        imageUrl: "assets/ranjeet.png",
        caption: "Electronics, signals, and Python scripts running on 3 monitors simultaneously.",
        date: "Sep 2026",
        reactions: { "⚡": 18, "🔥": 27 }
      }
    ];
  }
  saveCustomPosts();
  renderPinterestGrid();
}

// Filter button clicks
scrapbookFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    scrapbookFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPinterestGrid(btn.dataset.filter);
  });
});

// Owner Authentication Check
function checkOwnerAuth() {
  const isOwner = localStorage.getItem('ranjeet_owner_verified') === 'true';
  if (isOwner) {
    document.body.classList.add('owner-mode');
    if (ownerFab) ownerFab.style.display = 'grid';
    if (ownerTriggerBtn) ownerTriggerBtn.innerHTML = '✨ Owner Studio (Unlocked)';
  }
}

function promptOwnerUnlock() {
  const isOwner = localStorage.getItem('ranjeet_owner_verified') === 'true';
  if (isOwner) {
    openOwnerModal();
    return;
  }

  const pin = prompt('Enter Owner Master Passcode to unlock Posting Studio:');
  if (pin === OWNER_SECRET_PIN) {
    localStorage.setItem('ranjeet_owner_verified', 'true');
    checkOwnerAuth();
    openOwnerModal();
  } else if (pin !== null) {
    alert('Incorrect PIN. Access denied.');
  }
}

function openOwnerModal() {
  if (ownerModal) ownerModal.classList.add('active');
}
function closeOwnerModal() {
  if (ownerModal) ownerModal.classList.remove('active');
}

// Post Type select changes
if (postTypeSelect && mediaUrlGroup) {
  postTypeSelect.addEventListener('change', () => {
    const val = postTypeSelect.value;
    if (val === 'thought') {
      mediaUrlGroup.style.display = 'none';
      if (mediaUrlInput) mediaUrlInput.required = false;
    } else {
      mediaUrlGroup.style.display = 'flex';
      const label = mediaUrlGroup.querySelector('label');
      if (label) {
        if (val === 'spotify') label.textContent = 'Spotify Track / Album URL';
        else if (val === 'image') label.textContent = 'Image URL (e.g. assets/photo.png or web URL)';
        else if (val === 'video') label.textContent = 'YouTube or Video URL';
      }
    }
  });
}

// Handle New Post Submission
if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = postTypeSelect.value;
    const title = document.getElementById('postTitle')?.value || '';
    const content = document.getElementById('postContent')?.value || '';
    const tag = document.getElementById('postTag')?.value || (type.toUpperCase());
    const mediaUrl = mediaUrlInput?.value || '';

    const newPost = {
      id: 'post-' + Date.now(),
      type: type,
      tag: tag,
      title: title,
      content: content,
      caption: content,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date()),
      reactions: { "🔥": 1, "💡": 0 }
    };

    if (type === 'image') newPost.imageUrl = mediaUrl;
    if (type === 'spotify') newPost.spotifyUrl = mediaUrl;
    if (type === 'video') newPost.videoUrl = mediaUrl;
    if (type === 'thought') newPost.author = 'Ranjeet Epili';

    scrapbookPosts.unshift(newPost);
    saveCustomPosts();
    renderPinterestGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
    
    postForm.reset();
    closeOwnerModal();
  });
}

if (ownerTriggerBtn) ownerTriggerBtn.addEventListener('click', promptOwnerUnlock);
if (ownerFab) ownerFab.addEventListener('click', openOwnerModal);
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
  btn.addEventListener('click', closeOwnerModal);
});

// Keyboard Shortcut: Cmd+Shift+A or Ctrl+Shift+A to quick-open Owner Studio
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    promptOwnerUnlock();
  }
});

// ==========================================================================
// 8. Dot Stippling Background Overlay Shader (Behind ID Card)
// ==========================================================================

function initDotStippling() {
  const canvas = document.getElementById('outputCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = "Anonymous";

  // Use the speech podium portrait cutout
  img.src = "assets/speech-portrait.png";
  img.onerror = () => {
    if (!img.src.includes('assets/portrait.jpg')) {
      img.src = "assets/portrait.jpg";
    }
  };

  function renderStipple() {
    if (!img.complete || img.naturalWidth === 0) return;

    // High definition render width for crisp dots
    const renderWidth = 420;
    const renderHeight = Math.round((img.naturalHeight * renderWidth) / img.naturalWidth);
    
    canvas.width = renderWidth;
    canvas.height = renderHeight;

    // 1. Draw image to offscreen canvas to extract raw pixel data
    const offscreen = document.createElement('canvas');
    offscreen.width = renderWidth;
    offscreen.height = renderHeight;
    const offCtx = offscreen.getContext('2d');
    offCtx.drawImage(img, 0, 0, renderWidth, renderHeight);

    const imgData = offCtx.getImageData(0, 0, renderWidth, renderHeight).data;

    // 2. Clear canvas with transparent background so it seamlessly overlays behind ID card
    ctx.clearRect(0, 0, renderWidth, renderHeight);

    // 3. Check theme for dot color (white/silver in dark mode, dark ink in light mode)
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#ffffff' : '#141517';
    const step = 2; // Pixel step size (high dot density)

    for (let y = 0; y < renderHeight; y += step) {
      for (let x = 0; x < renderWidth; x += step) {
        const index = (y * renderWidth + x) * 4;
        const r = imgData[index];
        const g = imgData[index + 1];
        const b = imgData[index + 2];
        const a = imgData[index + 3];

        // Skip transparent background pixels
        if (a < 35) continue;

        // Normalized luminance (0.0 to 1.0)
        let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Calculate probability of dot based on theme & shading
        let factor;
        if (isDark) {
          // In dark theme, brighter areas get more dots, dark areas get subtle dots
          factor = Math.max(0.12, brightness * (a / 255));
        } else {
          // In light theme, darker areas get more dots
          factor = Math.max(0.14, (1 - brightness * 0.85) * (a / 255));
        }

        const probability = Math.pow(factor, 1.25);

        if (Math.random() < probability) {
          const jitterX = x + (Math.random() - 0.5) * 1.5;
          const jitterY = y + (Math.random() - 0.5) * 1.5;
          const dotSize = Math.random() * 1.2 + 0.55;

          ctx.globalAlpha = Math.min(factor * 0.95 + 0.15, 0.95);
          ctx.beginPath();
          ctx.arc(jitterX, jitterY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  img.onload = renderStipple;

  // Re-render when theme changes
  window.addEventListener('themeChanged', renderStipple);
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(renderStipple, 50));
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadScrapbookPosts();
  checkOwnerAuth();
  initDotStippling();
});
loadScrapbookPosts();
checkOwnerAuth();
initDotStippling();






const API = 'http://localhost:5000/api';

// Fallback posts if API is unreachable
const fallbackPosts = [
  { title: '10 Tips for a Healthier Heart', category: 'Wellness', excerpt: 'Simple habits to improve your cardiovascular health and reduce heart disease risk.', author: 'Dr. Sarah Mitchell', readTime: '4 min', createdAt: '2024-01-10' },
  { title: 'Understanding Preventive Screenings', category: 'Preventive Care', excerpt: 'Which screenings you need at each stage of life and why early detection matters.', author: 'Dr. James Okafor', readTime: '6 min', createdAt: '2024-01-08' },
  { title: 'Mental Health & Physical Wellbeing', category: 'Mental Health', excerpt: 'How stress, anxiety and depression affect your body — and what to do about it.', author: 'Dr. Priya Sharma', readTime: '5 min', createdAt: '2024-01-06' },
  { title: 'Building a Balanced Plate', category: 'Nutrition', excerpt: 'Nutrition basics that work: how to eat well without complicated rules.', author: 'Dr. Carlos Rivera', readTime: '5 min', createdAt: '2024-01-04' },
  { title: 'Managing Chronic Pain in 2024', category: 'Wellness', excerpt: 'Modern approaches to pain management beyond medication.', author: 'Dr. Priya Sharma', readTime: '7 min', createdAt: '2024-01-02' },
  { title: 'Why Sleep Is Non-Negotiable', category: 'Wellness', excerpt: 'Chronic sleep deprivation is linked to obesity, diabetes and heart disease.', author: 'Dr. Sarah Mitchell', readTime: '5 min', createdAt: '2023-12-30' }
];

const icons = { Wellness: '💚', Nutrition: '🥗', 'Mental Health': '🧠', 'Preventive Care': '🛡️', General: '📋' };

let allPosts = [];

function renderPosts(posts) {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  if (!posts.length) {
    grid.innerHTML = '<p class="loading-text">No articles found.</p>';
    return;
  }
  grid.innerHTML = posts.map(post => {
    const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const icon = icons[post.category] || '📋';
    return `
      <div class="blog-card fade-in">
        <div class="blog-img">${icon}</div>
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-cat">${post.category}</span>
            <span style="font-size:.78rem;color:var(--muted)">${date}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="blog-foot">
            <span>${post.author}</span>
            <span>⏱ ${post.readTime}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-observe new cards
  document.querySelectorAll('.blog-card.fade-in').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

async function loadBlogPosts() {
  try {
    const res = await fetch(`${API}/blog`, { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    if (data.success && data.data.length > 0) {
      allPosts = data.data;
    } else {
      // Seed then fetch
      await fetch(`${API}/seed`);
      const res2 = await fetch(`${API}/blog`);
      const data2 = await res2.json();
      allPosts = data2.data || fallbackPosts;
    }
  } catch {
    allPosts = fallbackPosts;
  }
  renderPosts(allPosts);
}

// Category filter
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    const filtered = cat === 'All' ? allPosts : allPosts.filter(p => p.category === cat);
    renderPosts(filtered);
  });
});

loadBlogPosts();

document.documentElement.classList.add("js");

// Suporte inteligente a query param ?plano=basico
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("plano") === "basico" && !window.location.pathname.endsWith("basico.html")) {
  window.location.replace("basico.html" + window.location.search);
}

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
});

// =========================================================================
// FORÇAR REDIRECIONAMENTO COM DETECTOR E DESPACHO GARANTIDO DO META PIXEL
// =========================================================================

// 1. Interceptar cliques em botões de upgrade (Lowify)
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href*="lowify"], a[href*="checkout"]');
  if (!link) return;

  let targetUrl = link.getAttribute('href');
  if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('javascript:')) return;

  // Força a interceptação
  e.preventDefault();
  e.stopPropagation();

  // Preservação de UTMs da página atual
  try {
    const currentParams = new URLSearchParams(window.location.search);
    const destUrlObj = new URL(targetUrl, window.location.origin);
    for (const [key, value] of currentParams.entries()) {
      if (!destUrlObj.searchParams.has(key)) {
        destUrlObj.searchParams.set(key, value);
      }
    }
    targetUrl = destUrlObj.href;
  } catch(err) {}

  // Disparo do Pixel
  if (typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', {
      content_name: 'Atlas Visual do Pizzaiolo - Upgrade Completo',
      content_category: 'Upgrade',
      value: 17.90,
      currency: 'BRL',
      num_items: 1
    });
  }

  link.style.opacity = '0.75';
  link.style.pointerEvents = 'none';

  let navigated = false;
  setTimeout(function() {
    if (navigated) return;
    navigated = true;
    window.location.href = targetUrl;
  }, 220);
}, true);

// 2. Interceptar download dos materiais para registrar engajamento no Pixel
document.addEventListener('click', function(e) {
  const downloadLink = e.target.closest('a[href*=".pdf"]');
  if (!downloadLink) return;

  const card = downloadLink.closest('.material-card');
  const title = card ? (card.querySelector('h3')?.innerText || 'Material PDF') : 'Material PDF';

  if (typeof fbq === 'function') {
    fbq('trackCustom', 'DownloadMaterial', {
      material_name: title,
      file_url: downloadLink.getAttribute('href')
    });
  }
}, true);

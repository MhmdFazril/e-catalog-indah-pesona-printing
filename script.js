// Seluruh data bisnis di file ini masih dummy dan sengaja dipusatkan agar mudah diganti.
const WHATSAPP_NUMBER = "6281234567890";
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const mobileMenu = $("#mobile-menu");
$("#menu-toggle").addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("hidden") === false;
  $("#menu-toggle").setAttribute("aria-expanded", open);
});
$$('#mobile-menu a').forEach(link => link.addEventListener('click', () => mobileMenu.classList.add('hidden')));

const orderModal = $("#order-modal");
const orderForm = $("#order-form");
let lastTrigger = null;
function openOrder(product = "") {
  lastTrigger = document.activeElement;
  orderForm.reset();
  $("#order-product").value = product;
  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => $("#order-product").focus(), 50);
}
function closeOrder() {
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastTrigger?.focus();
}
$$('[data-order]').forEach(button => button.addEventListener('click', () => openOrder(button.dataset.order)));
$$('[data-close-order]').forEach(button => button.addEventListener('click', closeOrder));
orderForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const form = new FormData(orderForm);
  const message = `Halo Indah Pesona Digital Printing, saya ingin bertanya/pesan:\nProduk: ${form.get("produk")}\nUkuran/Kebutuhan: ${form.get("kebutuhan") || "Belum ditentukan"}\nJumlah: ${form.get("jumlah")}\nCatatan: ${form.get("catatan") || "-"}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  closeOrder();
});

const lightbox = $("#lightbox");
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastTrigger?.focus();
}
$$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  lastTrigger = button;
  const image = $('img', button);
  $('#lightbox-image').src = image.src;
  $('#lightbox-image').alt = image.alt;
  $('#lightbox-caption').textContent = button.dataset.caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => $('[data-close-lightbox]').focus(), 50);
}));
$$('[data-close-lightbox]').forEach(button => button.addEventListener('click', closeLightbox));

$$('.faq-question').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const open = item.classList.toggle('open');
  button.setAttribute('aria-expanded', open);
}));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { if (orderModal.classList.contains('open')) closeOrder(); if (lightbox.classList.contains('open')) closeLightbox(); }
});

const header = $('#site-header');
addEventListener('scroll', () => header.classList.toggle('shadow-lg', scrollY > 16), { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .12 });
$$('.reveal').forEach(element => observer.observe(element));

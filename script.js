// Data bisnis dummy dipusatkan di sini agar mudah diganti.
const WHATSAPP_NUMBER = "6281234567890";
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const mobileMenu = $("#mobile-menu");
const menuToggle = $("#menu-toggle");
menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("hidden") === false;
  menuToggle.setAttribute("aria-expanded", open);
});
$$('#mobile-menu a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const orderModal = $("#order-modal");
const orderForm = $("#order-form");
const lightbox = $("#lightbox");
let lastTrigger = null;

function openModal(modal, focusTarget) {
  lastTrigger = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => focusTarget?.focus(), 50);
}
function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastTrigger?.focus();
}
function openOrder(product = "") {
  orderForm.reset();
  $("#order-product").value = product;
  openModal(orderModal, $("#order-product"));
}

$$('[data-order]').forEach(button => button.addEventListener('click', () => openOrder(button.dataset.order)));
$$('[data-close-order]').forEach(button => button.addEventListener('click', () => closeModal(orderModal)));
orderForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const form = new FormData(orderForm);
  const message = `Halo Indah Pesona Digital Printing, saya ingin bertanya/pesan:\nProduk: ${form.get("produk")}\nUkuran/Kebutuhan: ${form.get("kebutuhan") || "Belum ditentukan"}\nJumlah: ${form.get("jumlah")}\nCatatan: ${form.get("catatan") || "-"}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  closeModal(orderModal);
});

$$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  const image = $('img', button);
  $('#lightbox-image').src = image.src;
  $('#lightbox-image').alt = image.alt;
  $('#lightbox-caption').textContent = button.dataset.caption;
  openModal(lightbox, $('[data-close-lightbox]'));
}));
$$('[data-close-lightbox]').forEach(button => button.addEventListener('click', () => closeModal(lightbox)));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (orderModal.classList.contains('open')) closeModal(orderModal);
  if (lightbox.classList.contains('open')) closeModal(lightbox);
});

addEventListener('scroll', () => $('#site-header').classList.toggle('shadow-md', scrollY > 12), { passive: true });

const formattedNumber = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 5)}-${WHATSAPP_NUMBER.slice(5, 9)}-${WHATSAPP_NUMBER.slice(9)}`;
$$('[data-whatsapp-display]').forEach(element => element.textContent = formattedNumber);

// Infinite review carousel using native scrolling; no slider dependency.
const reviewCarousel = $('.review-carousel');
const reviewTrack = $('.review-track');
const originalReviews = $$('.review-card', reviewTrack);
originalReviews.forEach(card => {
  const clone = card.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.inert = true;
  reviewTrack.append(clone);
});
const reviewStep = () => originalReviews[0].offsetWidth + 12;
const scrollReviews = direction => reviewCarousel.scrollBy({ left: direction * reviewStep(), behavior: 'smooth' });
reviewCarousel.addEventListener('scroll', () => {
  if (reviewCarousel.scrollLeft >= reviewTrack.scrollWidth / 2) reviewCarousel.scrollLeft -= reviewTrack.scrollWidth / 2;
});

let reviewDragging = false;
let reviewDragX = 0;
let reviewScrollStart = 0;
reviewCarousel.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch') return;
  reviewDragging = true;
  reviewDragX = event.clientX;
  reviewScrollStart = reviewCarousel.scrollLeft;
  reviewCarousel.classList.add('dragging');
  reviewCarousel.setPointerCapture(event.pointerId);
});
reviewCarousel.addEventListener('pointermove', event => {
  if (!reviewDragging) return;
  event.preventDefault();
  reviewCarousel.scrollLeft = reviewScrollStart - (event.clientX - reviewDragX);
});
const stopReviewDrag = event => {
  if (!reviewDragging) return;
  reviewDragging = false;
  reviewCarousel.classList.remove('dragging');
  if (reviewCarousel.hasPointerCapture(event.pointerId)) reviewCarousel.releasePointerCapture(event.pointerId);
};
reviewCarousel.addEventListener('pointerup', stopReviewDrag);
reviewCarousel.addEventListener('pointercancel', stopReviewDrag);

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let reviewTimer = setInterval(() => scrollReviews(1), 4000);
  const pauseReviews = () => clearInterval(reviewTimer);
  const resumeReviews = () => { clearInterval(reviewTimer); reviewTimer = setInterval(() => scrollReviews(1), 4000); };
  reviewCarousel.addEventListener('mouseenter', pauseReviews);
  reviewCarousel.addEventListener('mouseleave', resumeReviews);
  reviewCarousel.addEventListener('focusin', pauseReviews);
  reviewCarousel.addEventListener('focusout', resumeReviews);
}

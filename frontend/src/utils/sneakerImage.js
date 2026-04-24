const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="#f8f9fa"/>
  <path d="M112 358c42 22 83 31 142 31h143c43 0 78-16 95-44 8-13 5-29-7-38-38-27-77-42-122-46l-41-55c-9-12-27-14-39-5l-77 58-51-16c-13-4-28 2-35 14l-29 49c-11 19-3 42 21 52Z" fill="#ffffff" stroke="#1a1a2e" stroke-width="18" stroke-linejoin="round"/>
  <path d="M172 282c33 20 67 30 104 30h137" fill="none" stroke="#e94560" stroke-width="16" stroke-linecap="round"/>
  <path d="M250 243l48 69M293 213l59 91" fill="none" stroke="#1a1a2e" stroke-width="14" stroke-linecap="round"/>
  <path d="M126 374h350" fill="none" stroke="#1a1a2e" stroke-width="18" stroke-linecap="round"/>
  <text x="300" y="456" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#6c757d">Sneaker Image</text>
</svg>`;

export const SNEAKER_PLACEHOLDER =
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(placeholderSvg)}`;

export const getSneakerImage = (images, index = 0) => {
  const image = Array.isArray(images) ? images[index] : images;
  return typeof image === 'string' && image.trim() ? image.trim() : SNEAKER_PLACEHOLDER;
};

export const useSneakerFallback = (event) => {
  if (event.currentTarget.src !== SNEAKER_PLACEHOLDER) {
    event.currentTarget.src = SNEAKER_PLACEHOLDER;
  }
};

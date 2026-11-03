export const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
export const siteUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href;

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Memory Wall',
    short_name: 'Punarnava26',
    description: 'The Official Memory Wall for Punarnava \'26',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDD0',
    theme_color: '#FF9933',
    icons: [
      {
        src: '/icon.png', 
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
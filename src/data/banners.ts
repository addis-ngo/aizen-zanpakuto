export interface BannerImage {
  id: string;
  title: string;
  /**
   * Image URL for banners, background art, or promotional posters.
   * Add any image URLs (JPG, PNG, WebP) you like here!
   */
  url: string;
}

/**
 * List of images and banners that randomly appear in the background
 * of the game selection buttons on mouse hover.
 * You can add, edit, or replace any URLs here!
 */
export const BANNER_IMAGES: BannerImage[] = [
  {
    id: 'rezero',
    title: 'rezero',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQikxMrBb3o-D9swdn2WUApAUvHPOP5n6DyIcsAsOiv6GzxSmqiLwLQvGU&s=10',
  },
  {
    id: 'tobeherox',
    title: 'tobeherox',
    url: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/09/to-be-hero-x-key-visual-cropped.jpg'
  },
  {
    id: 'bleach',
    title: 'bleach',
    url: 'https://cdn.pfps.gg/banners/4561-bleach-anime.png'
    },
  {
    id: 'cote',
    title: 'cote',
    url: 'https://i.redd.it/uy9t98944l3a1.jpg'  
  },
  {
    id: 'oshi',
    title: 'oshi',
    url: 'https://4kwallpapers.com/images/wallpapers/ai-hoshino-oshi-no-3840x1080-16193.jpg'  
  },
  {
    id: 'jjk',
    title: 'jjk',
    url: 'https://i.pinimg.com/736x/e8/19/0c/e8190c467ebfe6f5ce3838f7a9411305.jpg'  
  },
  {
    id: 'qq',
    title: 'qq',
    url: 'https://i.pinimg.com/736x/4d/bb/e0/4dbbe092a1ab7ba167f932ec96ab0bc6.jpg'  
  },
  {
    id: 'sao',
    title: 'sao',
    url: 'https://cdn11.bigcommerce.com/s-k0hjo2yyrq/images/stencil/1280x1280/products/1328/914/Hollow_Fragment_Standard_Edition_Product_Banner__40827.1726065966.jpg?c=1'  
  },
  {
    id: 'blackclover',
    title: 'blackclover',
    url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSzrGl7FTj77jZ4FUX7JFocUYxSXpVLmLLNUvy6MrUQjXa6L5Bwq74huVkySNXGYtGdnBIkbtm_m7DOhiX3faqQy91UqUkmFg3pgRhVG6GPFbBwPzn2RoKTXkhIdq86kuNTlQvK9WldQ/s640/600.png'  
  },
  {
    id: 'mha',
    title: 'mha',
    url: 'https://media.assettype.com/outlook-respawn/2025-12-20/m98w9xuh/my-hero-academia-maker-Toho-to-enter-into-the-European-anime-market.webp'  
  },
];

// Service for finding and optimizing images
export class ImageService {
  private static PEXELS_IMAGES = {
    politics: [
      'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5692251/pexels-photo-5692251.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8828786/pexels-photo-8828786.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6077327/pexels-photo-6077327.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8828787/pexels-photo-8828787.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    world: [
      'https://images.pexels.com/photos/7621047/pexels-photo-7621047.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    economy: [
      'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/259209/pexels-photo-259209.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/259251/pexels-photo-259251.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    security: [
      'https://images.pexels.com/photos/8828788/pexels-photo-8828788.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8828789/pexels-photo-8828789.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8828790/pexels-photo-8828790.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8828791/pexels-photo-8828791.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8828792/pexels-photo-8828792.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    opinion: [
      'https://images.pexels.com/photos/6077328/pexels-photo-6077328.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6077329/pexels-photo-6077329.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6077330/pexels-photo-6077330.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6077331/pexels-photo-6077331.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6077332/pexels-photo-6077332.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    science: [
      'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2280572/pexels-photo-2280572.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2280573/pexels-photo-2280573.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2280574/pexels-photo-2280574.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2280575/pexels-photo-2280575.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    culture: [
      'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ]
  };

  static getRandomImageForCategory(category: string): string {
    const categoryKey = category.toLowerCase() as keyof typeof this.PEXELS_IMAGES;
    const images = this.PEXELS_IMAGES[categoryKey] || this.PEXELS_IMAGES.politics;
    return images[Math.floor(Math.random() * images.length)];
  }

  static getAllImagesForCategory(category: string): string[] {
    const categoryKey = category.toLowerCase() as keyof typeof this.PEXELS_IMAGES;
    return this.PEXELS_IMAGES[categoryKey] || this.PEXELS_IMAGES.politics;
  }

  static generateImageAlt(title: string, category: string): string {
    return `${title} - ${category} news coverage on Federals.live`;
  }
}
import { ScrapedProduct } from './types';

export class QualityFilter {
  private priceRanges = {
    herbs: { min: 5, max: 50 },
    supplements: { min: 10, max: 100 }
  };

  private approvedBrands = [
    'Gaia Herbs',
    'Nature\'s Answer',
    'Traditional Medicinals',
    'Wise Woman Herbals',
    'Pacific Botanicals',
    'HerbEra',
    'NOW Foods',
    'Nature Made',
    'Garden of Life',
    'Jarrow Formulas'
  ];

  private blockedBrands = [
    'Generic Brand',
    'Unknown',
    'Test Brand',
    'Sample Product'
  ];

  private minDescriptionLength = 20;

  validateProduct(product: Partial<ScrapedProduct>): boolean {
    try {
      // Check if required fields exist
      if (!this.hasRequiredFields(product)) {
        return false;
      }

      // Validate price
      if (!this.validatePrice(product.price)) {
        return false;
      }

      // Validate title quality
      if (!this.validateTitle(product.name)) {
        return false;
      }

      // Validate image URL
      if (!this.validateImageUrl(product.imageUrl)) {
        return false;
      }

      // Validate description (if present)
      if (product.description && !this.validateDescription(product.description)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating product:', error);
      return false;
    }
  }

  private hasRequiredFields(product: Partial<ScrapedProduct>): boolean {
    return !!(product.name && product.price && product.imageUrl);
  }

  private validatePrice(price: string): boolean {
    if (!price) return false;
    
    const numericPrice = parseFloat(price.replace(/[^\d.,]/g, ''));
    if (isNaN(numericPrice) || numericPrice <= 0) return false;
    
    // Check if price is within reasonable ranges
    const isHerb = this.isHerbProduct(price);
    const range = isHerb ? this.priceRanges.herbs : this.priceRanges.supplements;
    
    return numericPrice >= range.min && numericPrice <= range.max;
  }

  private validateTitle(title: string): boolean {
    if (!title || title.length < 5) return false;
    
    // Check for obvious spam indicators
    const spamIndicators = [
      'click here',
      'buy now',
      'limited time',
      'act now',
      'free shipping',
      'discount',
      'sale'
    ];
    
    const lowerTitle = title.toLowerCase();
    const hasSpam = spamIndicators.some(indicator => lowerTitle.includes(indicator));
    
    if (hasSpam) return false;
    
    // Check for reasonable title length
    return title.length >= 10 && title.length <= 200;
  }

  private validateImageUrl(imageUrl: string): boolean {
    if (!imageUrl) return false;
    
    // Check for valid image extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidExtension = validExtensions.some(ext => 
      imageUrl.toLowerCase().includes(ext)
    );
    
    if (!hasValidExtension) return false;
    
    // Check for reasonable URL length
    return imageUrl.length >= 10 && imageUrl.length <= 500;
  }

  private validateDescription(description: string): boolean {
    if (!description) return true; // Description is optional
    
    // Check minimum length
    if (description.length < this.minDescriptionLength) return false;
    
    // Check for spam indicators
    const spamIndicators = [
      'click here',
      'buy now',
      'limited time',
      'act now',
      'free shipping',
      'discount',
      'sale',
      'money back guarantee'
    ];
    
    const lowerDesc = description.toLowerCase();
    const hasSpam = spamIndicators.some(indicator => lowerDesc.includes(indicator));
    
    if (hasSpam) return false;
    
    // Check for reasonable description length
    return description.length <= 1000;
  }

  private isHerbProduct(title: string): boolean {
    const herbKeywords = [
      'herb', 'herbal', 'botanical', 'plant', 'leaf', 'root', 'bark',
      'chamomile', 'lavender', 'peppermint', 'ginger', 'turmeric',
      'ashwagandha', 'ginseng', 'echinacea', 'milk thistle', 'st john\'s wort'
    ];
    
    const lowerTitle = title.toLowerCase();
    return herbKeywords.some(keyword => lowerTitle.includes(keyword));
  }

  // Public methods for configuration
  setPriceRanges(herbs: { min: number; max: number }, supplements: { min: number; max: number }): void {
    this.priceRanges.herbs = herbs;
    this.priceRanges.supplements = supplements;
  }

  addApprovedBrand(brand: string): void {
    if (!this.approvedBrands.includes(brand)) {
      this.approvedBrands.push(brand);
    }
  }

  addBlockedBrand(brand: string): void {
    if (!this.blockedBrands.includes(brand)) {
      this.blockedBrands.push(brand);
    }
  }

  setMinDescriptionLength(length: number): void {
    this.minDescriptionLength = length;
  }

  getQualityStats(): any {
    return {
      priceRanges: this.priceRanges,
      approvedBrands: this.approvedBrands,
      blockedBrands: this.blockedBrands,
      minDescriptionLength: this.minDescriptionLength
    };
  }
}

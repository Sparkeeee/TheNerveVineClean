var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { ProductQualityAnalyzer } from '../../../lib/product-quality-specs';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { herbSlug, productType } = yield request.json();
            if (!herbSlug || !productType) {
                return NextResponse.json({ error: 'Herb slug and product type are required' }, { status: 400 });
            }
            const analyzer = new ProductQualityAnalyzer();
            // Mock products for testing
            const mockProducts = [
                {
                    id: '1',
                    name: 'Nature\'s Way St. John\'s Wort Standardized Extract',
                    description: 'Standardized to 0.3% hypericin, 300mg per serving, organic certified',
                    price: 19.99,
                    currency: 'USD',
                    affiliateUrl: 'https://amzn.to/st-johns-wort-1',
                    imageUrl: '/images/st-johns-wort-1.jpg',
                    rating: 4.6,
                    reviewCount: 1247,
                    availability: true,
                    categories: ['supplements', 'herbs'],
                    tags: ['st-johns-wort', 'hypericin', 'standardized', 'extract'],
                    brand: 'Nature\'s Way'
                },
                {
                    id: '2',
                    name: 'Herb Pharm St. John\'s Wort Tincture',
                    description: '1:1 fresh herb tincture with organic grain alcohol, standardized extract',
                    price: 24.99,
                    currency: 'USD',
                    affiliateUrl: 'https://amzn.to/st-johns-wort-2',
                    imageUrl: '/images/st-johns-wort-2.jpg',
                    rating: 4.7,
                    reviewCount: 892,
                    availability: true,
                    categories: ['tinctures', 'herbs'],
                    tags: ['st-johns-wort', 'tincture', '1:1', 'organic alcohol', 'hypericin'],
                    brand: 'Herb Pharm'
                },
                {
                    id: '3',
                    name: 'Generic St. John\'s Wort Supplement',
                    description: 'Dietary supplement blend with various herbs for mood support',
                    price: 9.99,
                    currency: 'USD',
                    affiliateUrl: 'https://amzn.to/st-johns-wort-3',
                    imageUrl: '/images/st-johns-wort-3.jpg',
                    rating: 3.8,
                    reviewCount: 45,
                    availability: true,
                    categories: ['supplements'],
                    tags: ['st-johns-wort', 'dietary supplement', 'proprietary blend'],
                    brand: 'Generic Brand'
                },
                {
                    id: '4',
                    name: 'Premium St. John\'s Wort Extract',
                    description: 'High-potency extract with 0.3% hypericin, organic certified, 500mg capsules',
                    price: 35.99,
                    currency: 'USD',
                    affiliateUrl: 'https://amzn.to/st-johns-wort-4',
                    imageUrl: '/images/st-johns-wort-4.jpg',
                    rating: 4.9,
                    reviewCount: 2156,
                    availability: true,
                    categories: ['supplements', 'herbs'],
                    tags: ['st-johns-wort', 'hypericin', '0.3%', 'organic', 'certified', 'extract'],
                    brand: 'Premium Herbs'
                }
            ];
            // Filter products by quality
            const filteredProducts = analyzer.filterProductsByQuality(mockProducts, herbSlug, productType);
            // Get quality specifications for this herb and product type
            const specs = analyzer.getSpecsForHerb(herbSlug, productType);
            return NextResponse.json({
                success: true,
                herbSlug,
                productType,
                specifications: specs,
                totalProducts: mockProducts.length,
                filteredProducts: filteredProducts.length,
                products: filteredProducts.map(product => (Object.assign(Object.assign({}, product), { qualityScore: product.qualityScore })))
            });
        }
        catch (error) {
            console.error('Error testing quality filter:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchParams } = new URL(request.url);
        const herbSlug = searchParams.get('herb');
        const productType = searchParams.get('type');
        if (!herbSlug || !productType) {
            return NextResponse.json({ error: 'Herb slug and product type are required' }, { status: 400 });
        }
        try {
            const analyzer = new ProductQualityAnalyzer();
            const specs = analyzer.getSpecsForHerb(herbSlug, productType);
            return NextResponse.json({
                success: true,
                herbSlug,
                productType,
                specifications: specs
            });
        }
        catch (error) {
            console.error('Error getting quality specs:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    });
}

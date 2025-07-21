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
import { handleProductUpdate } from '../../../lib/automated-product-updater';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { herbSlug } = yield request.json();
            if (!herbSlug) {
                return NextResponse.json({ error: 'Herb slug is required' }, { status: 400 });
            }
            const result = yield handleProductUpdate(herbSlug);
            if (result.success) {
                return NextResponse.json(result);
            }
            else {
                return NextResponse.json({ error: result.error }, { status: 404 });
            }
        }
        catch (error) {
            console.error('Error updating products:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    });
}
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchParams } = new URL(request.url);
        const herbSlug = searchParams.get('herb');
        if (!herbSlug) {
            return NextResponse.json({ error: 'Herb slug is required' }, { status: 400 });
        }
        try {
            const result = yield handleProductUpdate(herbSlug);
            if (result.success) {
                return NextResponse.json(result);
            }
            else {
                return NextResponse.json({ error: result.error }, { status: 404 });
            }
        }
        catch (error) {
            console.error('Error updating products:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    });
}

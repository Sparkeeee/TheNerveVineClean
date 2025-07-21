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
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        try {
            if (id) {
                const supplement = yield prisma.supplement.findUnique({ where: { id: Number(id) } });
                if (!supplement)
                    return NextResponse.json({ error: 'Not found' }, { status: 404 });
                return NextResponse.json(supplement);
            }
            else {
                const supplements = yield prisma.supplement.findMany();
                return NextResponse.json(supplements);
            }
        }
        catch (error) {
            return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
        }
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield req.json();
            const supplement = yield prisma.supplement.create({ data });
            return NextResponse.json(supplement, { status: 201 });
        }
        catch (error) {
            return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
        }
    });
}
export function PUT(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield req.json();
            if (!data.id)
                return NextResponse.json({ error: 'ID required' }, { status: 400 });
            const supplement = yield prisma.supplement.update({ where: { id: data.id }, data });
            return NextResponse.json(supplement);
        }
        catch (error) {
            return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
        }
    });
}
export function DELETE(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = yield req.json();
            if (!id)
                return NextResponse.json({ error: 'ID required' }, { status: 400 });
            yield prisma.supplement.delete({ where: { id } });
            return NextResponse.json({ success: true });
        }
        catch (error) {
            return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
        }
    });
}

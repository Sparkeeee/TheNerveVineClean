var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
                const herb = yield prisma.herb.findUnique({
                    where: { id: Number(id) },
                });
                if (!herb)
                    return NextResponse.json({ error: 'Not found' }, { status: 404 });
                return NextResponse.json(herb);
            }
            else {
                const herbs = yield prisma.herb.findMany();
                return NextResponse.json(herbs);
            }
        }
        catch (error) {
            return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
        }
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield req.json();
            const { indications } = data, herbData = __rest(data, ["indications"]);
            const herb = yield prisma.herb.create({
                data: Object.assign(Object.assign({}, herbData), { indications: indications && indications.length > 0
                        ? { connect: indications.map((id) => ({ id })) }
                        : undefined }),
            });
            return NextResponse.json(herb, { status: 201 });
        }
        catch (error) {
            return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
        }
    });
}
export function PUT(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield req.json();
            if (!data.id)
                return NextResponse.json({ error: 'ID required' }, { status: 400 });
            const { indications } = data, herbData = __rest(data, ["indications"]);
            const herb = yield prisma.herb.update({
                where: { id: data.id },
                data: Object.assign(Object.assign({}, herbData), { indications: indications
                        ? {
                            set: indications.map((id) => ({ id })),
                        }
                        : undefined }),
            });
            return NextResponse.json(herb);
        }
        catch (error) {
            return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
        }
    });
}
export function DELETE(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = yield req.json();
            if (!id)
                return NextResponse.json({ error: 'ID required' }, { status: 400 });
            yield prisma.herb.delete({ where: { id } });
            return NextResponse.json({ success: true });
        }
        catch (error) {
            return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
        }
    });
}

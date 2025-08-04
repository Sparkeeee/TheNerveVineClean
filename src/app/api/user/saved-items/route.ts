import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("User saved slugs:", { 
      savedHerbs: user.savedHerbs, 
      savedSupplements: user.savedSupplements,
      savedArticles: user.savedArticles
    });

    // Fetch full details for saved herbs
    const savedHerbs = await prisma.herb.findMany({
      where: {
        slug: { in: user.savedHerbs },
      },
      select: {
        slug: true,
        name: true,
        description: true,
      },
    });

    console.log("Found saved herbs:", savedHerbs);

    // Fetch full details for saved supplements
    const savedSupplements = await prisma.supplement.findMany({
      where: {
        slug: { in: user.savedSupplements },
      },
      select: {
        slug: true,
        name: true,
        description: true,
      },
    });

    console.log("Found saved supplements:", savedSupplements);

    // Fetch full details for saved articles (comprehensive info documents)
    const savedArticles = await prisma.herb.findMany({
      where: {
        slug: { in: user.savedArticles },
      },
      select: {
        slug: true,
        name: true,
        description: true,
      },
    });

    console.log("Found saved articles:", savedArticles);

    return NextResponse.json({
      herbs: savedHerbs,
      supplements: savedSupplements,
      articles: savedArticles,
    });
  } catch (error) {
    console.error("Fetch saved items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
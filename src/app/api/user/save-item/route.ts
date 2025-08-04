import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { type, slug } = await request.json();

    console.log("Save item request:", { type, slug, userId: session.user.id, userRole: session.user.role });

    if (!type || !slug) {
      return NextResponse.json(
        { error: "Type and slug are required" },
        { status: 400 }
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

    let updatedUser;
    
    console.log("Current user saved items:", { 
      savedHerbs: user.savedHerbs, 
      savedSupplements: user.savedSupplements,
      savedArticles: user.savedArticles
    });
    
    if (type === "herb") {
      // Add herb to saved herbs if not already saved
      if (!user.savedHerbs.includes(slug)) {
        console.log("Adding herb to saved herbs:", slug);
        updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            savedHerbs: [...user.savedHerbs, slug],
          },
        });
        console.log("Updated user saved herbs:", updatedUser.savedHerbs);
      } else {
        console.log("Herb already saved:", slug);
      }
    } else if (type === "supplement") {
      // Add supplement to saved supplements if not already saved
      if (!user.savedSupplements.includes(slug)) {
        console.log("Adding supplement to saved supplements:", slug);
        updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            savedSupplements: [...user.savedSupplements, slug],
          },
        });
        console.log("Updated user saved supplements:", updatedUser.savedSupplements);
      } else {
        console.log("Supplement already saved:", slug);
      }
    } else if (type === "article") {
      // Add article to saved articles if not already saved
      if (!user.savedArticles.includes(slug)) {
        console.log("Adding article to saved articles:", slug);
        updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            savedArticles: [...user.savedArticles, slug],
          },
        });
        console.log("Updated user saved articles:", updatedUser.savedArticles);
      } else {
        console.log("Article already saved:", slug);
      }
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'herb', 'supplement', or 'article'" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Item saved successfully",
        savedHerbs: updatedUser?.savedHerbs || user.savedHerbs,
        savedSupplements: updatedUser?.savedSupplements || user.savedSupplements,
        savedArticles: updatedUser?.savedArticles || user.savedArticles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Save item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { type, slug } = await request.json();

    if (!type || !slug) {
      return NextResponse.json(
        { error: "Type and slug are required" },
        { status: 400 }
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

    let updatedUser;
    
    if (type === "herb") {
      // Remove herb from saved herbs
      updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          savedHerbs: user.savedHerbs.filter((herb) => herb !== slug),
        },
      });
    } else if (type === "supplement") {
      // Remove supplement from saved supplements
      updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          savedSupplements: user.savedSupplements.filter((supp) => supp !== slug),
        },
      });
    } else if (type === "article") {
      // Remove article from saved articles
      updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          savedArticles: user.savedArticles.filter((article) => article !== slug),
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'herb', 'supplement', or 'article'" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Item removed successfully",
        savedHerbs: updatedUser.savedHerbs,
        savedSupplements: updatedUser.savedSupplements,
        savedArticles: updatedUser.savedArticles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
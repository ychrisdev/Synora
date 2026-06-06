import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);

  const rawQ = (searchParams.get("q") ?? "").trim();
  const isHashtag = rawQ.startsWith("#");
  const q = isHashtag ? rawQ.slice(1) : rawQ;
  const tab = searchParams.get("tab") ?? "all";
  const sort = searchParams.get("sort") ?? "relevant";
  const countOnly = searchParams.get("countOnly") === "1";
  const strictTag = searchParams.get("strictTag") === "1";

  if (!q)
    return NextResponse.json({
      posts: [],
      documents: [],
      people: [],
      groups: [],
      topics: [],
    });

  const postOrderBy =
    sort === "newest"
      ? [{ createdAt: "desc" as const }]
      : sort === "popular"
        ? [{ likeCount: "desc" as const }, { commentCount: "desc" as const }]
        : [
            { likeCount: "desc" as const },
            { commentCount: "desc" as const },
            { createdAt: "desc" as const },
          ];

  const docOrderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : { downloadCount: "desc" as const };

  const postWhere = strictTag
    ? {
        visibility: "PUBLIC" as const,
        tags: {
          some: {
            tag: { name: { equals: q, mode: "insensitive" as const } },
          },
        },
      }
    : isHashtag
      ? {
          visibility: "PUBLIC" as const,
          OR: [
            {
              tags: {
                some: {
                  tag: { name: { equals: q, mode: "insensitive" as const } },
                },
              },
            },
            { content: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {
          visibility: "PUBLIC" as const,
          OR: [
            { content: { contains: q, mode: "insensitive" as const } },
            {
              tags: {
                some: {
                  tag: { name: { contains: q, mode: "insensitive" as const } },
                },
              },
            },
          ],
        };

  if (countOnly) {
    const [postCount, docCount, peopleCount, groupCount, topicCount] =
      await Promise.all([
        prisma.post.count({ where: postWhere }),
        !isHashtag
          ? prisma.document.count({
              where: {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
              },
            })
          : Promise.resolve(0),
        !isHashtag
          ? prisma.user.count({
              where: {
                OR: [
                  { username: { contains: q, mode: "insensitive" } },
                  {
                    profile: {
                      displayName: { contains: q, mode: "insensitive" },
                    },
                  },
                ],
              },
            })
          : Promise.resolve(0),
        !isHashtag
          ? prisma.community.count({
              where: {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
              },
            })
          : Promise.resolve(0),
        prisma.tag.count({
          where: {
            name: { contains: q, mode: "insensitive" },
            posts: { some: {} },
          },
        }),
      ]);
    return NextResponse.json({
      posts: postCount,
      documents: docCount,
      people: peopleCount,
      groups: groupCount,
      topics: topicCount,
    });
  }

  const [posts, documents, people, groups, topics] = await Promise.all([
    tab === "all" || tab === "posts"
      ? prisma.post.findMany({
          where: postWhere,
          take: tab === "all" ? 6 : 20,
          orderBy: postOrderBy,
          include: {
            author: { include: { profile: true } },
            tags: { include: { tag: true } },
            documents: true,
            _count: { select: { likes: true, comments: true } },
            likes: session?.user?.id
              ? { where: { userId: session.user.id }, select: { id: true } }
              : false,
          },
        })
      : [],

    !isHashtag && (tab === "all" || tab === "documents")
      ? prisma.document.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          take: tab === "all" ? 3 : 20,
          orderBy: docOrderBy,
          include: { uploader: { include: { profile: true } } },
        })
      : [],

    !isHashtag && (tab === "all" || tab === "people")
      ? prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              {
                profile: {
                  displayName: { contains: q, mode: "insensitive" },
                },
              },
            ],
          },
          take: tab === "all" ? 3 : 20,
          include: {
            profile: true,
            _count: { select: { followers: true, documents: true } },
          },
        })
      : [],

    !isHashtag && (tab === "all" || tab === "groups")
      ? prisma.community.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          take: tab === "all" ? 3 : 20,
          include: { _count: { select: { members: true } } },
        })
      : [],

    tab === "all" || tab === "topics"
      ? prisma.tag.findMany({
          where: {
            name: { contains: q, mode: "insensitive" },
            posts: { some: {} },
          },
          take: tab === "all" ? 5 : 20,
          include: { _count: { select: { posts: true } } },
          orderBy: { posts: { _count: "desc" } },
        })
      : [],
  ]);

  return NextResponse.json({ posts, documents, people, groups, topics });
}
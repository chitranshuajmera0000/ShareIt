import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify } from "hono/jwt";
import { createBlogInput, createCommentInput, updateBlogInput, updateCommentInput } from "@beginnerdev/common";
// import axios from "axios";
import { useState } from "hono/jsx";



export interface Name {
    userId: number;
    name: string;
    profileUrl: string;
}



export const blogRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string
            JWT_SECRET: string
        },
        Variables: {
            userID: number
        }
    }
>()


export const auth = blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("Authorization") || ""
    const token = authHeader.split(" ")[1]
    console.log(token)

    try {
        const user = await verify(token, c.env.JWT_SECRET)
        if (user && typeof user.id === "number") {
            console.log("inside if ")
            const id = decode(token).header
            c.set("userID", user.id)
            await next();
        }
        else {
            console.log("in else")
            c.status(403)
            return c.json({
                message: "You are not authorized !!"
            })
        }
        // console.log("leaved auth")
    } catch (e) {
        c.status(403)
        return c.json({
            message: "Invalid token or authorization error !!"
        })
    }

})

blogRouter.put('/dislike', async (c) => {
    const body = await c.req.json()

    const userId = c.get("userID")
    console.log(userId, body.id)
    const blogId = body.id

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const existingInteraction = await prisma.blogInteraction.findUnique({
            where: {
                userId_blogId: {
                    userId: userId,
                    blogId: body.id
                }
            }
        })

        const newIsLike = existingInteraction?.isLiked === false ? null : false;

        console.log(newIsLike)


        if (existingInteraction) {
            await prisma.blogInteraction.update({
                where: { userId_blogId: { userId, blogId } },
                data: { isLiked: newIsLike }, // Use { set: } to allow null
            });
            console.log('Update executed with isLike:', newIsLike);
        } else {
            await prisma.blogInteraction.create({
                data: {
                    userId,
                    blogId,
                    isLiked: true, // New interaction starts as true
                },
            });
            console.log('Created new interaction with isLike: true');
        }
        c.status(200)
        return c.json({ message: "updated successfully", isLiked: newIsLike })
    } catch (e) {
        c.status(404)
        return c.json({ Error: "Error occurred while updating !!" })
    }

})

blogRouter.put('/like', async (c) => {

    const body = await c.req.json();
    console.log(body.id)



    const userId = c.get("userID");
    // console.log(blogId, userId) ///yaha pe bas body me lelo blog id and then try

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const existingInteraction = await prisma.blogInteraction.findUnique({
            where: {
                userId_blogId: {
                    userId,
                    blogId: +body.id
                }
            }
        })

        const newIsLike = existingInteraction?.isLiked === true ? null : true;

        await prisma.blogInteraction.upsert({
            where: {
                userId_blogId: {
                    userId: userId,
                    blogId: +body.id
                }
            },
            update: {
                isLiked: newIsLike // or false for dislike
            },
            create: {
                userId: userId,
                blogId: body.id,
                isLiked: true // or false for dislike
            }
        });
        c.status(200)
        return c.json({ message: "updated successfully", isLiked: newIsLike })
    } catch (e) {
        c.status(404)
        return c.json({ Error: "Error occurred while updating !!" })
    }

})



blogRouter.put('/comment/dislike', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userID");
    const commentId = +body.id;

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const existingInteraction = await prisma.commentInteraction.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });

        const newIsLiked = existingInteraction?.isLiked === false ? null : false;

        const updatedComment = await prisma.$transaction([
            prisma.commentInteraction.upsert({
                where: {
                    userId_commentId: {
                        userId,
                        commentId,
                    },
                },
                update: {
                    isLiked: newIsLiked,
                },
                create: {
                    userId,
                    commentId,
                    isLiked: false, // Fixed: Dislike should set isLiked to false
                },
            }),
            prisma.comment.update({
                where: { id: commentId },
                data: {
                    totalCommentLikes: {
                        increment: existingInteraction?.isLiked === true ? -1 : 0,
                    },
                    totalCommentDislikes: {
                        increment: newIsLiked === false ? 1 : existingInteraction?.isLiked === false ? -1 : 0,
                    },
                },
            }),
        ]);

        const updatedTotals = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                totalCommentLikes: true,
                totalCommentDislikes: true,
            },
        });

        c.status(200);
        return c.json({
            message: "Updated successfully",
            isLiked: newIsLiked, // Match schema and frontend expectation
            totalCommentLikes: updatedTotals?.totalCommentLikes,
            totalCommentDislikes: updatedTotals?.totalCommentDislikes,
        });
    } catch (e) {
        c.status(404);
        return c.json({ Error: "Error occurred while updating !!" });
    }
});
blogRouter.put('/comment/like', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userID");
    const commentId = +body.id;

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const existingInteraction = await prisma.commentInteraction.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId: +body.id,
                },
            },
        });

        const newIsLiked = existingInteraction?.isLiked === true ? null : true;

        const updatedComment = await prisma.$transaction([
            prisma.commentInteraction.upsert({
                where: {
                    userId_commentId: {
                        userId,
                        commentId: +body.id,
                    },
                },
                update: {
                    isLiked: newIsLiked,
                },
                create: {
                    userId,
                    commentId: +body.id,
                    isLiked: true,
                },
            }),
            prisma.comment.update({
                where: { id: commentId },
                data: {
                    totalCommentLikes: {
                        increment: newIsLiked === true ? 1 : existingInteraction?.isLiked === true ? -1 : 0,
                    },
                    totalCommentDislikes: {
                        increment: existingInteraction?.isLiked === false ? -1 : 0,
                    },
                },
            }),
        ]);

        const updatedTotals = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                totalCommentLikes: true,
                totalCommentDislikes: true,
            },
        });

        c.status(200);
        return c.json({
            message: "Updated successfully",
            isLiked: newIsLiked, // Match schema and frontend expectation
            totalCommentLikes: updatedTotals?.totalCommentLikes,
            totalCommentDislikes: updatedTotals?.totalCommentDislikes,
        });
    } catch (e) {
        c.status(404);
        return c.json({ Error: "Error occurred while updating !!" });
    }
});

blogRouter.put('/comment/:id', async (c) => {
    const Id = c.req.param("id");
    const body = await c.req.json();
    const { success } = updateCommentInput.safeParse(body);
    console.log(Id);
    if (!success) {
        c.status(411)
        return c.json({
            message: "Incorrect Inputs"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userID = c.get("userID")
    const editComment = await prisma.comment.update({
        where: {
            id: Number(Id),
            userId: userID
        },
        data: {
            content: body.editComment
        }

    })
    const comment = await prisma.comment.findUnique({
        where: {
            id: Number(Id),
            userId: userID
        }

    })
    c.status(200);
    return c.json({ comment })
})




blogRouter.post('/blog', async (c) => {

    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411)
        return c.json({
            message: "Incorrect Inputs"
        })
    }
    const userID = c.get("userID");
    console.log("passed verification")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            // author: body.author,
            subtitle: body.subtitle,
            authorId: userID,
            published: true,
            thumbnailUrl: body.thumbnailUrl
        }
    })

    return c.json({ id: blog.id })
})

blogRouter.put('/:id', async (c) => {
    const Id = c.req.param("id");
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    console.log(Id);
    if (!success) {
        c.status(411)
        return c.json({
            message: "Incorrect Inputs"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userID = c.get("userID")
    const blog = await prisma.blog.update({
        where: {
            id: Number(Id),
            authorId: userID
        },
        data: {
            title: body.title,
            subtitle: body.subtitle,
            thumbnailUrl: body.thumbnailUrl,
            content: body.content
        }

    })

    return c.json({ id: blog.id })
})


blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.blog.findMany({
            orderBy: { time: 'desc' },
            select: {
                author: {
                    select: {
                        details: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                time: true,
                title: true,
                subtitle: true,
                content: true,
                thumbnailUrl: true,
                id: true,
            },

        })
        // const totalBlogs = await prisma.blog.count();
        // const totalPages = Math.ceil(totalBlogs / limit);

        c.status(200)
        return c.json({ blog })
    } catch (e) {
        c.status(404)
        return c.json({ Error: "Blogs cannot be fetched due to some error !!!" })
    }

})



blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const userId = c.get("userID");
    // const [comms , setComms] = useState<Name[]>([])
    let comms: Name[] = [];

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const data = await prisma.blog.findFirst({
            select: {
                author: {
                    select: {
                        details: {
                            select: {
                                name: true,
                                location: true,
                                profession: true,
                                userId: true,
                                profileUrl: true,
                                company: true
                            }
                        }
                    }
                },
                id: true,
                time: true,
                title: true,
                subtitle: true,
                thumbnailUrl: true,
                content: true,
                authorId: true,
                blogInteractions: {
                    select: {
                        isLiked: true,
                        id: true,
                    },
                    where: {
                        userId,
                        blogId: +id

                    }

                },
                comments: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        userId: true,
                        id: true,
                        parentId: true,
                        user: {
                            select: {
                                details: {
                                    select: {
                                        profileUrl: true,
                                        name: true
                                    }
                                }
                            }
                        },
                        content: true,
                        createdAt: true,
                        totalCommentDislikes: true,
                        totalCommentLikes: true,
                        interactions: {
                            select: {
                                isLiked: true
                            },
                            where: { userId }
                        },
                        replies: {
                            select: {
                                id: true,
                                userId: true,
                                content: true,
                                parentId: true,
                                createdAt: true,
                                totalCommentLikes: true,
                                totalCommentDislikes: true,
                                user: {
                                    select: {
                                        details: {
                                            select: {
                                                profileUrl: true,
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    },
                    where: {
                        blogId: +id
                    }
                }
            },

            where: {
                id: Number(id)
            }
        })


        if (!data) {
            return c.json({ error: "Blog not found" }, 404);
        }
        const blog = {
            ...data,
            blogInteraction: data.blogInteractions[0] || null, // Take first interaction or null
        };
        console.log(blog)
        const totalBlogLikes = await prisma.blogInteraction.count({
            where: {
                isLiked: true,
                blogId: Number(id)
            }
        })
        const totalBlogDislikes = await prisma.blogInteraction.count({
            where: {
                isLiked: false,
                blogId: Number(id)
            },

        })

        return c.json({ blog, totalBlogLikes, totalBlogDislikes, userId })
    } catch (e) {
        c.status(404)
        return c.json({ Error: "Blog Cannot Be Found !!" })
    }
}
)

blogRouter.delete('/:id', async (c) => {
    const id = Number(c.req.param("id")); // Convert id to number
    const userId = c.get("userID"); // User making the request

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Fetch the blog first to check ownership
        const blog = await prisma.blog.findUnique({
            where: { id },
            select: { authorId: true },
        });

        if (!blog) {
            c.status(404);
            return c.json({ error: "Blog not found!" });
        }

        // Ensure the current user is the author of the blog
        if (blog.authorId !== userId) {
            c.status(403);
            return c.json({ error: "You are not authorized to delete this blog!" });
        }

        // Perform deletion inside a transaction to maintain consistency
        await prisma.$transaction([
            prisma.blogInteraction.deleteMany({ where: { blogId: id } }),
            prisma.commentInteraction.deleteMany({
                where: {
                    comment: { blogId: id },
                },
            }),
            prisma.comment.deleteMany({ where: { blogId: id } }),
            prisma.blog.delete({ where: { id } }),
        ]);

        c.status(200);
        return c.json({ message: "Blog deleted successfully" });

    } catch (e) {
        console.error("Error deleting blog:", e);
        c.status(500);
        return c.json({ error: "An error occurred while deleting the blog!" });
    } finally {
        await prisma.$disconnect();
    }
});

blogRouter.delete('/comment/:id', async (c) => {
    const id = Number(c.req.param("id")); // Convert id to number
    const userId = c.get("userID"); // User making the request

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Fetch the comment first to check ownership
        const comment = await prisma.comment.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!comment) {
            c.status(404);
            return c.json({ error: "Reply not found!" });
        }

        // Ensure the current user is the author of the blog
        if (comment.userId !== userId) {
            c.status(403);
            return c.json({ error: "You are not authorized to delete this reply!" });
        }

        // Perform deletion inside a transaction to maintain consistency
        await prisma.$transaction([
            prisma.commentInteraction.deleteMany({
                where: {
                    comment: { id },
                },
            }),
            prisma.comment.deleteMany({
                where:{
                    parentId:id
                }
            }),
            prisma.comment.delete({ where: { id, userId } }),
        ]);

        c.status(200);
        return c.json({ message: "Comment deleted successfully", comment });

    } catch (e) {
        console.error("Error deleting blog:", e);
        c.status(500);
        return c.json({ error: "An error occurred while deleting the comment!" });
    } finally {
        await prisma.$disconnect();
    }
});

blogRouter.post('/comment/:id', async (c) => {
    const id = c.req.param("id");

    const body = await c.req.json();
    const { success } = createCommentInput.safeParse(body);
    if (!success) {
        c.status(411)
        return c.json({
            message: "Incorrect Inputs"
        })
    }
    const userId = c.get("userID")

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const comment = await prisma.comment.create(
            {
                data: {
                    userId,
                    content: body.content,
                    blogId: +id,

                }

            }
        )
        const newCommentId = comment.id;
        const newComment = await prisma.comment.findUnique({
            select: {
                userId: true,
                id: true,
                user: {
                    select: {
                        details: {
                            select: {
                                profileUrl: true,
                                name: true
                            }
                        }
                    }
                },
                content: true,
                createdAt: true,
                totalCommentDislikes: true,
                totalCommentLikes: true,
                interactions: {
                    select: {
                        isLiked: true
                    },
                    where: { userId }
                },
                parentId: true,
                replies: {
                    select: {
                        id: true,
                        userId: true,
                        content: true,
                        createdAt: true,
                        totalCommentLikes: true,
                        totalCommentDislikes: true,

                        user: {
                            select: {
                                details: {
                                    select: {
                                        profileUrl: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
            , where: {
                id: newCommentId
            }
        })
        console.log(newComment)
        c.status(200);
        return c.json({ message: "Comment Added Successfully ", newComment });
    } catch (e) {
        c.status(400);
        return c.json({ Error: 'Error Adding The Comment !!!' })
    }
})



blogRouter.post('/comment/:id/reply', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userID");
    const blogId = +c.req.param("id");
    const parentId = await body.parentId ? +body.parentId : null;

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const comment = await prisma.comment.create({
            data: {
                content: body.content,
                userId,
                blogId,
                parentId
            },
        });
        console.log("Comment from reply : ", comment)
        const newCommentId = comment.id;
        const newComment = await prisma.comment.findUnique({
            select: {
                userId: true,
                id: true,
                user: {
                    select: {
                        details: {
                            select: {
                                profileUrl: true,
                                name: true
                            }
                        }
                    }
                },
                content: true,
                createdAt: true,
                totalCommentDislikes: true,
                totalCommentLikes: true,
                interactions: {
                    select: {
                        isLiked: true
                    },
                    where: { userId }
                },
                parentId: true,
                replies: {
                    select: {
                        id: true,
                        userId: true,
                        content: true,
                        createdAt: true,
                        totalCommentLikes: true,
                        totalCommentDislikes: true,

                        user: {
                            select: {
                                details: {
                                    select: {
                                        profileUrl: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
            , where: {
                id: newCommentId
            }
        })
        console.log("Comment from reply : ", newComment)

        c.status(200);
        return c.json({ message: "Reply Posted Successfully", newComment })
    } catch (e) {
        c.status(400)
        return c.json({ Error: "Failed to Post Reply" });
    }
})
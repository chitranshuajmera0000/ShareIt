import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from '@prisma/client/edge'
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { Bindings } from "hono/types";
import { signupInput, signinInput, userDetails, updateAboutInput, updateInfoInput, authorInfoInput } from "@beginnerdev/common";
import { auth } from "./blog";
export const userRouter = new Hono<
  {
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    },
    Variables: {
      userID: number
    }
  }
>();

userRouter.post('/signup', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({
      message: "Incorrect Inputs"
    })
  }
  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
      }
    })
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({
      jwt: token
    })
  } catch (e) {
    c.status(411);
    return c.json({ Error: 'User Already Exists' })
  }
})



userRouter.post('/signin', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body)
    if (!success) {
      c.status(411)
      return c.json({
        message: "Incorrect Inputs"
      })
    }
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
        password: body.password,
      }
    });

    if (!user) {
      c.status(403);
      return c.json({ Error: "User Not Found !!" })
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt: token })
  } catch (e) {
    c.status(403)
    return c.json({ Error: "Invalid Credentials" })
  }
})

userRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || ""
  const token = authHeader.split(" ")[1]

  try {
    const user = await verify(token, c.env.JWT_SECRET)
    if (user && typeof user.id === "number") {
      // id : decode(token).header
      c.set("userID", user.id)
      console.log(user);
      await next();
    }
    else {
      c.status(403)
      return c.json({
        message: "You are not authorized !!"
      })
    }
  } catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token or authorization error !!"
    })
  }

})

userRouter.get('/', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  c.status(200)
  return c.json({ message: "User Is Verified " })
})


userRouter.get('/info', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const id = c.get("userID")
  try {
    const person = await prisma.user.findUnique({

      select: {
        details: {
          select: {
            name: true
          }
        },
        posts: {
          orderBy: { time: 'desc' },
          select: {
            id: true,
            title: true,
            subtitle: true,
            content: true,
            thumbnailUrl: true,
            time: true,
            published: true,
            authorId: true
          }
        }
      },

      where: {
        id: id
      }
    });

    return c.json({
      person
    })

  } catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token or authorization error !!"
    })
  }
})



userRouter.get('/myblogs', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const page = Number(c.req.query('page'));
  const limit = Number(c.req.query('limit'));
  const skip = (page - 1) * limit;
  const id = c.get("userID");
  const filter = c.req.query('filter') || '';

  try {
    // Create a filter condition if there is a filter parameter
    const filterCondition = filter
      ? {
        OR: [
          { title: { contains: filter } },
          { content: { contains: filter } },
          { subtitle: { contains: filter } }
        ]
      }
      : {};

    // Combine the filter with the author condition
    const whereCondition = {
      authorId: id,
      ...(filter ? filterCondition : {})
    };

    // Fetch filtered posts with pagination
    const person = await prisma.user.findUnique({
      select: {
        details: {
          select: {
            name: true
          }
        },
        posts: {
          where: filterCondition, // Apply filter to posts
          orderBy: { time: 'desc' },
          skip: skip,
          take: limit,
          select: {
            id: true,
            title: true,
            subtitle: true,
            content: true,
            thumbnailUrl: true,
            time: true,
            published: true,
            authorId: true
          },
        }
      },
      where: {
        id: id
      }
    });

    // Count total filtered blogs for pagination
    const totalBlogs = await prisma.blog.count({
      where: whereCondition
    });

    const totalPages = Math.ceil(totalBlogs / limit);

    return c.json({
      person,
      totalPages
    });
  } catch (e) {
    console.error(e);
    c.status(403);
    return c.json({
      message: "Invalid token or authorization error !!"
    });
  }
});



userRouter.get('/info/name', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const authHeader = c.req.header("Authorization") || ""
  const token = authHeader.split(" ")[1]
  console.log(token);
  try {
    const user = await verify(token, c.env.JWT_SECRET)
    if (user && typeof user.id === "number") {
      // id : decode(token).header
      // c.set("userID", user.id)
      console.log(user.id);
      const person = await prisma.details.findUnique({
        select: {
          name: true,
          userId: true,
          profileUrl: true
        },
        where: {
          userId: user.id
        }
      });
      console.log(person);
      return c.json({
        person
      })

    }
    else {
      c.status(403)
      return c.json({
        message: "You are not authorized !!"
      })
    }
  } catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token or authorization error !!"
    })
  }
})



userRouter.get('/comment/name', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  const authHeader = c.req.header("Authorization") || ""
  const token = authHeader.split(" ")[1]
  console.log(token);
  try {
    const user = await verify(token, c.env.JWT_SECRET)
    if (user && typeof user.id === "number") {
      // id : decode(token).header
      // c.set("userID", user.id)
      console.log(user.id);
      const person = await prisma.details.findUnique({
        select: {
          name: true,
          userId: true,
          profileUrl: true
        },
        where: {
          userId: body.id
        }
      });
      console.log(person);
      return c.json({
        person
      })

    }
    else {
      c.status(403)
      return c.json({
        message: "You are not authorized !!"
      })
    }
  } catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token or authorization error !!"
    })
  }
})



userRouter.post('/details', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const userId = c.get("userID");
  const body = await c.req.json();
  const { success } = userDetails.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({
      message: "Incorrect Inputs"
    })
  }
  try {
    const user = await prisma.details.create({
      data: {
        userId,
        name: body.name,
        profession: body.profession,
        about: body.about,
        profileUrl: body.profileUrl,
        location: body.location,
        company: body.company,
        instagram: body.instagram,
        linkedin: body.linkedin,
        x: body.x

      }
    })
    c.status(200)
    return c.json({
      message: 'Data added successfully :-) '
    })
  } catch (e) {
    c.status(411);
    return c.json({ Error: 'User Already Exists' })
  }
})


userRouter.get('/details', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const id = c.get("userID")
    const person = await prisma.details.findUnique({
      select: {
        name: true,
        userId: true,
        about: true,
        profession: true,
        location: true,
        profileUrl: true,
        company: true,
        instagram: true,
        x: true,
        linkedin: true
      },
      where: {
        userId: id
      }
    });
    return c.json({
      person
    })
  } catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token or authorization error !!"
    })
  }
})





userRouter.put('/details/about', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const body = await c.req.json();
    const { success } = updateAboutInput.safeParse(body);
    console.log(success);
    if (!success) {
      c.status(411)
      return c.json({
        message: "Incorrect Inputs"
      })
    }
    const id = c.get("userID")
    const person = await prisma.details.update({
      data: {
        about: body.about
      },
      where: {
        userId: id
      }
    });
    c.status(200)
    return c.json({
      message: "Updated Successfully :-)"
    })

  }
  catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token !!"
    })
  }
})




userRouter.put('/details/info', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const body = await c.req.json();
    const { success } = updateInfoInput.safeParse(body);
    console.log(success);
    if (!success) {
      c.status(411)
      return c.json({
        message: "Incorrect Inputs"
      })
    }
    const id = c.get("userID")
    const person = await prisma.details.update({
      data: {
        name: body.name,
        profession: body.profession,
        location: body.location,
        profileUrl: body.profileUrl,
        company: body.company,
        linkedin: body.linkedin,
        x: body.x,
        instagram: body.instagram
      },
      where: {
        userId: id
      }
    });
    c.status(200)
    return c.json({
      message: "Updated Successfully :-)"
    })

  }
  catch (e) {
    c.status(403)
    return c.json({
      message: "Invalid token !!"
    })
  }
})




userRouter.get('/author', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const id = Number(c.req.query('id'));
    // if (!success) {
    //   c.status(411)
    //   return c.json({
    //     message: "Incorrect Inputs"
    //   })
    // }
    const person = await prisma.user.findUnique({
      select: {
        details: {
          select: {
            name: true,
            location: true,
            profession: true,
            profileUrl: true,
            about: true,
            company: true,
            instagram: true,
            linkedin: true,
            x: true
          }
        },
        posts: {
          orderBy: { time: "desc" },
          select: {
            id: true,
            title: true,
            subtitle: true,
            content: true,
            thumbnailUrl: true,
            time: true,
            published: true,
            authorId: true
          }
        }
      },
      where: {
        id: id
      }
    });
    return c.json({
      person
    })

  } catch (e) {
    c.status(403)
    return c.json({
      message: "Error in fetching data or authorization error !!"
    })
  }
})
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from '@prisma/client/edge'
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { Bindings } from "hono/types";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { signupInput, signinInput, userDetails, updateAboutInput, updateInfoInput, authorInfoInput } from "@beginnerdev/common";
import { auth } from "./blog";


export const userRouter = new Hono<
  {
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
      RESEND_API_KEY: string;
      EMAILJS_SERVICE_ID: string;
      EMAILJS_TEMPLATE_ID: string;
      EMAILJS_PRIVATE_KEY: string;
      EMAILJS_PUBLIC_KEY: string;
    },
    Variables: {
      userID: number
    }
  }
>();



userRouter.post('/auth/signup/otp/generate', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log(body)
  const { username } = await c.req.json();
  console.log(username)

  if (!username) {
    return c.json({ error: 'Email is required' }, 400);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { username } });
  if (user) {
    return c.json({ error: 'User already Exists' }, 404);
  } else {
    const user1 = await prisma.user.create({
      data: {
        username: body.username,
        password: "hashedPassword"
      }
    });

  }

  // Generate OTP (6-digit code)
  let otp = '';
  const digits = '0123456789';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  } const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

  // Save OTP to the user record
  await prisma.user.update({
    where: { username },
    data: { otpCode: otp, otpExpiresAt: expiresAt },
  });

  // Send OTP via email (using Resend)
  const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: c.env.EMAILJS_SERVICE_ID,
      template_id: c.env.EMAILJS_TEMPLATE_ID,
      accessToken: c.env.EMAILJS_PRIVATE_KEY, // Use the private key here
      user_id: c.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        email: username, // match the template param name exactly
        passcode: otp,   // match your EmailJS template
      },
    }),
  });


  console.log(emailResponse.status)
  const resText = await emailResponse.text();
  console.log(resText)
  return c.json({ message: 'OTP sent successfully', otpSent: true });
});




userRouter.post('/auth/signin/otp/generate', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log(body)
  const { username } = await c.req.json();
  console.log(username)

  if (!username) {
    return c.json({ error: 'Email is required' }, 400);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return c.json({ error: 'User does not Exists' }, 404);
  }


  // Generate OTP (6-digit code)
  let otp = '';
  const digits = '0123456789';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  } const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

  // Save OTP to the user record
  await prisma.user.update({
    where: { username },
    data: { otpCode: otp, otpExpiresAt: expiresAt },
  });

  // Send OTP via email (using Resend)
  const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: c.env.EMAILJS_SERVICE_ID,
      template_id: c.env.EMAILJS_TEMPLATE_ID,
      accessToken: c.env.EMAILJS_PRIVATE_KEY, // Use the private key here
      user_id: c.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        email: username, // match the template param name exactly
        passcode: otp,   // match your EmailJS template
      },
    }),
  });


  console.log(emailResponse.status)
  const resText = await emailResponse.text();
  console.log(resText)
  return c.json({ message: 'OTP sent successfully', otpSent: true });
});



// Verify OTP
userRouter.post('/auth/otp/verify', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { username, otp } = await c.req.json();

  if (!username || !otp) {
    return c.json({ error: 'Email and OTP are required' }, 400);
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.otpCode || !user.otpExpiresAt) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  // Check if OTP is valid and not expired
  const isValidOtp = user.otpCode === otp;
  const isNotExpired = new Date() < user.otpExpiresAt;

  if (!isValidOtp || !isNotExpired) {
    return c.json({ error: 'Invalid or expired OTP' }, 400);
  }

  // OTP is valid, clear it and mark user as verified
  await prisma.user.update({
    where: { username },
    data: { otpCode: null, otpExpiresAt: null, isVerified: true },
  });

  return c.json({ message: 'OTP verified successfully' });
});



userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect Inputs"
    });
  }

  try {
    // Hash the password with bcryptjs
    const saltRounds = 10; // Adjust salt rounds as needed (10 is a good default)
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const user = await prisma.user.update({
      data: {
        username: body.username,
        password: hashedPassword, // Store the hashed password
      }, where: {
        username: body.username
      }
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token
    });
  } catch (e) {
    console.error("Signup error:", e);
    c.status(409); // 409 Conflict is more appropriate for duplicate user
    return c.json({ error: 'User Already Exists' });
  } finally {
    await prisma.$disconnect(); // Ensure cleanup
  }
});


userRouter.put('/password/reset', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect Inputs"
    });
  }

  try {
    // Hash the password with bcryptjs
    const saltRounds = 10; // Adjust salt rounds as needed (10 is a good default)
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const user = await prisma.user.update({
      data: {
        password: hashedPassword, // Store the hashed password
      }, where: {
        username: body.username
      }
    });

    // const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(200)
    return c.json({
      message: "Password Reset Succesfuly !!"
    });
  } catch (e) {
    console.error("Signup error:", e);
    c.status(409); // 409 Conflict is more appropriate for duplicate user
    return c.json({ error: 'User Already Exists' });
  } finally {
    await prisma.$disconnect(); // Ensure cleanup
  }
});


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
      }
    });

    if (!user) {
      c.status(403);
      return c.json({ Error: "User Not Found !!" })
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      c.status(403);
      return c.json({ error: "Invalid password" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt: token })
  } catch (e) {
    c.status(403)
    return c.json({ Error: "Invalid Credentials" })
  } finally {
    await prisma.$disconnect();
  }
})




userRouter.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const authHeader = c.req.header("Authorization") || ""
  const token = authHeader.split(" ")[1]

  try {
    const user = await verify(token, c.env.JWT_SECRET)
    if (user && typeof user.id === "number") {
      // id : decode(token).header
      const user1 = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      })
      if (user1) {
        c.set("userID", user.id)
        console.log(user);
        await next();
        return
      }
      throw Error
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
    const user = await prisma.details.findUnique({
      where: {
        userId: id
      }
    })
    if (user) {
      console.log(user)
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
    } else {
      const person = await prisma.details.create({
        data: {
          userId: id,
          name: body.name,
          profession: body.profession,
          location: body.location,
          profileUrl: body.profileUrl,
          company: body.company,
          linkedin: body.linkedin,
          x: body.x,
          instagram: body.instagram
        }
      });
    }
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
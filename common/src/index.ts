import z from 'zod'

export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})

export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6)
})

export const createBlogInput = z.object({
    title: z.string(),
    thumbnailUrl: z.string(),
    subtitle: z.string(),
    content: z.string(),

})
export const createCommentInput = z.object({
    content: z.string(),
})

export const updateBlogInput = z.object({
    // id: z.number(),
    title: z.string(),
    thumbnailUrl: z.string(),
    subtitle: z.string(),
    content: z.string()
})


export const userDetails = z.object({
    // id: z.number(),
    name: z.string(),
    profession: z.string(),
    location: z.string(),
    about: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
    x: z.string()
})


export const updateAboutInput = z.object({
    about: z.string()
})

export const updateInfoInput = z.object({
    name: z.string(),
    profession: z.string(),
    location: z.string(),
    profileUrl: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
    x: z.string(),
})

export const authorInfoInput = z.object({
    id: z.number()
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type CreateCommentInput = z.infer<typeof createCommentInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>
export type UserDetails = z.infer<typeof userDetails>
export type UpdateAboutInput = z.infer<typeof updateAboutInput>
export type UpdateInfoInput = z.infer<typeof updateInfoInput>
export type AuthorInfoInput = z.infer<typeof authorInfoInput>

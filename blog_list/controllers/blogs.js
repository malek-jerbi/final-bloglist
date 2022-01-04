const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const token = request.token
  const userToken = request.user
  if (!token || !userToken.id) {
    return response.status(401).json({ error: 'token missing or invalid ' })
  }

  
    const user = await User.findById(userToken.id)


    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    })


    const savedBlog = await blog.save()
    Blog.populate(savedBlog, 'user')

    user.blogs = user.blogs.concat(savedBlog.id)

    await user.save()
    response.json(savedBlog)
  
  
  
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const token = request.token
  const userToken = request.user
  if (blog.user.toString() === userToken.id.toString()) {
    const user = await User.findById(userToken.id)
    await Blog.findByIdAndRemove(request.params.id)
    // console.log('without the id found : ', user.blogs.filter( id => id.toString() !== request.params.id ))
    /* console.log('user blogs 1 : ', user.blogs)
    console.log('user blogs 2 : ', user.blogs.filter( id => id !== request.params.id)) */
    user.blogs = user.blogs.filter(id => id.toString() !== request.params.id)

    await user.save()
    response.status(204).end()
  }
  else {
    response.status(401).json({ error: 'invalid token' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter
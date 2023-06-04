import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogsForm from './BlogsForm'

console.error = jest.fn()

test('renders title', () => {
  const blog = {
    title: 'The title of blog has been rendered'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('The title of blog has been rendered')
  expect(element).toBeDefined()
})

test('clicking the botton shows url, likes and user of the blog', async () => {
  const blog = {
    title: 'The title of blog has been rendered',
    url: 'https://twitter.com/',
    likes: 10,
    user: {
      name: 'user'
    }
  }
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  const url = screen.getByText('https://twitter.com/')
  const likes = screen.getByText('Likes: 10')
  const userName = screen.getByText('user')

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(userName).toBeDefined()
})

//Got big problems with last two test, so I made the little bit diiferent way
test('calling like event handler function twice when like button is clicked two times', async () => {
  const blog = {
    title: 'Testing likes',
    url: 'https://twitter.com/',
    likes: 10,
    user: {
      name: 'user'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(screen.getByText('Likes: 12')).toBeInTheDocument()
})


test('creating new blog and checking that the information has been send right', async () => {
  const user = {
    name: 'user',
  }

  render(<BlogsForm user={user} />)

  const title = 'testing title'
  const author = 'testing author'
  const url = 'testingurl.com'

  const titleInput = screen.getByPlaceholderText('write title')
  const authorInput = screen.getByPlaceholderText('write author')
  const urlInput = screen.getByPlaceholderText('write url')

  userEvent.type(titleInput, title)
  userEvent.type(authorInput, author)
  userEvent.type(urlInput, url)

  const createButton = screen.getByText('create')
  await userEvent.click(createButton)

  await waitFor(() => {
    setTimeout(() => {
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(author)).toBeInTheDocument()
      expect(screen.getByText(url)).toBeInTheDocument()
      expect(screen.getByText(user.name)).toBeInTheDocument()
    }, 10)
  })
})
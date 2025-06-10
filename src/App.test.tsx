import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the app with initial content', () => {
    render(<App />)
    
    // Check if the main heading is present
    expect(screen.getByText('Vite + React')).toBeInTheDocument()
    
    // Check if the counter button is present with initial count
    expect(screen.getByText('count is 0')).toBeInTheDocument()
    
    // Check if logos are present
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
    expect(screen.getByAltText('React logo')).toBeInTheDocument()
  })

  it('increments counter when button is clicked', () => {
    render(<App />)
    
    const button = screen.getByRole('button', { name: /count is/i })
    
    // Initial state
    expect(button).toHaveTextContent('count is 0')
    
    // Click the button
    fireEvent.click(button)
    
    // Check if count incremented
    expect(button).toHaveTextContent('count is 1')
    
    // Click again
    fireEvent.click(button)
    
    // Check if count incremented again
    expect(button).toHaveTextContent('count is 2')
  })

  it('contains links to Vite and React documentation', () => {
    render(<App />)
    
    const viteLink = screen.getByRole('link', { name: /vite logo/i })
    const reactLink = screen.getByRole('link', { name: /react logo/i })
    
    expect(viteLink).toHaveAttribute('href', 'https://vite.dev')
    expect(reactLink).toHaveAttribute('href', 'https://react.dev')
  })
})

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  it('renders without crashing', () => {
    render(<Counter />);
    expect(screen.getByText(/Counter:/)).toBeInTheDocument();
  });

  it('renders with default initial value', () => {
    render(<Counter />);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  it('renders with custom initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByText('Counter: 5')).toBeInTheDocument();
  });

  it('increments counter when + button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('+');
    
    fireEvent.click(incrementButton);
    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
    
    fireEvent.click(incrementButton);
    expect(screen.getByText('Counter: 2')).toBeInTheDocument();
  });

  it('decrements counter when - button is clicked', () => {
    render(<Counter initialValue={5} />);
    const decrementButton = screen.getByText('-');
    
    fireEvent.click(decrementButton);
    expect(screen.getByText('Counter: 4')).toBeInTheDocument();
  });

  it('uses custom step value', () => {
    render(<Counter initialValue={0} step={5} />);
    const incrementButton = screen.getByText('+');
    
    fireEvent.click(incrementButton);
    expect(screen.getByText('Counter: 5')).toBeInTheDocument();
  });

  it('resets counter to initial value when reset button is clicked', () => {
    render(<Counter initialValue={10} />);
    const incrementButton = screen.getByText('+');
    const resetButton = screen.getByText('Reset');
    
    // Increment a few times
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(screen.getByText('Counter: 12')).toBeInTheDocument();
    
    // Reset
    fireEvent.click(resetButton);
    expect(screen.getByText('Counter: 10')).toBeInTheDocument();
  });

  it('has all required buttons', () => {
    render(<Counter />);
    
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Counter initialValue={5} step={2} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
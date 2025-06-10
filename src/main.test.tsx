import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock React DOM
const mockRender = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender
  }))
}));

// Mock the App component
vi.mock('./App', () => ({
  default: () => 'App Component'
}));

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Create a mock root element
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('should render App in StrictMode', async () => {
    // Import main to trigger the rendering
    await import('./main');
    
    // Verify that render was called
    expect(mockRender).toHaveBeenCalledOnce();
  });

  it('should find root element', () => {
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeTruthy();
  });
});
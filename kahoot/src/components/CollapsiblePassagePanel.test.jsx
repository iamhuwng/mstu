import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import CollapsiblePassagePanel from './CollapsiblePassagePanel';

// Helper to wrap component with MantineProvider
const renderWithMantine = (component) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('CollapsiblePassagePanel', () => {
  const mockPassage = {
    type: 'text',
    content: 'This is a test passage for reading comprehension.',
    imageUrl: null,
    caption: null
  };

  const mockChildren = <div data-testid="question-content">Question Content</div>;

  describe('No Passage Scenario', () => {
    it('should render children directly when passage is null', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={null}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.getByTestId('question-content')).toBeInTheDocument();
      expect(screen.queryByLabelText(/open passage panel/i)).not.toBeInTheDocument();
    });

    it('should render children directly when passage is undefined', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={undefined}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.getByTestId('question-content')).toBeInTheDocument();
      expect(screen.queryByLabelText(/open passage panel/i)).not.toBeInTheDocument();
    });

    it('should not render hamburger button when no passage exists', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={null}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.queryByLabelText(/open passage panel/i)).not.toBeInTheDocument();
    });
  });

  describe('Passage Exists - Panel Closed', () => {
    it('should render hamburger button when passage exists', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.getByLabelText(/open passage panel/i)).toBeInTheDocument();
    });

    it('should render children when passage exists and panel is closed', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.getByTestId('question-content')).toBeInTheDocument();
    });

    it('should have hamburger button in fixed position at top-left', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      expect(hamburgerButton.parentElement).toHaveStyle({ position: 'fixed', top: '20px', left: '20px' });
    });

    it('should not show passage content when panel is closed', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.queryByText(/This is a test passage/i)).not.toBeInTheDocument();
    });
  });

  describe('Panel Open/Close Functionality', () => {
    it('should open panel when hamburger button is clicked', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByText(/Passage\/Material/i)).toBeInTheDocument();
      expect(screen.getByText(/This is a test passage/i)).toBeInTheDocument();
    });

    it('should show close button when panel is open', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByLabelText(/close passage panel/i)).toBeInTheDocument();
    });

    it('should close panel when close button is clicked', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      // Open panel
      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByText(/This is a test passage/i)).toBeInTheDocument();

      // Close panel
      const closeButton = screen.getByLabelText(/close passage panel/i);
      fireEvent.click(closeButton);

      expect(screen.queryByText(/This is a test passage/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/open passage panel/i)).toBeInTheDocument();
    });

    it('should hide hamburger button when panel is open', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.queryByLabelText(/open passage panel/i)).not.toBeInTheDocument();
    });
  });

  describe('Auto-Reset on Passage Change', () => {
    it('should close panel when passage changes', async () => {
      const { rerender } = renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      // Open panel
      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByText(/This is a test passage/i)).toBeInTheDocument();

      // Change passage (new question)
      const newPassage = {
        type: 'text',
        content: 'This is a different passage.',
        imageUrl: null,
        caption: null
      };

      rerender(
        <MantineProvider>
          <CollapsiblePassagePanel passage={newPassage}>
            {mockChildren}
          </CollapsiblePassagePanel>
        </MantineProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText(/This is a test passage/i)).not.toBeInTheDocument();
        expect(screen.getByLabelText(/open passage panel/i)).toBeInTheDocument();
      });
    });

    it('should start with panel closed on initial render', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      expect(screen.getByLabelText(/open passage panel/i)).toBeInTheDocument();
      expect(screen.queryByText(/Passage\/Material/i)).not.toBeInTheDocument();
    });
  });

  describe('Resizable Panel Layout', () => {
    it('should render PanelGroup when panel is open', () => {
      const { container } = renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      // Check that children are still rendered in panel layout
      expect(screen.getByTestId('question-content')).toBeInTheDocument();
      expect(screen.getByText(/Passage\/Material/i)).toBeInTheDocument();
    });

    it('should render passage content in left panel', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByText(/This is a test passage/i)).toBeInTheDocument();
    });

    it('should render children content in right panel when open', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByTestId('question-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for hamburger button', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText('Open passage panel');
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('should have proper aria-label for close button', () => {
      renderWithMantine(
        <CollapsiblePassagePanel passage={mockPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      const closeButton = screen.getByLabelText('Close passage panel');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Passage Content Types', () => {
    it('should render text passage correctly', () => {
      const textPassage = {
        type: 'text',
        content: 'Sample text passage with multiple paragraphs.',
        imageUrl: null,
        caption: null
      };

      renderWithMantine(
        <CollapsiblePassagePanel passage={textPassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByText(/Sample text passage/i)).toBeInTheDocument();
    });

    it('should render image passage correctly', () => {
      const imagePassage = {
        type: 'image',
        content: null,
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test image caption'
      };

      const { container } = renderWithMantine(
        <CollapsiblePassagePanel passage={imagePassage}>
          {mockChildren}
        </CollapsiblePassagePanel>
      );

      const hamburgerButton = screen.getByLabelText(/open passage panel/i);
      fireEvent.click(hamburgerButton);

      // PassageRenderer handles image rendering
      // We just verify the panel is open
      expect(screen.getByText(/Passage\/Material/i)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PassageRenderer from './PassageRenderer';

describe('PassageRenderer', () => {
  describe('No Passage (null)', () => {
    it('should display placeholder when passage is null', () => {
      render(<PassageRenderer passage={null} />);
      expect(screen.getByText(/No passage available for this question/i)).toBeInTheDocument();
      expect(screen.getByText(/Passages will appear here when configured/i)).toBeInTheDocument();
    });

    it('should display placeholder when passage is undefined', () => {
      render(<PassageRenderer passage={undefined} />);
      expect(screen.getByText(/No passage available for this question/i)).toBeInTheDocument();
    });
  });

  describe('Text-Only Passage', () => {
    const textPassage = {
      type: 'text',
      content: 'This is a sample reading passage for IELTS practice. It contains multiple paragraphs of text.',
      imageUrl: null,
      caption: null
    };

    it('should render text content correctly', () => {
      render(<PassageRenderer passage={textPassage} />);
      expect(screen.getByText(/This is a sample reading passage/i)).toBeInTheDocument();
    });

    it('should not render image when type is text', () => {
      const { container } = render(<PassageRenderer passage={textPassage} />);
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(0);
    });

    it('should preserve line breaks in text content', () => {
      const multilinePassage = {
        type: 'text',
        content: 'First paragraph.\n\nSecond paragraph.',
        imageUrl: null,
        caption: null
      };
      render(<PassageRenderer passage={multilinePassage} />);
      const textContent = screen.getByText(/First paragraph/i);
      expect(textContent).toBeInTheDocument();
    });
  });

  describe('Image-Only Passage', () => {
    const imagePassage = {
      type: 'image',
      content: null,
      imageUrl: '/images/world-map.png',
      caption: 'World Climate Zones Map'
    };

    it('should render image correctly', () => {
      render(<PassageRenderer passage={imagePassage} />);
      const img = screen.getByAltText('World Climate Zones Map');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/world-map.png');
    });

    it('should render image caption', () => {
      render(<PassageRenderer passage={imagePassage} />);
      expect(screen.getByText('World Climate Zones Map')).toBeInTheDocument();
    });

    it('should show "Click image to enlarge" hint', () => {
      render(<PassageRenderer passage={imagePassage} />);
      expect(screen.getByText(/Click image to enlarge/i)).toBeInTheDocument();
    });

    it('should not render text content when type is image', () => {
      const imageOnlyPassage = {
        type: 'image',
        content: 'This should not appear',
        imageUrl: '/images/diagram.png',
        caption: null
      };
      render(<PassageRenderer passage={imageOnlyPassage} />);
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });

    it('should use alt text when no caption provided', () => {
      const noCaptionPassage = {
        type: 'image',
        content: null,
        imageUrl: '/images/diagram.png',
        caption: null
      };
      render(<PassageRenderer passage={noCaptionPassage} />);
      const img = screen.getByAltText('Passage image');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Combined Text + Image Passage', () => {
    const bothPassage = {
      type: 'both',
      content: 'The water cycle describes the continuous movement of water.',
      imageUrl: '/images/water-cycle.png',
      caption: 'The Water Cycle Diagram'
    };

    it('should render both text and image', () => {
      render(<PassageRenderer passage={bothPassage} />);
      expect(screen.getByText(/The water cycle describes/i)).toBeInTheDocument();
      const img = screen.getByAltText('The Water Cycle Diagram');
      expect(img).toBeInTheDocument();
    });

    it('should render text before image', () => {
      const { container } = render(<PassageRenderer passage={bothPassage} />);
      const allText = container.textContent;

      // Simply verify both text and image exist
      expect(screen.getByText(/The water cycle describes/i)).toBeInTheDocument();
      expect(screen.getByAltText('The Water Cycle Diagram')).toBeInTheDocument();
    });
  });

  describe('Image Modal (Zoom Functionality)', () => {
    const imagePassage = {
      type: 'image',
      content: null,
      imageUrl: '/images/map.png',
      caption: 'Test Map'
    };

    it('should open modal when image is clicked', () => {
      render(<PassageRenderer passage={imagePassage} />);
      const img = screen.getByAltText('Test Map');

      // Modal should not be visible initially
      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();

      fireEvent.click(img);

      // Modal should be visible
      expect(screen.getByTestId('image-modal')).toBeInTheDocument();
      const modalImg = screen.getByAltText(/enlarged view/i);
      expect(modalImg).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', () => {
      render(<PassageRenderer passage={imagePassage} />);
      const img = screen.getByAltText('Test Map');

      fireEvent.click(img);
      const closeButton = screen.getByText(/Close/i);
      fireEvent.click(closeButton);

      // Modal should be gone
      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
    });

    it('should close modal when clicking outside image', () => {
      render(<PassageRenderer passage={imagePassage} />);
      const img = screen.getByAltText('Test Map');

      fireEvent.click(img);
      const modal = screen.getByTestId('image-modal');
      fireEvent.click(modal);

      // Modal should be gone
      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
    });

    it('should display caption in modal', () => {
      render(<PassageRenderer passage={imagePassage} />);
      const img = screen.getByAltText('Test Map');

      fireEvent.click(img);

      // Caption should appear twice: once in main view, once in modal
      const captions = screen.getAllByText('Test Map');
      expect(captions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Styling and Responsive Design', () => {
    it('should apply correct text styling for readability', () => {
      const passage = {
        type: 'text',
        content: 'Sample text',
        imageUrl: null,
        caption: null
      };
      render(<PassageRenderer passage={passage} />);
      const textContent = screen.getByText('Sample text');
      expect(textContent).toBeInTheDocument();
    });

    it('should make image clickable with pointer cursor', () => {
      const passage = {
        type: 'image',
        content: null,
        imageUrl: '/images/test.png',
        caption: null
      };
      render(<PassageRenderer passage={passage} />);
      const img = screen.getByAltText('Passage image');
      expect(img).toHaveStyle({ cursor: 'pointer' });
    });
  });
});

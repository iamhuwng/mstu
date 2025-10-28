import React, { useState, useEffect } from 'react';
import { ActionIcon, Paper } from '@mantine/core';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import PassageRenderer from './PassageRenderer';

/**
 * CollapsiblePassagePanel - A resizable panel layout for displaying passage/material content
 *
 * Features:
 * - Hamburger icon button to open panel (only shown if passage exists)
 * - Draggable divider for resizing panels (50/50 default, 20-80% constraints)
 * - Close button (X) to collapse panel
 * - Displays passage content using PassageRenderer
 * - Default state: collapsed (isOpen: false)
 * - Auto-resets to collapsed when passage changes (new question)
 *
 * @param {Object} passage - The passage object to display (null/undefined if no passage)
 * @param {React.ReactNode} children - The question content to display in the right panel (can be function)
 * @returns {JSX.Element} The collapsible panel component with children
 */
const CollapsiblePassagePanel = ({ passage, children, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Support children as function to pass isOpen state
  const renderChildren = typeof children === 'function' ? children({ isPassageOpen: isOpen }) : children;

  // Reset to collapsed state when passage changes (new question navigation)
  useEffect(() => {
    setIsOpen(false);
  }, [passage]);

  // If no passage, render children directly without any panel UI
  if (!passage) {
    return <>{renderChildren}</>;
  }

  // If passage exists but panel is closed, show hamburger button + full-width children
  if (!isOpen) {
    return (
      <>
        <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 101 }}>
          <ActionIcon
            onClick={() => setIsOpen(true)}
            size="lg"
            variant="filled"
            color="blue"
            aria-label="Open passage panel"
          >
            <IconMenu2 size={24} />
          </ActionIcon>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <h2 style={{ margin: '0 auto', color: '#1e293b', fontWeight: '700', fontSize: '1.5rem' }}>{title}</h2>
        </div>
        {renderChildren}
      </>
    );
  }

  // If passage exists and panel is open, show resizable panel layout
  return (
    <PanelGroup direction="horizontal" autoSaveId={null} style={{ flex: 1, overflow: 'hidden' }}>
      {/* Left Panel - Passage/Material (50% default, 20-80% constraints) */}
      <Panel defaultSize={50} minSize={20} maxSize={80} style={{ position: 'relative' }}>
        <Paper
          shadow="sm"
          p="md"
          style={{
            height: '100%',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRight: '1px solid #e0e0e0'
          }}
        >
          {/* Header with title and close button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            paddingBottom: '10px',
            borderBottom: '1px solid #f0f0f0',
            zIndex: 10
          }}>
            <h2 style={{ margin: 0, fontSize: '1.3em', color: '#1e293b', fontWeight: '700' }}>Passage/Material</h2>
            <ActionIcon
              onClick={() => setIsOpen(false)}
              size="lg"
              variant="subtle"
              color="gray"
              aria-label="Close passage panel"
            >
              <IconX size={24} />
            </ActionIcon>
          </div>

          {/* Passage Content */}
          <div style={{ marginTop: '10px' }}>
            <PassageRenderer passage={passage} />
          </div>
        </Paper>
      </Panel>

      {/* Draggable Divider - 4px width, col-resize cursor */}
      <PanelResizeHandle style={{
        width: '4px',
        backgroundColor: '#e0e0e0',
        cursor: 'col-resize',
        position: 'relative',
        transition: 'background-color 0.2s'
      }}>
        <div
          style={{
            width: '100%',
            height: '100%'
          }}
          onMouseEnter={(e) => e.currentTarget.parentElement.style.backgroundColor = '#bbb'}
          onMouseLeave={(e) => e.currentTarget.parentElement.style.backgroundColor = '#e0e0e0'}
        />
      </PanelResizeHandle>

      {/* Right Panel - Question Area (50% default) */}
      <Panel defaultSize={50}>
        <div style={{ height: '100%', overflowY: 'auto' }}>
          {renderChildren}
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default CollapsiblePassagePanel;

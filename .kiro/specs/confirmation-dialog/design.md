# Design Document: Confirmation Dialog Component

## Overview

The ConfirmationDialog is a reusable React component that provides a modal confirmation interface for user actions. It will be built using React with TypeScript, leveraging Tailwind CSS for styling (consistent with the existing application stack). The component will be lightweight, accessible, and follow modern React patterns including hooks for state management and keyboard event handling.

## Architecture

### Component Structure

```
src/components/ConfirmationDialog/
├── ConfirmationDialog.tsx   # Main component
└── ConfirmationDialog.scss  # Styles
```

### Technology Stack

- **React 19.1.0**: Component framework
- **TypeScript**: Type safety
- **SCSS**: Styling
- **React Portal**: For rendering outside DOM hierarchy

## Components and Interfaces

### ConfirmationDialog Component

The main component will be a functional React component that renders a modal dialog with the following structure:

```
Modal Overlay (full screen, semi-transparent)
└── Dialog Container (centered)
    ├── Message Text
    └── Button Group
        ├── No Button
        └── Yes Button
```

### TypeScript Interfaces

```typescript
interface ConfirmationDialogProps {
  isOpen: boolean;           // Controls visibility
  message: string;           // Action message to display
  onConfirm: () => void;     // Callback for "Yes" action
  onCancel: () => void;      // Callback for "No" action
}
```

### State Management

The component will be controlled from the parent component through the `isOpen` prop. Internal state will be minimal:

- Focus management for keyboard navigation
- Button hover states (handled by CSS)

## Data Models

No complex data models are required. The component operates on simple props:

- **isOpen**: Boolean flag
- **message**: String for display
- **Callbacks**: Functions with no parameters and void return

## Implementation Details

### Modal Rendering

The component will use React Portal (`ReactDOM.createPortal`) to render the modal at the document body level, ensuring it appears above all other content regardless of parent component z-index constraints.

### Styling Approach

Using SCSS with simple, clean styles:

- **Overlay**: Fixed position, full screen, semi-transparent black background, centered content
- **Dialog Container**: White background, rounded corners, shadow, padding
- **Message**: Centered text with appropriate spacing
- **Button Container**: Flexbox with gap between buttons
- **Buttons**: Styled buttons with hover states

### Keyboard Interaction

1. **Escape Key**: Close dialog and trigger onCancel
2. **Tab Key**: Navigate between buttons (native behavior)

### Accessibility Features

- Basic ARIA attributes for screen readers
- Keyboard support for Escape key

## Error Handling

### Edge Cases

1. **Missing Callbacks**: TypeScript enforces required props
2. **Rapid Clicks**: Close dialog immediately after button click to prevent double-execution

## Testing Strategy

### Manual Testing

- Dialog appears centered on screen
- Dialog appears above all other content
- Buttons work correctly
- Escape key closes dialog
- Callbacks execute properly

## Usage Example

```typescript
import { useState } from 'react';
import ConfirmationDialog from '@/components/ConfirmationDialog';

function MyComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    // Perform delete action
    console.log('Item deleted');
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <button onClick={handleDelete}>Delete Item</button>
      
      <ConfirmationDialog
        isOpen={isDialogOpen}
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
```

## Design Decisions

### 1. React Portal
Use React Portal to render the dialog at document body level, ensuring it appears above all content.

### 2. SCSS Styling
Simple SCSS file with clean, maintainable styles matching existing modal patterns.

### 3. Controlled Component
Parent controls the `isOpen` state for maximum flexibility.

### 4. Minimal Props
Only essential props: isOpen, message, onConfirm, onCancel.

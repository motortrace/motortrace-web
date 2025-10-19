# ManageWorkOrderModal - Refactored Structure

This document provides an overview of the refactored ManageWorkOrderModal component structure.

## 📁 Directory Structure

```
src/components/ManageWorkOrderModal/
├── index.tsx                           # Main orchestration component
├── types.ts                            # All TypeScript interfaces
│
├── hooks/
│   ├── useWorkOrderModal.ts           # Modal state & API handlers
│   └── useInspections.ts              # Inspection fetching & filtering
│
├── components/
│   ├── TabNavigation.tsx              # Tab navigation with role-based visibility
│   │
│   ├── tabs/
│   │   ├── OverviewTab.tsx            # Overview with chat & info panels
│   │   └── InspectionsTab.tsx         # Inspections list with API integration
│   │
│   └── modals/
│       ├── AddInspectionModal.tsx     # Assign inspection template modal
│       ├── AssignTechnicianModal.tsx  # Assign technician to inspection modal
│       └── GenerateInvoiceModal.tsx   # Generate invoice modal
│
└── utils/
    └── helpers.ts                      # Utility helper functions
```

## 🎯 Component Responsibilities

### **index.tsx** (Main Component)
- Orchestrates all sub-components and hooks
- Manages tab navigation state
- Fetches inspection templates and technicians
- Renders modal layout with header, navigation, body, and footer
- Wires props from hooks to child components

### **types.ts**
Centralized TypeScript definitions:
- `LaborCatalog`, `UserProfile`, `TechnicianProfile`
- `WorkOrderLabor`
- `InspectionTemplate`, `InspectionTemplateItem`
- `WorkOrderInspection`, `InspectionChecklistItem`, `TireInspection`
- `WorkOrderInspectionAttachment`
- `CannedService`
- `ManageWorkOrderModalProps`

### **hooks/useWorkOrderModal.ts**
Custom hook managing:
- **Modal visibility states**: `showAddInspectionModal`, `showAssignTechnicianModal`, `showGenerateInvoiceModal`
- **Form states**: `selectedTemplateId`, `inspectionNotes`, `selectedTechnicianId`, invoice fields
- **Loading states**: `isGeneratingInvoice`
- **Data states**: `inspectionTemplates`, `technicians`
- **Handler functions**:
  - `handleAssignInspector` - PUT to assign technician to inspection
  - `handleAssignInspectionTemplate` - POST to assign template to work order
  - `handleGenerateInvoice` - POST to generate invoice
- **Modal control functions**: open/close functions for each modal
- **Helper functions**: `getTechnicianDisplayName`

### **hooks/useInspections.ts**
Custom hook managing:
- **Data fetching**: Fetches inspections and attachments from API
- **Search & filtering**: `searchQuery`, `statusFilter` (all/completed/pending)
- **Loading & error states**: `isLoading`, `error`
- **Computed data**: `filteredInspections`, `summary` (total, completed, pending counts)
- **Functions**:
  - `fetchInspections` - GET inspections for work order
  - `fetchAttachments` - GET attachments for specific inspection
  - `refetchInspections` - Refresh data after updates
  - `getFilteredInspections` - Apply search and status filters
  - `getInspectionSummary` - Calculate summary statistics

### **components/TabNavigation.tsx**
- Renders tab navigation bar
- Role-based tab visibility (Services tab hidden for service advisors)
- Active tab highlighting
- Tab icons from Boxicons

### **components/tabs/OverviewTab.tsx**
Overview tab featuring:
- **Chat Panel**: Message display with timestamp
- **Service Advisor Info**: Name, phone, email with avatar
- **Customer Info**: Name, phone, complaint, notes
- **Vehicle Info**: Year, make, model, VIN, mileage with image
- **Assigned Technicians**: List of technicians with avatars

### **components/tabs/InspectionsTab.tsx**
Inspections tab featuring:
- **Action buttons**: Add Inspection (service advisors only)
- **Summary cards**: Total inspections, completed count
- **Search bar**: Filter by template name, notes, technician
- **Status filter**: All, Completed, Pending
- **Inspection table**: Template, date, technician, status, actions
- **Assign technician button**: For each inspection
- **Attachments display**: File previews for each inspection

### **components/modals/AddInspectionModal.tsx**
Modal for assigning inspection template:
- Template selection dropdown
- Optional notes textarea
- Cancel/Assign buttons
- Disabled state when no template selected

### **components/modals/AssignTechnicianModal.tsx**
Modal for assigning technician to inspection:
- Technician selection dropdown with specialization display
- Cancel/Assign buttons
- Disabled state when no technician selected

### **components/modals/GenerateInvoiceModal.tsx**
Modal for generating invoices:
- Due date picker (min: today)
- Payment terms dropdown (Net 7/14/30/60, Due on Receipt, COD)
- Auto-calculation of due date based on payment terms
- Optional notes textarea
- Invoice summary display (parts, labor, totals)
- Loading state during generation
- Cancel/Generate buttons

### **utils/helpers.ts**
Utility functions:
- `getTechnicianDisplayName(technician)` - Extract name from various technician object structures
- `getUserRole()` - Get user role from localStorage
- `isServiceAdvisorRole()` - Check if user is a service advisor

## 🔌 API Endpoints Used

### Inspections
- `GET /inspection-templates/work-orders/{workOrderId}/inspections` - Fetch inspections
- `GET /inspection-templates/inspections/{inspectionId}/attachments` - Fetch attachments
- `POST /inspection-templates/work-orders/assign-template` - Assign template to work order
- `PUT /inspection-templates/inspections/{inspectionId}` - Assign technician to inspection

### Templates & Technicians
- `GET /inspection-templates/templates` - Fetch all templates
- `GET /technicians` - Fetch all technicians

### Invoices
- `POST /invoices` - Generate invoice

## 🔐 Authentication
All API calls use Bearer token authentication from `useAuth` hook:
```typescript
headers: {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 🎨 Role-Based Features

### Service Advisors
- Can view all tabs
- Can add inspections
- Can generate invoices
- Services tab is **hidden**

### Other Roles (Manager/Admin)
- Can view all tabs including Services
- Same inspection management capabilities

## 📝 Usage Example

```tsx
import ManageWorkOrderModal from './components/ManageWorkOrderModal';

function WorkOrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const handleUpdate = () => {
    // Refresh work orders list
    fetchWorkOrders();
  };

  return (
    <>
      <button onClick={() => {
        setSelectedWorkOrder(workOrder);
        setIsModalOpen(true);
      }}>
        Manage Work Order
      </button>

      <ManageWorkOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workOrder={selectedWorkOrder}
        onUpdate={handleUpdate}
      />
    </>
  );
}
```

## ✅ Features Implemented

- ✅ Modular component structure
- ✅ Custom hooks for state management
- ✅ Role-based visibility
- ✅ Inspection management with templates
- ✅ Technician assignment
- ✅ Invoice generation with payment terms
- ✅ Search and filtering
- ✅ API integration with error handling
- ✅ TypeScript type safety
- ✅ Reusable utility functions

## 🚫 Features Excluded (Per User Request)

- ❌ Services & Labor tabs
- ❌ Notes tab
- ❌ Estimates functionality

These can be added later following the same modular pattern.

## 🔄 Data Flow

```
index.tsx (Main Component)
    ↓
    ├─→ useWorkOrderModal hook
    │   ├─→ Modal visibility state
    │   ├─→ Form state management
    │   └─→ API handlers (assign, generate)
    │
    ├─→ useInspections hook
    │   ├─→ Fetch inspections
    │   ├─→ Filter & search
    │   └─→ Summary calculations
    │
    ├─→ TabNavigation
    │   └─→ Tab switching
    │
    ├─→ OverviewTab
    │   └─→ Display work order details
    │
    ├─→ InspectionsTab
    │   ├─→ Display filtered inspections
    │   └─→ Trigger modal actions
    │
    └─→ Modals (AddInspection, AssignTechnician, GenerateInvoice)
        ├─→ Receive state from hooks
        └─→ Call handlers from hooks
```

## 🎯 Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Hooks and modals can be reused elsewhere
3. **Testability**: Isolated components are easier to test
4. **Scalability**: Easy to add new tabs or features
5. **Type Safety**: Strong TypeScript typing throughout
6. **Developer Experience**: Clear separation of concerns

## 📦 Dependencies

- React (hooks: useState, useEffect)
- TypeScript
- Custom hooks: `useAuth` from `../../hooks/useAuth`
- Boxicons for icons
- Native fetch API for HTTP requests

## 🐛 Error Handling

- Console logging for debugging API calls
- Try/catch blocks in all API handlers
- Loading states for async operations
- Validation before API calls (check for required IDs, token)
- No intrusive alerts (logs only)

---

**Last Updated**: December 2024
**Status**: ✅ Complete and ready for integration

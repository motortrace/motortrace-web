// components/JobCard/JobCardTabs.tsx
import React from 'react';
import ServicesTab from './tabs/ServicesTab';
import PartsTab from './tabs/PartsTab';
import InspectionsTab from './tabs/InspectionsTabs';
import NotesTab from './tabs/NotesTab';
import type { ServicePackage, PartItem } from './types/jobCard.types';

interface JobCardTabsProps {
  activeTab: 'services' | 'parts' | 'inspections' | 'notes';
  setActiveTab: (tab: 'services' | 'parts' | 'inspections' | 'notes') => void;
  services: ServicePackage[];
  setServices: (services: ServicePackage[]) => void;
  partItems: PartItem[];
  notes: string;
  setNotes: (notes: string) => void;
  calculateGrandTotal: () => number;
}

export const JobCardTabs: React.FC<JobCardTabsProps> = ({
  activeTab,
  setActiveTab,
  services,
  setServices,
  partItems,
  notes,
  setNotes,
  calculateGrandTotal
}) => {
  return (
    <>
      <div className="job-card__tabs">
        <nav className="job-card__tab-nav">
          {['services', 'parts', 'inspections', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`job-card__tab ${activeTab === tab ? 'job-card__tab--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="job-card__tab-content">
        {activeTab === 'services' && (
          <ServicesTab services={services} setServices={setServices} calculateGrandTotal={calculateGrandTotal} />
        )}
        {activeTab === 'parts' && <PartsTab partItems={partItems} />}
        {activeTab === 'inspections' && (
          <InspectionsTab 
            workOrderId="WO-2024-001"
            customerName="Amber Miller"
            vehicleInfo="2020 Audi A4 Premium"
            licensePlate="ABC-1234"
            technician="Chuck Ivanes"
          />
        )}
        {activeTab === 'notes' && <NotesTab notes={notes} onNotesChange={setNotes} />}
      </div>
    </>
  );
};
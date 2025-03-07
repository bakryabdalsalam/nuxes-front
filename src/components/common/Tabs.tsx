import React, { useState } from 'react';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Styles for different tab variants
  const tabStyles = {
    default: {
      container: 'border-b border-gray-200',
      list: 'flex -mb-px',
      tab: (isActive: boolean, isDisabled: boolean) =>
        `inline-block py-3 px-4 text-sm font-medium border-b-2 ${
          isActive
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
    },
    pills: {
      container: '',
      list: 'flex space-x-2',
      tab: (isActive: boolean, isDisabled: boolean) =>
        `inline-block px-3 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
    },
    underline: {
      container: '',
      list: 'flex',
      tab: (isActive: boolean, isDisabled: boolean) =>
        `inline-block py-2 px-1 mx-2 text-sm font-medium border-b-2 ${
          isActive
            ? 'border-primary-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
    },
  };

  const styles = tabStyles[variant];

  return (
    <div className={className}>
      <div className={styles.container}>
        <div className="overflow-x-auto scrollbar-hide">
          <nav className={styles.list}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (!tab.disabled) {
                    handleTabChange(tab.id);
                  }
                }}
                className={styles.tab(activeTab === tab.id, !!tab.disabled)}
                disabled={tab.disabled}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="py-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            id={`tabpanel-${tab.id}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
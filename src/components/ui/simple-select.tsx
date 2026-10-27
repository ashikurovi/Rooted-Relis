import React from 'react';
import Select, { Props as ReactSelectProps } from 'react-select';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SimpleSelectProps extends Omit<ReactSelectProps<SelectOption, false>, 'onChange' | 'value' | 'options'> {
  options: SelectOption[];
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
}

export function SimpleSelect({ options, value, onChange, className = "", ...props }: SimpleSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <Select
      className={className}
      value={selectedOption}
      onChange={(selected: SelectOption | null) => {
        const val = selected ? selected.value : "";
        onChange({ target: { value: val } } as any);
      }}
      options={options}
      classNamePrefix="react-select"
      styles={{
        control: (base, state) => ({
          ...base,
          border: state.isFocused ? '1px solid #106840' : '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: 'none',
          minHeight: '40px',
          backgroundColor: '#ffffff',
          fontWeight: '600',
          fontSize: '13px',
          color: '#1f2937',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          '&:hover': {
            borderColor: '#106840',
            boxShadow: 'none',
          }
        }),
        singleValue: (base) => ({
          ...base,
          color: '#111827',
          fontWeight: '600',
        }),
        placeholder: (base) => ({
          ...base,
          color: '#6b7280',
          fontWeight: '500',
        }),
        dropdownIndicator: (base, state) => ({
          ...base,
          color: state.isFocused ? '#106840' : '#9ca3af',
          '&:hover': {
            color: '#106840',
          }
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: '#e5e7eb',
        }),
        option: (base, state) => ({
          ...base,
          fontWeight: state.isSelected ? '700' : '500',
          fontSize: '13px',
          backgroundColor: state.isSelected 
            ? '#106840' 
            : state.isFocused 
              ? '#f3f4f6' 
              : '#ffffff',
          color: state.isSelected 
            ? '#ffffff' 
            : '#1f2937',
          cursor: 'pointer',
          padding: '8px 12px',
          '&:active': {
            backgroundColor: '#106840',
            color: '#ffffff',
          }
        }),
        menu: (base) => ({
          ...base,
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginTop: '4px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          zIndex: 50,
        })
      }}
      {...props}
    />
  );
}

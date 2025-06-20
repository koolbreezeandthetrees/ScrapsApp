import React from "react";

export interface SelectableRowProps<T> {
  name: string;
  options: T[];
  selected: T | null;
  onSelect: (value: T) => void;
  getLabel?: (option: T) => string;
  getValue?: (option: T) => string | number;
}

export function SelectableRow<T>({
  name,
  options,
  selected,
  onSelect,
  getLabel = (o: T) => String(o),
  getValue = (o: T) => o as unknown as string | number,
}: SelectableRowProps<T>) {
  return (
    <div
      className="flex gap-4 flex-wrap mb-4"
      role="radiogroup"
      aria-labelledby={`${name}-label`}
    >
      {options.map((option, idx) => {
        const value = getValue(option);
        const label = getLabel(option);
        const isSelected = selected !== null && getValue(selected) === value;

        return (
          <button
            key={value?.toString() ?? idx}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`selectable-item ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(option)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

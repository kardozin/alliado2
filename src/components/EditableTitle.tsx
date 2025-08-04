import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface EditableTitleProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
}

export function EditableTitle({ value, onSave, className = "", placeholder = "Escribe un título..." }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2 w-full">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={handleSave}
          className={`flex-1 bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 ${className}`}
          placeholder={placeholder}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="p-2 text-green-400 hover:text-green-300 transition-colors duration-200"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center space-x-2 cursor-pointer" onClick={() => setIsEditing(true)}>
      <span className={className}>{value}</span>
      <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
}
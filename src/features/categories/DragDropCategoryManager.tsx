import React, { useState } from 'react';
import { CategoryConfig } from '@/types/budget';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

export interface DragDropCategoryManagerProps {
  customCategories: CategoryConfig[];
  onSaveCategories: (categories: CategoryConfig[]) => void;
}

export const DragDropCategoryManager: React.FC<DragDropCategoryManagerProps> = ({
  customCategories,
  onSaveCategories,
}) => {
  const [categories, setCategories] = useState<CategoryConfig[]>(() => {
    return customCategories.length > 0 ? customCategories : DEFAULT_CATEGORIES;
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...categories];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(targetIndex, 0, item);
    setDraggedIndex(targetIndex);
    setCategories(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    onSaveCategories(categories);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setCategories(updated);
    onSaveCategories(updated);
  };

  const moveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setCategories(updated);
    onSaveCategories(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <span>Drag & drop categories to reorder list</span>
        <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{categories.length} Categories</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
        {categories.map((cat, index) => (
          <div
            key={cat.key || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: draggedIndex === index ? 'rgba(99,102,241,0.18)' : 'var(--bg-input)',
              border: draggedIndex === index ? '1px solid var(--primary-500)' : '1px solid var(--border-input)',
              cursor: 'grab',
              transition: 'var(--transition)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-grip-vertical" style={{ color: 'var(--text-muted)', fontSize: '13px' }} />
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: `${cat.color}20`,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}
              >
                <i className={cat.iconName} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{cat.label}</span>
              {cat.isCustom && (
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                  Custom
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                  opacity: index === 0 ? 0.3 : 1,
                }}
              >
                <i className="fa-solid fa-chevron-up" style={{ fontSize: '11px' }} />
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === categories.length - 1}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: index === categories.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: index === categories.length - 1 ? 0.3 : 1,
                }}
              >
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

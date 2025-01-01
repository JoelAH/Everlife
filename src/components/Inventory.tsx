import React from 'react';
import '../styles/Inventory.css';

interface InventoryProps {
  items: string[];
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  return (
    <div className="inventory">
      <h2>Inventory</h2>
      {items.length === 0 ? (
        <p>Your inventory is empty.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory;
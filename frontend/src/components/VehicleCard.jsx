import { useState } from 'react';
import { formatPrice } from '../utils/currency';
import './VehicleCard.css';

const GAUGE_CAP = 8; // reference "full lot" for the gauge ring — not a hard limit
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function StockGauge({ quantity, outOfStock, lowStock }) {
  const pct = Math.max(0, Math.min(quantity / GAUGE_CAP, 1));
  const offset = CIRCUMFERENCE * (1 - pct);
  const tone = outOfStock ? 'out' : lowStock ? 'low' : 'ok';

  return (
    <div className={`gauge gauge--${tone}`} role="img" aria-label={`${quantity} in stock`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={RADIUS} className="gauge-track" strokeWidth="5" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          className="gauge-value"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="gauge-number">{quantity}</span>
    </div>
  );
}

function CategoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 15.5 4.6 10a2 2 0 0 1 1.9-1.4h11a2 2 0 0 1 1.9 1.4L21 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2.2" y="15.3" width="19.6" height="4.4" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="19.7" r="1.6" fill="currentColor" />
      <circle cx="17" cy="19.7" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const [purchasing, setPurchasing] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockAmount, setRestockAmount] = useState(5);
  const [restocking, setRestocking] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const outOfStock = vehicle.quantity === 0;
  const lowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await onPurchase(vehicle.id);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    setRestocking(true);
    try {
      await onRestock(vehicle.id, Number(restockAmount));
      setRestockOpen(false);
    } finally {
      setRestocking(false);
    }
  };

  return (
    <div className={`vcard ${outOfStock ? 'vcard--sold' : ''}`}>
      {outOfStock && <div className="vcard-sold-flag">Sold out</div>}

      <div className="vcard-top">
        <div className="vcard-category">
          <CategoryIcon />
          <span className="vcard-category-label">Category:</span> {vehicle.category}
        </div>
        <StockGauge quantity={vehicle.quantity} outOfStock={outOfStock} lowStock={lowStock} />
      </div>

      <div className="vcard-body">
        <p className="vcard-make">{vehicle.make}</p>
        <h3 className="vcard-model">{vehicle.model}</h3>

        <div className="vcard-price">
          <span className="vcard-price-currency">₹</span>
          {formatPrice(vehicle.price)}
        </div>

        <div className={`vcard-stock vcard-stock--${outOfStock ? 'out' : lowStock ? 'low' : 'ok'}`}>
          <span className="vcard-stock-dot" />
          {outOfStock ? 'None in Inventory' : lowStock ? `Only ${vehicle.quantity} left in Inventory` : `Quantity in Inventory: ${vehicle.quantity}`}
        </div>

        <button
          className="vcard-purchase"
          disabled={outOfStock || purchasing}
          onClick={handlePurchase}
        >
          {outOfStock ? 'Unavailable' : purchasing ? 'Purchasing…' : 'Purchase'}
        </button>

        {isAdmin && (
          <div className="vcard-admin">
            <button
              type="button"
              className="vcard-admin-toggle"
              onClick={() => setAdminOpen((v) => !v)}
              aria-expanded={adminOpen}
            >
              Manage listing
              <span className={`vcard-chevron ${adminOpen ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
            </button>

            {adminOpen && (
              <div className="vcard-admin-panel">
                <div className="vcard-admin-row">
                  <button onClick={() => onEdit(vehicle)}>Edit</button>
                  <button onClick={() => setRestockOpen((v) => !v)}>Restock</button>
                  <button className="vcard-admin-delete" onClick={() => onDelete(vehicle)}>Delete</button>
                </div>

                {restockOpen && (
                  <form className="vcard-restock-form" onSubmit={handleRestock}>
                    <input
                      type="number"
                      min="1"
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(e.target.value)}
                      aria-label={`Restock amount for ${vehicle.make} ${vehicle.model}`}
                    />
                    <button type="submit" disabled={restocking}>
                      {restocking ? 'Adding…' : 'Add stock'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

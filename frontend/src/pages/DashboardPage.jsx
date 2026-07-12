import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Navbar from '../components/Navbar';
import SearchFilterBar from '../components/SearchFilterBar';
import VehicleCard from '../components/VehicleCard';
import VehicleFormModal from '../components/VehicleFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import Footer from '../components/Footer';
import { formatPrice } from '../utils/currency';
import './DashboardPage.css';

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const { notify } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const hasLoadedOnce = useRef(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchVehicles = useCallback(async (filters = {}) => {
    const isFiltered = Object.values(filters).some(Boolean);
    setHasActiveSearch(isFiltered);
    if (hasLoadedOnce.current) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const url = isFiltered ? '/vehicles/search' : '/vehicles';
      const { data } = await axiosInstance.get(url, { params: filters });
      setVehicles(data);
    } catch {
      notify('Could not load the inventory. Try refreshing.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
      hasLoadedOnce.current = true;
    }
  }, [notify]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const avgPrice = total
      ? vehicles.reduce((sum, v) => sum + Number(v.price || 0), 0) / total
      : 0;
    const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 2).length;
    const outOfStock = vehicles.filter((v) => v.quantity === 0).length;
    return { total, avgPrice, lowStock, outOfStock };
  }, [vehicles]);

  const handlePurchase = async (id) => {
    try {
      const { data } = await axiosInstance.post(`/vehicles/${id}/purchase`);
      setVehicles((prev) => prev.map((v) => (v.id === id ? data : v)));
      notify('Purchase complete. Enjoy the ride.');
    } catch (err) {
      notify(err.response?.data?.message || 'Could not complete the purchase.', 'error');
    }
  };

  const handleRestock = async (id, amount) => {
    try {
      const { data } = await axiosInstance.post(`/vehicles/${id}/restock`, { quantity: amount });
      setVehicles((prev) => prev.map((v) => (v.id === id ? data : v)));
      notify('Stock updated.');
    } catch (err) {
      notify(err.response?.data?.message || 'Could not restock this vehicle.', 'error');
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axiosInstance.delete(`/vehicles/${pendingDelete.id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== pendingDelete.id));
      notify('Vehicle removed from the inventory.');
      setPendingDelete(null);
    } catch (err) {
      notify(err.response?.data?.message || 'Could not remove this vehicle.', 'error');
    }
  };

  const openCreate = () => { setEditingVehicle(null); setFormOpen(true); };
  const openEdit = (vehicle) => { setEditingVehicle(vehicle); setFormOpen(true); };

  const handleSaved = (saved) => {
    setVehicles((prev) => {
      const exists = prev.some((v) => v.id === saved.id);
      return exists ? prev.map((v) => (v.id === saved.id ? saved : v)) : [saved, ...prev];
    });
    setFormOpen(false);
  };

  return (
    <div className="dashboard">
      <Navbar onAddVehicle={isAdmin ? openCreate : undefined} />

      <section className="dashboard-intro">
        <h1 className="dashboard-intro-title">Welcome to AutoVault</h1>
        <p className="dashboard-intro-copy">
          Browse everything currently in inventory in real time — new arrivals, live stock counts,
          and prices, all in one place. Use the search below to narrow it down.
        </p>
      </section>

      <SearchFilterBar onSearch={fetchVehicles} />

      {isAdmin && !loading && vehicles.length > 0 && (
        <div className="stats-console">
          <div className="stat-tile">
            <span className="stat-label">On the lot</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Average price</span>
            <span className="stat-value stat-value--mono">
              ₹{formatPrice(Math.round(stats.avgPrice))}
            </span>
          </div>
          <div className="stat-tile stat-tile--amber">
            <span className="stat-label">Low stock</span>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
          <div className="stat-tile stat-tile--ignition">
            <span className="stat-label">Sold out</span>
            <span className="stat-value">{stats.outOfStock}</span>
          </div>
        </div>
      )}

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <h1>Inventory</h1>
          {!loading && <span className="dashboard-count">{vehicles.length} listed</span>}
        </div>

        <div className={`vehicle-grid ${refreshing ? 'is-refreshing' : ''}`}>
          {loading ? (
            <Spinner label="Loading inventory" />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title={hasActiveSearch ? 'No matches' : 'The lot is empty'}
              message={
                hasActiveSearch
                  ? 'Nothing matches those filters. Try widening your search.'
                  : isAdmin
                    ? 'Add the first vehicle to get the lot started.'
                    : 'Check back soon — new inventory is added regularly.'
              }
              actionLabel={!hasActiveSearch && isAdmin ? '+ Add vehicle' : undefined}
              onAction={openCreate}
            />
          ) : (
            vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={openEdit}
                onDelete={setPendingDelete}
                onRestock={handleRestock}
              />
            ))
          )}
        </div>
      </main>

      {formOpen && (
        <VehicleFormModal
          vehicle={editingVehicle}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove this vehicle?"
          message={`${pendingDelete.make} ${pendingDelete.model} will be removed from the inventory. This can't be undone.`}
          confirmLabel="Remove"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Footer />
    </div>
  );
}

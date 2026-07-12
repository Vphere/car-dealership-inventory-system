import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance';
import { useToast } from '../hooks/useToast';
import './VehicleFormModal.css';

export default function VehicleFormModal({ vehicle, onClose, onSaved }) {
  const isEdit = Boolean(vehicle);
  const { notify } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      make: vehicle?.make || '',
      model: vehicle?.model || '',
      category: vehicle?.category || '',
      price: vehicle?.price ?? '',
      quantity: vehicle?.quantity ?? '',
    },
  });

  const handleClose = useCallback(() => {
    if (isDirty) {
      const discard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );

      if (!discard) return;
    }

    onClose();
  }, [isDirty, onClose]);

  // Close on Escape (with confirmation if form is dirty)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [handleClose]);

  const onSubmit = async (values) => {
    const payload = {
      make: values.make,
      model: values.model,
      category: values.category,
      price: Number(values.price),
      quantity: Number(values.quantity),
    };

    try {
      const { data } = isEdit
        ? await axiosInstance.put(`/vehicles/${vehicle.id}`, payload)
        : await axiosInstance.post('/vehicles', payload);

      notify(isEdit ? 'Vehicle updated.' : 'Vehicle added to AutoVault.');

      onSaved(data);
    } catch (err) {
      setError('root', {
        message:
          err.response?.data?.message || 'Could not save this vehicle.',
      });
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-form-title"
      >
        <p className="modal-eyebrow">
          {isEdit ? 'Edit listing' : 'New listing'}
        </p>

        <h2 id="vehicle-form-title">
          {isEdit
            ? `${vehicle.make} ${vehicle.model}`
            : 'Add a vehicle'}
        </h2>

        {errors.root && (
          <div className="modal-banner-error">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-grid">
            <div className="modal-field">
              <label htmlFor="make">Make</label>

              <input
                id="make"
                {...register('make', {
                  required: 'Required',
                })}
              />

              {errors.make && (
                <p className="modal-field-error">
                  {errors.make.message}
                </p>
              )}
            </div>

            <div className="modal-field">
              <label htmlFor="model">Model</label>

              <input
                id="model"
                {...register('model', {
                  required: 'Required',
                })}
              />

              {errors.model && (
                <p className="modal-field-error">
                  {errors.model.message}
                </p>
              )}
            </div>

            <div className="modal-field">
              <label htmlFor="category">Category</label>

              <input
                id="category"
                placeholder="Sedan, SUV, Truck…"
                {...register('category', {
                  required: 'Required',
                })}
              />

              {errors.category && (
                <p className="modal-field-error">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="modal-field">
              <label htmlFor="price">Price (₹)</label>

              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                {...register('price', {
                  required: 'Required',
                  min: {
                    value: 0.01,
                    message: 'Must be more than 0',
                  },
                })}
              />

              {errors.price && (
                <p className="modal-field-error">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="modal-field modal-field--full">
              <label htmlFor="quantity">
                Quantity in stock
              </label>

              <input
                id="quantity"
                type="number"
                min="0"
                {...register('quantity', {
                  required: 'Required',
                  min: {
                    value: 0,
                    message: 'Cannot be negative',
                  },
                })}
              />

              {errors.quantity && (
                <p className="modal-field-error">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-save"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving…'
                : isEdit
                ? 'Save changes'
                : 'Add vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLayout from "../admin/Layout";
import { updateInventory, getInventoryById } from "../../apis";
import { brandTypes, storageLocations } from "../../utils/padData";

const UpdateInventoryForm = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandType: "",
    quantitySupplied: "",
    supplierDonorName: "",
    dateReceived: "",
    storageLocation: "",
    staffInCharge: "",
    staffId: "",
    expiryDate: "",
    unitCost: "",
    notes: "",
    lowStockThreshold: "10",
  });





  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Fetch inventory data for prefill
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const res = await getInventoryById(id);
        console.log("getInventoryById", res);
        
        if (res?.data?.data?.inventory) {
          const inv = res.data.data.inventory;
          setFormData({
            brandType: inv.brandType || "",
            quantitySupplied: inv.quantitySupplied || "",
            supplierDonorName: inv.supplierDonorName || "",
            dateReceived: inv.dateReceived
              ? inv.dateReceived.split("T")[0]
              : "",
            storageLocation: inv.storageLocation || "",
            staffInCharge: inv.staffInCharge || "",
            staffId: inv.staffId || "",
            expiryDate: inv.expiryDate ? inv.expiryDate.split("T")[0] : "",
            unitCost: inv.unitCost || "",
            notes: inv.notes || "",
            lowStockThreshold: inv.lowStockThreshold || "10",
          });
        } else {
          alert("Inventory not found");
          navigate("/inventories");
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
        alert("Failed to load inventory details");
        navigate("/inventories");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateInventory(id, formData);

      if (response?.status === 200) {
        alert("Inventory updated successfully");
        navigate("/inventories");
      } else {
        alert(response?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Error updating inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="id-generator">
        <div className="id-generator__container">
          <div className="id-generator__header">
            <h2 className="id-generator__header-title">Update Inventory</h2>
            <p className="id-generator__header-subtitle">
              Modify details for this inventory stock
            </p>
          </div>

          <form onSubmit={handleSubmit} className="id-generator__form">
            <div className="id-generator__form-grid">
              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Brand/Type of Sanitary Pad
                </label>
                <select
                  name="brandType"
                  value={formData.brandType}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                >
                  <option value="">Select pad brand/type</option>
                  {brandTypes.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Quantity Supplied *
                </label>
                <input
                  type="number"
                  name="quantitySupplied"
                  placeholder="Enter quantity (pieces)"
                  value={formData.quantitySupplied}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  min="1"
                  required
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Supplier/Donor Name *
                </label>
                <input
                  type="text"
                  name="supplierDonorName"
                  placeholder="Enter supplier or donor name"
                  value={formData.supplierDonorName}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Date Received *</label>
                <input
                  type="date"
                  name="dateReceived"
                  value={formData.dateReceived}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Storage Location *
                </label>
                <select
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                >
                  <option value="">Select storage location</option>
                  {storageLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Person in Charge (Staff Name) *
                </label>
                <input
                  type="text"
                  name="staffInCharge"
                  placeholder="Enter staff member name"
                  value={formData.staffInCharge}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">Staff ID *</label>
                <input
                  type="text"
                  name="staffId"
                  placeholder="Enter staff ID"
                  value={formData.staffId}
                  onChange={handleChange}
                  className="id-generator__form-input"
                  required
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Unit Cost (Optional)
                </label>
                <input
                  type="number"
                  name="unitCost"
                  placeholder="0.00"
                  value={formData.unitCost}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Low Stock Threshold
                </label>
                <input
                  type="text"
                  name="lowStockThreshold"
                  placeholder="10"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>

              <div className="id-generator__form-group">
                <label className="id-generator__form-label">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  placeholder="Enter any additional notes or comments..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="id-generator__form-input"
                />
              </div>
            </div>

            <div className="id-generator__actions">
              <button
                type="submit"
                className="id-generator__actions-register"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Inventory"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateInventoryForm;

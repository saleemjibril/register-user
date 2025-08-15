import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLayout from "../admin/Layout";
import { createInventoryEntry } from "../../apis";
import { brandTypes, storageLocations } from "../../utils/padData";

const InventoryEntryForm = () => {
    const auth = useSelector((state) => state.auth);

    console.log("auth", auth);
    
    const navigate = useNavigate();

    const [loading, setLoading] = useState (false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        brandType: '',
        quantitySupplied: '',
        supplierDonorName: '',
        dateReceived: '',
        storageLocation: '',
        staffInCharge: '',
        staffId: '',
        expiryDate: '',
        unitCost: '',
        notes: '',
        lowStockThreshold: '10'
    });



    useEffect(() => {
        if (!auth?.token) {
            navigate('/login');
        }
    }, [])

    // Auto-generate Pad Batch ID when component mounts
    useEffect(() => {
        generateBatchId();
    }, []);

    const generateBatchId = () => {
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const batchId = `PB-${timestamp}-${randomNum}`;
        setFormData(prev => ({
            ...prev,
            padBatchId: batchId
        }));
    };

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
            console.log("formData", formData);

            const response = await createInventoryEntry(formData);

            if (response?.data?.inventory?._id) {
                alert("Inventory entry created successfully");
                // Reset form after successful submission
                setFormData({
                    brandType: '',
                    quantitySupplied: '',
                    supplierDonorName: '',
                    dateReceived: '',
                    storageLocation: '',
                    staffInCharge: '',
                    staffId: '',
                    expiryDate: '',
                    unitCost: '',
                    notes: '',
                    lowStockThreshold: '10'
                });
                navigate(`/inventories`);
                // Generate new batch ID for next entry
                // generateBatchId();
            } else {
                if (response?.data?.message) {
                    alert(response?.data?.message);
                } else {
                    alert("Inventory entry creation failed");
                }
            }
        } catch (error) {
            console.error("Error creating inventory entry:", error);
            alert("Error creating inventory entry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="id-generator">
                <div className="id-generator__container">
                    <div className="id-generator__header">
                        <h2 className="id-generator__header-title">Pad Inventory Entry</h2>
                        <p className="id-generator__header-subtitle">
                            Enter details for new pad inventory stock
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="id-generator__form">
                        <div className="id-generator__form-grid">
                            {/* <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Pad Batch ID</label>
                                <input
                                    type="text"
                                    name="padBatchId"
                                    placeholder="Auto-generated batch ID"
                                    value={formData.padBatchId}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    readOnly
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                                <small style={{ color: '#666', fontSize: '0.8em' }}>
                                    Auto-generated unique ID for this batch
                                </small>
                            </div> */}

                            <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Brand/Type of Sanitary Pad</label>
                                <select
                                    name="brandType"
                                    value={formData.brandType}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    required
                                >
                                    <option value="">Select pad brand/type</option>
                                    {brandTypes.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Quantity Supplied *</label>
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
                                <label className="id-generator__form-label"> Supplier/Donor Name *</label>
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
                                <label className="id-generator__form-label"> Date Received *</label>
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
                                <label className="id-generator__form-label">Storage Location *</label>
                                <select
                                    name="storageLocation"
                                    value={formData.storageLocation}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    required
                                >
                                     <option value="">Select storage location</option>
                  {storageLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                                </select>
                            </div>

                            <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Person in Charge (Staff Name) *</label>
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
                                <label className="id-generator__form-label">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    // required
                                />
                            </div>

                            <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Unit Cost (Optional)</label>
                                <input
                                    type="number"
                                    name="unitCost"
                                    placeholder="0.00"
                                    value={formData.unitCost}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    // required
                                />
                            </div>
                            <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Low Stock Threshold</label>
                                <input
                                    type="text"
                                    name="unitCost"
                                    placeholder="10"
                                    value={formData.lowStockThreshold}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    // required
                                />
                            </div>
                            <div className="id-generator__form-group">
                                <label className="id-generator__form-label">Notes (Optional)</label>
                                <textarea
                                    type="text"
                                    name="unitCost"
                                    placeholder="Enter any additional notes or comments..."
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="id-generator__form-input"
                                    // required
                                />
                            </div>
                        </div>

                        <div className="id-generator__actions">
                            {/* <button
                                type="button"
                                onClick={generateBatchId}
                                className="id-generator__actions-download"
                                disabled={loading}
                            >
                                Generate New Batch ID
                            </button> */}

                            <button
                                type="submit"
                                className="id-generator__actions-register"
                                disabled={loading}
                            >
                                {loading ? "Creating Entry..." : "Create Inventory Entry"}
                            </button>
                        </div>
                    </form>

                    {/* <div className="id-generator__info">
            <h3>Inventory Entry Guidelines:</h3>
            <ul style={{ textAlign: 'left', marginTop: '10px' }}>
              <li>• Batch ID is automatically generated for each delivery lot</li>
              <li>• Ensure accurate quantity count before entry</li>
              <li>• Record the actual date when pads were received</li>
              <li>• Verify storage location capacity before assignment</li>
              <li>• Staff in charge should be authorized personnel only</li>
              <li>• Keep physical records as backup documentation</li>
            </ul>
          </div> */}
                </div>
            </div>
        </AdminLayout>
    );
};

export default InventoryEntryForm;
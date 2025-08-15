import React, { useState, useEffect } from 'react';
import {
  Package, Search, Filter, Download, Plus, Edit, Trash2,
  AlertTriangle, CheckCircle, XCircle, Clock, Eye,
  ChevronLeft, ChevronRight, RefreshCw, MapPin, User
} from 'lucide-react';
import { getAllInventory } from '../../apis';
import AdminLayout from './Layout';
import { useNavigate } from 'react-router-dom';

const InventoryTrackingPage = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const handleGetAllInventory = async () => {
    setLoading(true);
    try {
      const response = await getAllInventory({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        brandType: brandFilter,
        storageLocation: locationFilter,
        isLowStock: lowStockFilter === 'yes' ? true : lowStockFilter === 'no' ? false : undefined,
        search: searchTerm
      });

      if (response?.data?.data?.inventory) {
        setInventory(response.data.data.inventory);
        setFilteredInventory(response.data.data.inventory);
        setTotalPages(response?.data?.data?.pagination?.totalPages || Math.ceil(filteredInventory.length / itemsPerPage))

        // Create summary from real data
        const inventory = response.data.data.inventory;
        const summary = {
          totalBatches: inventory.length,
          totalSupplied: inventory.reduce((sum, item) => sum + item.quantitySupplied, 0),
          totalCurrentStock: inventory.reduce((sum, item) => sum + item.currentStock, 0),
          totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
          activeBatches: inventory.filter(item => item.status === 'active').length,
          depletedBatches: inventory.filter(item => item.status === 'depleted').length,
          expiredBatches: inventory.filter(item => item.status === 'expired').length,
          lowStockBatches: inventory.filter(item => item.isLowStock).length
        };
        setSummary(summary);
      }
    } catch (error) {
      console.error("Fetch inventory error:", error);
    } finally {
      setLoading(false);
    }
  };





  const brandTypes = ['Always Ultra', 'Whisper Choice', 'Stayfree', 'Kotex', 'Carefree', 'Generic Brand', 'Donated Pads', 'Other'];
  const storageLocations = ['School Clinic', 'Designated Pad Bank Room', 'Administrative Office', 'Nurse\'s Office', 'Girls\' Changing Room', 'Main Storage Room', 'Other'];

  useEffect(() => {
    handleGetAllInventory();
  }, []);

  // Add another useEffect to refetch when filters change
  useEffect(() => {
    if (searchTerm || statusFilter || brandFilter || locationFilter || lowStockFilter) {
      handleGetAllInventory();
    }
  }, [searchTerm, statusFilter, brandFilter, locationFilter, lowStockFilter, currentPage]);


  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'depleted':
        return <XCircle className="text-red-500" size={16} />;
      case 'expired':
        return <Clock className="text-orange-500" size={16} />;
      default:
        return <AlertTriangle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'depleted':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateStockPercentage = (current, supplied) => {
    return supplied > 0 ? Math.round((current / supplied) * 100) : 0;
  };

  const refreshData = () => {
    handleGetAllInventory();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="users-list">
        {/* Header Section */}
        <header className="users-list__header">
          <h2 className="users-list__title">Inventory Tracking</h2>

          <div className="users-list__search-wrapper">
            {/* <h2 className="users-list__registered">
              Registered users:{" "}
              {loading ? "Loading..." : <span>{filteredUsers}</span>}
            </h2> */}

            <input
              type="text"
              placeholder="Search by batch ID, brand, supplier, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="users-list__search-type"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="users-list__search-type"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="depleted">Depleted</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="users-list__search-type"
            >
              <option value="">All Brands</option>
              {brandTypes.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="users-list__search-type"
            >
              <option value="">All Locations</option>
              {storageLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={lowStockFilter}
              onChange={(e) => setLowStockFilter(e.target.value)}
              className="users-list__search-type"
            >
              <option value="">All Stock Levels</option>
              <option value="yes">Low Stock Only</option>
              <option value="no">Normal Stock</option>
            </select>


          </div>
        </header>

        <button
          // onClick={handleExportExcel}
          className="users-list__add-button"
          style={{ marginLeft: "10px" }}
          disabled={excelLoading}
        >
          {excelLoading ? "Loading..." : "Export to Excel"}
          {/* Users Table */}
        </button>
        <br />
        <br />

      
          {/* Summary Cards */}
          {summary && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <Package className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Total Batches</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalBatches}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <CheckCircle className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Current Stock</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalCurrentStock.toLocaleString()}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <AlertTriangle className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold text-gray-900">{summary.lowStockBatches}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#d9b34e20' }}>
          <Package className="text-[#d9b34e]" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">₦{summary.totalValue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
)}
        <div className="users-list__table-container">
          {isSearching ? (
            <div className="users-list__loading">Searching...</div>
          ) : (
            <>
              <table className="users-list__table">
                <thead>
                  <tr>
                    <th>
                      Batch Info
                    </th>
                    <th>
                      Stock Status
                    </th>
                    <th>
                      Location & Staff
                    </th>
                    <th>
                      Dates
                    </th>
                    <th>
                      Value
                    </th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                {currentItems.map((item) => {
              const stockPercentage = calculateStockPercentage(item.currentStock, item.quantitySupplied);
              
              return (
                <tr key={item._id} className="hover:bg-gray-50" >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-lg font-medium text-gray-900">{item.padBatchId}</div>
                      <div className="text-lg text-gray-500">{item.brandType}</div>
                      <div className="text-xs text-gray-400">{item.supplierDonorName}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(item.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="text-lg font-medium text-gray-900">
                        {item.currentStock} / {item.quantitySupplied}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            stockPercentage <= 20 ? 'bg-red-500' : 
                            stockPercentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{stockPercentage}% remaining</div>
                      {item.isLowStock && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                          <AlertTriangle size={10} className="mr-1" />
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-lg text-gray-900">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {item.storageLocation}
                    </div>
                    <div className="flex items-center text-lg text-gray-500 mt-1">
                      <User size={14} className="mr-1 text-gray-400" />
                      {item.staffInCharge}
                    </div>
                    <div className="text-xs text-gray-400">ID: {item.staffId}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                    <div>Received: {formatDate(item.dateReceived)}</div>
                    {item.expiryDate && (
                      <div>Expires: {formatDate(item.expiryDate)}</div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                    {item.unitCost > 0 ? (
                      <div>
                        <div>${item.unitCost.toFixed(2)} each</div>
                        <div className="text-lg font-medium">${item.totalValue.toFixed(2)} total</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Donated</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900"
                      onClick={() => navigate(`/inventory/${item._id}`)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
                </tbody>
              </table>

             {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-lg text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInventory.length)} of {filteredInventory.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-md text-lg ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
            </>
          )}
        </div>

         {/* Details Modal */}
    {showDetailsModal && selectedItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Details</h3>
            <p className="text-lg text-gray-600 mt-1">{selectedItem.padBatchId}</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <div className="space-y-2 text-lg">
                  <div><span className="font-medium">Brand:</span> {selectedItem.brandType}</div>
                  <div><span className="font-medium">Supplier:</span> {selectedItem.supplierDonorName}</div>
                  <div><span className="font-medium">Quantity Supplied:</span> {selectedItem.quantitySupplied}</div>
                  <div><span className="font-medium">Current Stock:</span> {selectedItem.currentStock}</div>
                  <div><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location & Staff</h4>
                <div className="space-y-2 text-lg">
                  <div><span className="font-medium">Storage Location:</span> {selectedItem.storageLocation}</div>
                  <div><span className="font-medium">Staff in Charge:</span> {selectedItem.staffInCharge}</div>
                  <div><span className="font-medium">Staff ID:</span> {selectedItem.staffId}</div>
                  <div><span className="font-medium">Date Received:</span> {formatDate(selectedItem.dateReceived)}</div>
                  {selectedItem.expiryDate && (
                    <div><span className="font-medium">Expiry Date:</span> {formatDate(selectedItem.expiryDate)}</div>
                  )}
                </div>
              </div>
            </div>
            
            {selectedItem.distributionRecords && selectedItem.distributionRecords.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recent Distributions</h4>
                <div className="space-y-2">
                  {selectedItem.distributionRecords.slice(0, 5).map((record, index) => (
                    <div key={index} className="flex justify-between items-center text-lg bg-gray-50 p-2 rounded">
                      <span>{record.userName}</span>
                      <span>{record.quantityDistributed} pad(s)</span>
                      <span className="text-gray-500">{formatDate(record.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && selectedItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete inventory batch "{selectedItem.padBatchId}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete logic here
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
      </div>
    </AdminLayout>
  );
};

export default InventoryTrackingPage;
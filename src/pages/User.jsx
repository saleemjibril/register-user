import React, { useEffect, useState } from "react";
import { getUser, getUsers } from "../apis";
import { useParams } from "react-router-dom";

const IDCardDisplay = () => {
  const pathname = useParams();

  const [user, setUser] = useState(null)

  const handleGetUser = async () => {
    const response2 = await getUsers();
    const response = await getUser(pathname?.id);
    setUser(response?.data)
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-lg">
        <div className="bg-gray-50 rounded-xl p-4 md:p-8 border-2 border-gray-200">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between pb-4 md:pb-6 mb-4 md:mb-6 border-b-2 border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 md:mb-0 text-center md:text-left w-full">
              COMPANY-NAME
            </h1>
          </div>

          {/* User Info */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-4 md:mb-8">
            {/* Profile Image */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
              <img
                src={user?.photo}
                alt={user?.name}
                className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-lg border-4 border-gray-200"
              />
            </div>

            {/* User Details */}
            <div className="w-full md:w-2/3 space-y-3 md:space-y-4 text-center md:text-left">
              <div>
                <label className="block text-xs md:text-sm text-gray-500">FULL NAME</label>
                <p className="text-lg md:text-xl font-semibold text-gray-800">
                  {user?.name}
                </p>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-gray-500">ID NUMBER</label>
                <p className="text-lg md:text-xl font-semibold text-gray-800">
                  {user?._id}
                </p>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-gray-500">ISSUED DATE</label>
                <p className="text-lg md:text-xl font-semibold text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t-2 border-gray-200">
            <div className="text-xs md:text-sm text-gray-500 mb-4 md:mb-0 text-center md:text-left w-full">
              <p>This ID card is property of Company Name.</p>
              <p>If found, please return to nearest office.</p>
            </div>
            <div className="flex justify-center md:justify-end w-full">
              <img 
                src={user?.qrCodeUrl} 
                alt="QR Code" 
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardDisplay;
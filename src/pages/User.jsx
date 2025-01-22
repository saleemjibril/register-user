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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
        <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl font-bold text-blue-600">COMPANY NAME</h1>
        </div>

        <div className="flex gap-8 mb-8">
          <div className="w-1/3">
            <img
              src={user?.photo}
              alt={user?.name}
              className="w-48 h-48 object-cover rounded-lg border-4 border-gray-200"
            />
          </div>

          <div className="w-2/3 space-y-4">
            <div>
              <label className="text-sm text-gray-500">FULL NAME</label>
              <p className="text-xl font-semibold text-gray-800">
                {user?.name}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">ID NUMBER</label>
              <p className="text-xl font-semibold text-gray-800">
                {user?.id}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">ISSUED DATE</label>
              <p className="text-xl font-semibold text-gray-800">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
          <div className="text-sm text-gray-500">
            <p>This ID card is property of Company Name.</p>
            <p>If found, please return to nearest office.</p>
          </div>
          <img src={user?.qrCodeUrl} alt="QR Code" className="w-24 h-24" />
        </div>
      </div>
    </div>
  );
};

export default IDCardDisplay;

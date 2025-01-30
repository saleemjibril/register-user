import React, { useState, useEffect, useCallback } from "react";
import { updateUser } from "../apis";
import { useNavigate } from "react-router-dom";

const FingerprintScannerComponent = ({ user }) => {
  const navigate = useNavigate();
  const [selectedReader, setSelectedReader] = useState("");
  const [selectedFinger, setSelectedFinger] = useState("");
  const [acquisitionStarted, setAcquisitionStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [quality, setQuality] = useState("");
  const [readers, setReaders] = useState([]);
  const [currentFormat] = useState("PngImage");
  const [sdk, setSdk] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [leftThumb, setLeftThumb] = useState("");
  const [rightThumb, setRightThumb] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const fingerOptions = [
    { value: "leftThumb", label: "Left Thumb" },
    { value: "rightThumb", label: "Right Thumb" },
  ];

  const handleSampleAcquired = useCallback(
    (sample) => {
      if (currentFormat === "PngImage") {
        const samples = JSON.parse(sample.samples);
        const imageSrc =
          "data:image/png;base64," + window.Fingerprint.b64UrlTo64(samples[0]);

        if (selectedFinger === "leftThumb") {
          setLeftThumb(imageSrc);
        } else if (selectedFinger === "rightThumb") {
          setRightThumb(imageSrc);
        }

        stopCapture();
        setStatus(
          `${
            selectedFinger === "leftThumb" ? "Left" : "Right"
          } thumb captured successfully!`
        );
      }
    },
    [selectedFinger, currentFormat]
  );

  const populateReaders = useCallback(async () => {
    if (!sdk) {
      console.log("no sdk", sdk);

      return;
    }

    try {
      const readersList = await sdk.enumerateDevices();
      setReaders(readersList);

      if (readersList.length === 1) {
        setSelectedReader(readersList[0]);
      } else if (readersList.length === 0) {
        setStatus("No reader detected. Please connect a reader.");
      }
    } catch (error) {
      setStatus(error.message);
    }
  }, [sdk]);

  const startCapture = async () => {
    console.log("selectedFinger", selectedFinger);

    if (!sdk || acquisitionStarted || !selectedReader || !selectedFinger) {
      if (!selectedFinger) {
        setStatus("Please select a finger before starting scan");
      }
      return;
    }

    try {
      await sdk.startAcquisition(
        window.Fingerprint.SampleFormat[currentFormat],
        selectedReader
      );
      setAcquisitionStarted(true);
      setStatus(
        `Scanning ${
          selectedFinger === "leftThumb" ? "left thumb" : "right thumb"
        }...`
      );
    } catch (error) {
      setStatus(error.message);
    }
  };

  const stopCapture = async () => {
    if (!sdk || !acquisitionStarted) return;

    try {
      await sdk.stopAcquisition();
      setAcquisitionStarted(false);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleUpload = async () => {
    if (!leftThumb || !rightThumb) {
      alert("Please capture both thumbprints before uploading");
      return;
    }

    setUploadLoading(true);
    try {
      const response = await updateUser(user?._id, {
        leftFingerPrint: leftThumb,
        rightFingerPrint: rightThumb,
      });

      console.log("updateUser", response);

      //   const leftThumbUpload = await fileUpload(
      //     dataURLtoFile(leftThumb, 'left-thumb.png'),
      //     setLeftThumb,
      //     () => {}
      //   );

      //   const rightThumbUpload = await fileUpload(
      //     dataURLtoFile(rightThumb, 'right-thumb.png'),
      //     setRightThumb,
      //     () => {}
      //   );

      //   console.log('Uploaded fingerprints:', {
      //     leftThumbUpload,
      //     rightThumbUpload,
      //     leftThumb,
      //     rightThumb
      //   });

      setStatus("Fingerprints uploaded successfully!");
      alert("Fingerprints uploaded successfully!");
      navigate(`/admin/users/${user._id}`);
    } catch (error) {
      setStatus("Error uploading fingerprints");
      console.error(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const clearScans = () => {
    setLeftThumb("");
    setRightThumb("");
    setSelectedFinger("");
    setStatus("Scans cleared. Ready to start new capture.");
  };

  useEffect(() => {
    if (window.Fingerprint) {
      const newSdk = new window.Fingerprint.WebApi();

      newSdk.onDeviceConnected = () => {
        setStatus("Device connected. Select a finger and press Start Scan");
      };

      newSdk.onDeviceDisconnected = () => {
        setStatus("Device disconnected");
      };

      newSdk.onCommunicationFailed = () => {
        setStatus("Communication Failed");
      };

      newSdk.onSamplesAcquired = (s) => {
        handleSampleAcquired(s);
      };

      newSdk.onQualityReported = (e) => {
        setQuality(window.Fingerprint.QualityCode[e.quality]);
      };

      newSdk.onSamplesAcquired = (s) => {
        handleSampleAcquired(s);
      };

      setSdk(newSdk);
      populateReaders();
    }

    return () => {
      if (sdk) {
        stopCapture();
      }
    };
  }, [handleSampleAcquired]);

  return (
    <div className="fingerprint__container p-4">
      {user && (
        <>
          <h2 className="text-xl font-bold mb-4">Fingerprint Scanner</h2>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Reader
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedReader}
                onChange={(e) => setSelectedReader(e.target.value)}
              >
                <option value="">Select Reader</option>
                {readers?.map((reader) => (
                  <option key={reader} value={reader}>
                    Digital Persona ({reader})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Finger
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedFinger}
                onChange={(e) => setSelectedFinger(e.target.value)}
                disabled={acquisitionStarted}
              >
                <option value="">Select Finger</option>
                {fingerOptions?.map((finger) => (
                  <option key={finger.value} value={finger.value}>
                    {finger.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Left Thumb</h3>
              {leftThumb ? (
                <img src={leftThumb} alt="Left Thumb" className="w-full mb-2" />
              ) : (
                <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-500">
                  No scan yet
                </div>
              )}
            </div>

            <div className="border p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Right Thumb</h3>
              {rightThumb ? (
                <img
                  src={rightThumb}
                  alt="Right Thumb"
                  className="w-full mb-2"
                />
              ) : (
                <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-500">
                  No scan yet
                </div>
              )}
            </div>
          </div>

          {status && (
            <div className="bg-blue-100 p-2 rounded mb-4 text-center">
              {status}
            </div>
          )}

          {quality && (
            <div className="bg-gray-100 p-2 rounded mb-4 text-center">
              Scan Quality: {quality}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              onClick={populateReaders}
              disabled={acquisitionStarted || uploadLoading}
            >
              Refresh Readers
            </button>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              onClick={startCapture}
              disabled={
                acquisitionStarted ||
                uploadLoading ||
                !selectedFinger ||
                !selectedReader
              }
            >
              Start Scan
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              onClick={stopCapture}
              disabled={!acquisitionStarted || uploadLoading}
            >
              Stop Scan
            </button>

            <button
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              onClick={clearScans}
              disabled={uploadLoading || (!leftThumb && !rightThumb)}
            >
              Clear All
            </button>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              onClick={handleUpload}
              disabled={!leftThumb || !rightThumb || uploadLoading}
            >
              {uploadLoading ? "Uploading..." : "Upload Fingerprints"}
            </button>
          </div>
          <br />
          <br />

          <div className="id-generator__form-grid">
          <div className="id-generator__form-info">
                  <label className="id-generator__form-label">User ID</label>
                  <div className="id-generator__form-value">{user?.userId}</div>
                </div>
                
            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Full Name</label>
              <div className="id-generator__form-value">{user?.names}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Email</label>
              <div className="id-generator__form-value">{user?.email}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Community</label>
              <div className="id-generator__form-value">{user?.community}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Limited</label>
              <div className="id-generator__form-value">{user?.limited}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">District</label>
              <div className="id-generator__form-value">{user?.district}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">LGA</label>
              <div className="id-generator__form-value">{user?.lga}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">State</label>
              <div className="id-generator__form-value">{user?.state}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Phone Number</label>
              <div className="id-generator__form-value">
                {user?.phoneNumber}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Age</label>
              <div className="id-generator__form-value">{user?.age}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Sex</label>
              <div className="id-generator__form-value">{user?.sex}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">
                Degree Qualifications
              </label>
              <div className="id-generator__form-value">
                {user?.degreeQualifications}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Languages</label>
              <div className="id-generator__form-value">
                {user?.languagesSpokenAndWritten}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Disability</label>
              <div className="id-generator__form-value">{user?.disability}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Religion</label>
              <div className="id-generator__form-value">{user?.religion}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">
                Birth Certificate
              </label>
              <div className="id-generator__form-value">
                {user?.birthCertificateCheck}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">ID Type</label>
              <div className="id-generator__form-value">{user?.idType}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">ID Number</label>
              <div className="id-generator__form-value">{user?.idNumber}</div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Qualification</label>
              <div className="id-generator__form-value">
                {user?.qualification}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">
                Physical Fitness
              </label>
              <div className="id-generator__form-value">
                {user?.physicalFitness}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Availability</label>
              <div className="id-generator__form-value">
                {user?.availability}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">
                Health Condition
              </label>
              <div className="id-generator__form-value">
                {user?.preExistingHealthCondition}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Nursing Mother</label>
              <div className="id-generator__form-value">
                {user?.nursingMother}
              </div>
            </div>

            <div className="id-generator__form-info">
              <label className="id-generator__form-label">Remark</label>
              <div className="id-generator__form-value">{user?.remark}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FingerprintScannerComponent;

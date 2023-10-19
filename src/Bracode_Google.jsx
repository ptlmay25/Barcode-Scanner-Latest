import { useState, useEffect } from "react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

function Barcode_Google() {
  const [hasPermission, setHasPermission] = useState();
  const [scannedCode, setScannedCode] = useState([]);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermissions();
    setHasPermission(status.camera === "granted");
  };

  const requestPermission = async () => {
    const status = await BarcodeScanner.requestPermissions();
    setHasPermission(status.camera === "granted");
  };

  const isGoogleBarcodeScannerModuleAvailable = async () => {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return available;
  };

  const installGoogleBarcodeScannerModule = async () => {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
    scan();
  };

  const scan = async () => {
    const { barcodes } = await BarcodeScanner.scan({});

    console.log(barcodes);
    setScannedCode(barcodes[0].rawValue);
  };

  const scanbarcode = () => {
    if (isGoogleBarcodeScannerModuleAvailable !== null || "") {
      scan();
    } else {
      installGoogleBarcodeScannerModule();
    }
  };

  return (
    <div>
      {!hasPermission && (
        <button onClick={requestPermission}>Request Camera Access</button>
      )}

      {hasPermission && (
        <>
          <button onClick={scanbarcode}>Start Scan</button>
          {/* <button onClick={stopScan}>Stop Scan</button> */}
        </>
      )}

      {scannedCode && <p>Scanned Code: {scannedCode}</p>}
    </div>
  );
}

export default Barcode_Google;

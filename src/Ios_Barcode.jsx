import { useState, useEffect } from "react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

function Ios_Scan() {
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

  //--------------- scan barcode code ---------------------------

  const scanSingleBarcode = async () => {
    return new Promise(async (resolve) => {
      document.querySelector("body")?.classList.add("barcode-scanner-active");

      const listener = await BarcodeScanner.addListener(
        "barcodeScanned",
        async (result) => {
          await listener.remove();
          document
            .querySelector("body")
            ?.classList.remove("barcode-scanner-active");
          await BarcodeScanner.stopScan();
          resolve(result.barcode);
          setScannedCode(result.barcode.rawValue);
          console.log(result);
        }
      );

      await BarcodeScanner.startScan();
    });
  };

  return (
    <div>
      {!hasPermission && (
        <button onClick={requestPermission}>Request Camera Access</button>
      )}

      {hasPermission && (
        <>
          <button onClick={scanSingleBarcode}>Start Scan</button>
          {/* <button onClick={scanbarcode}>Start Scan</button> */}
          {/* <button onClick={stopScan}>Stop Scan</button> */}
        </>
      )}

      {scannedCode && <p>Scanned Code: {scannedCode}</p>}
    </div>
  );
}

export default Ios_Scan;

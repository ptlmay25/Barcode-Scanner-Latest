import { useState, useEffect } from "react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";

function App() {
  const [hasPermission, setHasPermission] = useState("");
  const [scannedCode, setScannedCode] = useState([]);

  //--------------------- platform info IOS or android --------------

  const platform = async () => {
    if (Capacitor.getPlatform() === "ios") {
      console.log("iOS!");
    } else if (Capacitor.getPlatform() === "android") {
      console.log("Android!");
    } else {
      console.log("Web!");
    }
  };

  //------------ device info -----------------------

  const logDeviceInfo = async () => {
    const info = await Device.getInfo();
    console.log(info);
  };

  //--------- Biometric authentication ------------

  const bioauth = async () => {
    const { isAvailable } = await BiometricAuth.checkBiometry(); // check avalibe biometric types
    if (isAvailable === true) {
      const BioOptions = {
        reason: "For authentication",
        cancelTitle: "Cancel",
        allowDeviceCredential: true,
      };
      try {
        await BiometricAuth.authenticate(BioOptions); // call auth function using device credential
        // Authentication was successful
        return true;
      } catch (error) {
        if (error.code === "userCancel") {
          console.log("Biometric authentication was canceled by the user.");
        } else {
          console.error("Biometric authentication failed:", error);
        }
        // Authentication failed
        return false;
      }
    } else {
      return false; // Biometry is not available
    }
  };

  // const bioauth = async () => {
  //   const { isAvailable } = await BiometricAuth.checkBiometry();
  //   if (isAvailable === true) {
  //     const BioOptions = {
  //       reason: "For authentication",
  //       cancelTitle: "Cancel",
  //       allowDeviceCredential: true,
  //     };
  //     try {
  //       await BiometricAuth.authenticate(BioOptions);
  //       return true; // Resolving the Promise with a value (e.g., true)
  //     } catch (error) {
  //       if (error.code === "userCancel") {
  //         console.log("Biometric authentication was canceled by the user.");
  //         return false; // Resolving the Promise with a value (e.g., false)
  //       } else {
  //         console.error("Biometric authentication failed:", error);
  //         throw error; // Propagate other errors
  //       }
  //     }
  //   } else {
  //     return false; // Resolving the Promise with a value (e.g., false)
  //   }
  // };

  useEffect(() => {
    platform(); //--------- android or IOS
    checkPermission(); // camera permission
    logDeviceInfo(); // device info
    //  call bioauth to handle the Promise result
    bioauth().then((result) => {
      if (result === true) {
        console.log("Biometric authentication was successful");
      }
    });

    const installGoogleBarcodeScannerModule = async () => {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    };
    installGoogleBarcodeScannerModule();
  }, []);

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermissions();
    setHasPermission(status.camera === "granted");
  };

  const requestPermission = async () => {
    const status = await BarcodeScanner.requestPermissions();
    setHasPermission(status.camera === "granted");
  };

  // ------------------- scan  code for Android device ------------------------

  //----- check google model available or not -----

  const isGoogleBarcodeScannerModuleAvailable = async () => {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return available;
  };

  //----- if not install google model available or not -----

  const installGoogleBarcodeScannerModule = async () => {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
    // scan();
  };

  //----------- scan code ----------
  const scan = async () => {
    const { barcodes } = await BarcodeScanner.scan({});

    console.log(barcodes);
    setScannedCode(barcodes[0].rawValue);
  };

  //------ check scan condtions ---------------

  // const scanbarcode = () => {
  //   if (isGoogleBarcodeScannerModuleAvailable !== null || "") {
  //     scan();
  //   } else {
  //     installGoogleBarcodeScannerModule();
  //   }
  // };

  const scanbarcode = async () => {
    const isGoogleModuleAvailable =
      await isGoogleBarcodeScannerModuleAvailable();

    if (isGoogleModuleAvailable !== null || "") {
      scan();
    } else {
      installGoogleBarcodeScannerModule();
      scan();
    }
  };

  // ------------------- scan  code for IOS & other device ------------------------

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
          {/* <button onClick={scanSingleBarcode}>Start Scan</button> */}
          <button onClick={scanbarcode}>Ggoole barcode Scan</button>
          <button onClick={scanSingleBarcode}>Universal barcode Scan</button>
          {/* <button onClick={stopScan}>Stop Scan</button> */}
        </>
      )}

      {scannedCode && <a href={scannedCode}>Scanned Code: {scannedCode}</a>}
    </div>
  );
}

export default App;

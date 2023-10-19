import { useState } from "react";
import qrcode from "qrcode";

export default function App() {
  const [qr, setQr] = useState();

  const generateQrCode = async () => {
    const svg = await qrcode.toString("https://www.example.com", {
      type: "svg",
    });

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    setQr(url);
  };

  return (
    <div>
      <button onClick={generateQrCode}>Generate QR Code</button>

      {qr && <img src={qr} />}

      {qr && (
        <a download="qrcode.svg" href={qr}>
          Download SVG
        </a>
      )}
    </div>
  );
}

import { useState } from "react";
import qrcode from "qrcode";

export default function Input_QrCode() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState();

  const generateQrCode = async () => {
    const svg = await qrcode.toString(text, { type: "svg" });
    const png = await qrcode.toDataURL(text, { width: 512, height: 512 }); // increase size of png file for high quality

    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    setQr({
      svg: svgUrl,
      png,
    });
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />

      <button onClick={generateQrCode}>Generate QR Code</button>

      {qr && <img src={qr.png} />}

      {qr && (
        <>
          <a download="qrcode.png" href={qr.png}>
            Download PNG
          </a>

          <a download="qrcode.svg" href={qr.svg}>
            Download SVG
          </a>
        </>
      )}
    </div>
  );
}

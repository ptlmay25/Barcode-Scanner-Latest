import React, { useEffect } from "react";
import { Browser } from "@capacitor/browser";

const InApp_Browser = () => {
  const openLink =
    "upi://pay?pa=2235545@oksbi&pn=help&am=100&tn=dasdsadas&cu=INR";
  // "https://rzp.io/i/nVZJFlr6";
  //   const opnepage = InAppBrowser.open(openLink);

  const openCapacitorSite = async () => {
    await Browser.open({ url: "https://rzp.io/i/nVZJFlr6" });
  };

  useEffect(() => {
    console.log("open wbesite");
    openCapacitorSite();
    // window.location.href = openLink;
  }, []);

  return (
    <>
      <div>Browser</div>
      <a href="upi://pay?pa=2235545@oksbi&pn=help&am=100&tn=dasdsadas&cu=INR">
        click
      </a>
      {/* <a href="https://rzp.io/i/3PBQ7d4b">click</a> */}
    </>
  );
};

export default InApp_Browser;

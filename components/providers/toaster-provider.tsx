"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      toastOptions={{
        className: "font-samim text-xl",
      }}
    />
  );
};

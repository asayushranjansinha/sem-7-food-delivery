import React from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();
  let timeoutId;

  useEffect(() => {
    timeoutId = setTimeout(() => {
      navigate("/");
      toast.Success("Redirecting to Home...");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="bg-red-200 w-full max-w-md m-auto h-36 flex justify-center items-center font-semibold text-lg">
      <p>Payment Cancelled!</p>
    </div>
  );
};

export default Cancel;

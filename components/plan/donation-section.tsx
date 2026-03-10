"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Heart, X } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PRESET_AMOUNTS = [3, 5, 10, 25];

export function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [thankYou, setThankYou] = useState(false);

  const donationAmount = selectedAmount ?? (parseFloat(customAmount) || 0);
  const isValid = donationAmount >= 1;

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: donationAmount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Checkout failed");
    return data.clientSecret;
  }, [donationAmount]);

  const handleOpenCheckout = () => {
    if (!isValid) return;
    setShowCheckout(true);
  };

  const handleClose = () => {
    setShowCheckout(false);
  };

  const handleComplete = () => {
    setShowCheckout(false);
    setThankYou(true);
  };

  // Check for return from completed checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "complete") {
      setThankYou(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (thankYou) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center"
      >
        <Heart className="w-8 h-8 text-green-600 mx-auto mb-2 fill-green-600" />
        <p className="font-bold text-navy text-lg mb-1">Thank you!</p>
        <p className="text-sm text-navy-500">
          Your support helps us keep building tools for young entrepreneurs.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/60 border border-lemon-200 rounded-2xl p-5"
      >
        <div className="text-center mb-4">
          <Heart className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="font-bold text-navy">Support Lemonade</p>
          <p className="text-sm text-navy-500 mt-1">
            Lemonade is free. If it helped you, consider a small donation to keep it going.
          </p>
        </div>

        {/* Preset amounts */}
        <div className="flex gap-2 justify-center mb-3">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount("");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                selectedAmount === amt
                  ? "bg-lemon text-navy shadow-sm"
                  : "bg-navy-50 text-navy-600 hover:bg-navy-100"
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm text-navy-400">or</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm font-medium">
              $
            </span>
            <input
              type="number"
              min="1"
              max="500"
              step="1"
              placeholder="Other"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="w-24 pl-7 pr-3 py-2 rounded-xl text-sm font-medium bg-white border border-navy-100 text-navy placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-lemon focus:border-lemon"
            />
          </div>
        </div>

        {/* Donate button */}
        <button
          onClick={handleOpenCheckout}
          disabled={!isValid}
          className="w-full bg-lemon hover:bg-lemon-600 disabled:bg-navy-50 disabled:text-navy-300 text-navy font-bold py-3 rounded-xl transition-colors"
        >
          {isValid ? `Donate $${donationAmount}` : "Pick an amount"}
        </button>
      </motion.div>

      {/* Checkout modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-6">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret,
                    onComplete: handleComplete,
                  }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

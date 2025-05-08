"use client";
import { useAccount } from "wagmi";

function shorten(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function ProfileIcon() {
  const { address, isConnected } = useAccount();
  if (!isConnected || !address) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-lg">
      <span className="font-mono text-blue-900 font-bold">{shorten(address)}</span>
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#0052FF" /></svg>
    </div>
  );
} 
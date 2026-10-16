"use client";

import { useNexa } from "./NexaProvider";

export default function Toast() {
  const { toastMsg } = useNexa();
  if (!toastMsg) return null;
  return (
    <div className="toast" role="status">
      {toastMsg}
    </div>
  );
}

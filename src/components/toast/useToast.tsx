"use client";

import { useToastApi } from "./ToastProvider";

export function useToast() {
  return useToastApi();
}


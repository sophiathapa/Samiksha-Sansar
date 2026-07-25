import { AlertCircleIcon, X } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertMessage({
  status,
  message,
  onClose,
}: {
  status: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Alert variant={status ? "default" : "destructive"} className="fixed top-4 right-4 w-auto max-w-sm z-[100] shadow-lg">
      <AlertCircleIcon />
      <AlertTitle>{status ? "Success" : "Error"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <AlertAction>
        <button onClick={onClose} className="cursor-pointer">
          <X className="h-5 w-5" />
        </button>
      </AlertAction>
    </Alert>
  );
}
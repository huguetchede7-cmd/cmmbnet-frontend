import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function ClientsListesPages() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        Listesdesclients
      </div>
    </div>
  );
}

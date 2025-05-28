import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../pages/styles/baraofiteri.module.css";

const OfiteriActivi = () => {
  const [officers, setOfficers] = useState<any[]>([]);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/ofiteri/activi", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth-token")}` }
        });
        setOfficers(res.data);
      } catch (err) {
        console.error("Eroare la preluare ofițeri:", err);
      }
    };
    
    fetchOfficers();
    const interval = setInterval(fetchOfficers, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
        Ofițeri în patrulare
      </h3>
      
      <div className="space-y-3">
        {officers.map(officer => (
          <div key={officer._id} className={`${styles.ofiteriBox} flex items-center justify-between`}>
            <div>
              <p className="text-sm text-blue-600">{officer.fullName}</p>
               <p className="text-sm text-blue-600" >{officer.rank}</p>
            </div>
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        ))}
        
        {officers.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Niciun ofițer activ în acest moment
          </div>
        )}
      </div>
    </div>
  );
};

export default OfiteriActivi;

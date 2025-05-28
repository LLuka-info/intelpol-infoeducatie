import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import UploadBuletin from "../components/UploadBuletin";
import CautaCetatean from "../components/CautaCetatean";
import OfiteriActivi from "../components/OfiteriActivi";
import PanouDev from "../components/PanouDeveloper";
import axios from "axios";
import styles from "./styles/index.module.css"; // Custom CSS based on your provided styles

export default function Home() {
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState<"upload" | "cauta" | null>(null);
  const [officerData, setOfficerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("ro-RO")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("ro-RO"));
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/ofiteri/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });
        setOfficerData(res.data);
        localStorage.setItem("officer", JSON.stringify(res.data));
      } catch (err) {
        console.error("Eroare preluare profil:", err);
      }
    };

    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchOfficerProfile();
    setIsLoading(false);
  }, [router]);

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>INTELPOL</title>
      </Head>

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <i className="fas fa-shield-alt"></i> INTELPOL
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Caută..."
              className={styles.searchBar}
            />
            <i className={`fas fa-search ${styles.searchIcon}`}></i>
          </div>

          <div className={styles.profileBox}>
            <div className={styles.profileCircle}>
              {officerData?.fullName?.[0] || "?"}
            </div>
            <span>
              {officerData?.fullName}
              <div className={styles.rank}>{officerData?.rank}</div>
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          {/* SIDEBAR */}
          <div className={styles.sidebar}>
            <h2>Ofițeri Activ</h2>
            <OfiteriActivi />
          </div>

          {/* CENTER PANEL */}
          <div className={styles.centerPanel}>
            <div
              className={styles.actionButton}
              onClick={() => setActiveComponent("cauta")}
            >
              <i className="fas fa-search-location"></i>
              Căutare Cetățean
            </div>
            <div
              className={styles.actionButton}
              onClick={() => setActiveComponent("upload")}
            >
              <i className="fas fa-id-card"></i>
              Încarcă Buletin
            </div>
            <div className={styles.actionButton}>
              <i className="fas fa-cogs"></i>
              Alte Funcții
            </div>

            <div className={styles.dynamicPanel}>
              {activeComponent === "cauta" && <CautaCetatean />}
              {activeComponent === "upload" && <UploadBuletin />}
              {!activeComponent && (
                <p className="text-center text-gray-600 italic">
                  Selectează o acțiune din panoul de mai sus
                </p>
              )}
              {officerData?.role === "admin" && <PanouDev />}
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL */}
        <div className={styles.bottomPanel}>
          <div className={styles.datetime}>{new Date().toLocaleString("ro-RO")}</div>
          <button
            className={styles.logoutButton}
            onClick={() => {
              localStorage.removeItem("auth-token");
              router.push("/login");
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            Deconectare
          </button>
        </div>
      </div>
    </>
  );
}

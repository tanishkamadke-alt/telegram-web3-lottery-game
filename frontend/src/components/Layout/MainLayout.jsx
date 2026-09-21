import "./layout.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout({
  children,
  page,
  setPage,
}) {

  return (

    <div className="layout">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <div className="main-section">

        <Navbar />

        <main className="main-content">
          {children}
        </main>

        <footer className="app-footer">
          Built by: Tanishka Madke&nbsp;&nbsp;|&nbsp;&nbsp;
          Organization: EtherAuthority&nbsp;&nbsp;|&nbsp;&nbsp;
          Network: Ethereum Sepolia Testnet
        </footer>

      </div>

    </div>

  );
}

export default MainLayout;
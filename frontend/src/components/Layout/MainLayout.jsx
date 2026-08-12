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

      </div>

    </div>

  );
}

export default MainLayout;
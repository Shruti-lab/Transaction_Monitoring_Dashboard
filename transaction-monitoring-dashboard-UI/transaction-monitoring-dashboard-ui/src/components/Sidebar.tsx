import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
// Import icons if you're using a package like react-icons
import { 
  MdDashboard, 
  MdPayments, 
  MdWarning, 
  MdError, 
  MdInsights, 
  MdSettings, 
  MdMenu,
  MdClose
} from 'react-icons/md';

const Sidebar: React.FC = () => {
      const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <div className="logo-container">
        
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {/* {isCollapsed ? <MdMenu /> : <MdClose />} */}
          <img src={logo} alt="Logo" className="main-logo" />
          
        </button>
      </div>
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <MdDashboard className="sidebar-icon" />
          <span className="link-text">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/transactions" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <MdPayments className="sidebar-icon" />
          <span className="link-text">All Transactions</span>
        </NavLink>

        <NavLink 
          to="/fraudulent" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <MdWarning className="sidebar-icon" />
          <span className="link-text">Fraudulent Transactions</span>
        </NavLink>

        <NavLink 
          to="/errors" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <MdError className="sidebar-icon" />
          <span className="link-text">Error Transactions</span>
        </NavLink>

        {/* <NavLink 
          to="/analytics" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <MdInsights className="sidebar-icon" />
          <span className="link-text">Analytics</span>
        </NavLink> */}

        {/* <NavLink 
          to="/settings" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <MdSettings className="sidebar-icon" />
          <span className="link-text">Settings</span>
        </NavLink> */}
      </nav>
    </aside>
  
  </>
  );
};

export default Sidebar;
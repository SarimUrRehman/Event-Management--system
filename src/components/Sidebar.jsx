import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import eventImage from '../Image/eventlogo.png'; 



const SideBar = () => {
  return (
    <>
      <style>
        {`
        .vertical-sidebar {
          width: 280px;
          background-color: #f5f5f5;
          height: 100vh;
          padding: 1rem;
          overflow-y: auto;
        }

        .checkbox-input {
          display: none;
        }

        .nav__toggle {
          cursor: pointer;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .toggle--icons svg {
          display: none;
          width: 24px;
          height: 24px;
        }

        .checkbox-input:not(:checked) ~ nav .toggle--open {
          display: inline-block;
        }

        .checkbox-input:checked ~ nav .toggle--close {
          display: inline-block;
        }

        .codepen-logo {
          width: 100px;
          margin-bottom: 1rem;
        }

        .sidebar__wrapper {
          margin-top: 2rem;
        }

        .sidebar__list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .sidebar__item {
          margin: 0.5rem 0;
        }

        .sidebar__item--heading {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .sidebar__link {
          display: flex;
          align-items: center;
          color: #333;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .sidebar__link:hover {
          background-color: #e0e0e0;
        }

        .icon {
          margin-right: 0.75rem;
        }

        .user-id {
          margin: 0;
          font-weight: 600;
        }

        .user-role {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }
      `}
      </style>

      <aside className="vertical-sidebar">
        <input type="checkbox" role="switch" id="checkbox-input" className="checkbox-input" defaultChecked />
        <nav>
          <header>
            <div className="sidebar__toggle-container">
              <label tabIndex="0" htmlFor="checkbox-input" className="nav__toggle">
                <span className="toggle--icons" aria-hidden="true">
                  <svg className="toggle--open" viewBox="0 0 24 24">
                    <path d="M3 5a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2zM2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1M2 18a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1" />
                  </svg>
                  <svg className="toggle--close" viewBox="0 0 24 24">
                    <path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12z" />
                  </svg>
                </span>
              </label>
            </div>
            <figure>
              <img className="codepen-logo" src={eventImage} alt="Event Picture" />

              <figcaption>
                <h2 className="user-id">EventSphere</h2>
                {/* <p className="user-role">Coder</p> */}
              </figcaption>
            </figure>
          </header>

          <section className="sidebar__wrapper">
            <SidebarList
              heading="general"
              items={[
                { label: "Inbox", icon: "bi-inbox" },
                { label: "Favourite", icon: "bi-star" },
                { label: "Sent", icon: "bi-send" },
                { label: "Draft", icon: "bi-envelope-exclamation" },
                { label: "Archive", icon: "bi-archive" },
                { label: "Trash", icon: "bi-trash" },
              ]}
            />
            <SidebarList
              heading="settings"
              items={[
                { label: "Profile", icon: "bi-person-circle" },
                { label: "Settings", icon: "bi-gear" },
              ]}
            />
          </section>
        </nav>
      </aside>
    </>
  );
};

const SidebarList = ({ heading, items }) => (
  <ul className="sidebar__list">
    <li className="sidebar__item item--heading">
      <h2 className="sidebar__item--heading">{heading}</h2>
    </li>
    {items.map((item) => (
      <li className="sidebar__item" key={item.label}>
        <a className="sidebar__link" href="#" data-tooltip={item.label}>
          <span className="icon">
            <i className={`bi ${item.icon}`} />
          </span>
          <span className="text">{item.label}</span>
        </a>
      </li>
    ))}
  </ul>
);

export default SideBar;

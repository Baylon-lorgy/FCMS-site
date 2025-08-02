import React from 'react'

function AppCalendar() {
  return (
  <div>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
  <title>Fullcalendar - Apps | Sneat - Bootstrap 5 HTML Admin Template - Pro</title>
  <meta name="description" content />
  {/* Favicon */}
  <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />
  {/* Fonts */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
  {/* Icons */}
  <link rel="stylesheet" href="assets/vendor/fonts/boxicons.css" />
  <link rel="stylesheet" href="assets/vendor/fonts/fontawesome.css" />
  <link rel="stylesheet" href="assets/vendor/fonts/flag-icons.css" />
  {/* Core CSS */}
  <link rel="stylesheet" href="assets/vendor/css/rtl/core.css" className="template-customizer-core-css" />
  <link rel="stylesheet" href="assets/vendor/css/rtl/theme-default.css" className="template-customizer-theme-css" />
  <link rel="stylesheet" href="assets/css/demo.css" />
  {/* Vendors CSS */}
  <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
  <link rel="stylesheet" href="assets/vendor/libs/typeahead-js/typeahead.css" />
  <link rel="stylesheet" href="assets/vendor/libs/fullcalendar/fullcalendar.css" />
  <link rel="stylesheet" href="assets/vendor/libs/flatpickr/flatpickr.css" />
  <link rel="stylesheet" href="assets/vendor/libs/select2/select2.css" />
  <link rel="stylesheet" href="assets/vendor/libs/quill/editor.css" />
  <link rel="stylesheet" href="assets/vendor/libs/formvalidation/dist/css/formValidation.min.css" />
  {/* Page CSS */}
  <link rel="stylesheet" href="assets/vendor/css/pages/app-calendar.css" />
  {/* Helpers */}
  {/*! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section */}
  {/*? Template customizer: To hide customizer set displayCustomizer value false in config.js.  */}
  {/*? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  */}
  {/* Layout wrapper */}
  <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Menu */}
      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo">
          <a href="index.html" className="app-brand-link">
            <span className="app-brand-logo demo">
              <svg width={25} viewBox="0 0 25 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <defs>
                  <path d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z" id="path-1" />
                  <path d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z" id="path-3" />
                  <path d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z" id="path-4" />
                  <path d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z" id="path-5" />
                </defs>
                <g id="g-app-brand" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                    <g id="Icon" transform="translate(27.000000, 15.000000)">
                      <g id="Mask" transform="translate(0.000000, 8.000000)">
                        <mask id="mask-2" fill="white">
                          <use xlinkHref="#path-1" />
                        </mask>
                        <use fill="#696cff" xlinkHref="#path-1" />
                        <g id="Path-3" mask="url(#mask-2)">
                          <use fill="#696cff" xlinkHref="#path-3" />
                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3" />
                        </g>
                        <g id="Path-4" mask="url(#mask-2)">
                          <use fill="#696cff" xlinkHref="#path-4" />
                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4" />
                        </g>
                      </g>
                      <g id="Triangle" transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) ">
                        <use fill="#696cff" xlinkHref="#path-5" />
                        <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5" />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <span className="app-brand-text demo menu-text fw-bolder ms-2">Sneat</span>
          </a>
          <a href="#" className="layout-menu-toggle menu-link text-large ms-auto">
            <i className="bx bx-chevron-left bx-sm align-middle" />
          </a>
        </div>
        <div className="menu-inner-shadow" />
        <ul className="menu-inner py-1">
          {/* Dashboards */}
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-home-circle" />
              <div data-i18n="Dashboards">Dashboards</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="dashboards-analytics.html" className="menu-link">
                  <div data-i18n="Analytics">Analytics</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="dashboards-crm.html" className="menu-link">
                  <div data-i18n="CRM">CRM</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="dashboards-ecommerce.html" className="menu-link">
                  <div data-i18n="eCommerce">eCommerce</div>
                </a>
              </li>
            </ul>
          </li>
          {/* Layouts */}
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-layout" />
              <div data-i18n="Layouts">Layouts</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="layouts-collapsed-menu.html" className="menu-link">
                  <div data-i18n="Collapsed menu">Collapsed menu</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-content-navbar.html" className="menu-link">
                  <div data-i18n="Content navbar">Content navbar</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-content-navbar-with-sidebar.html" className="menu-link">
                  <div data-i18n="Content nav + Sidebar">Content nav + Sidebar</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="../horizontal-menu-template" className="menu-link" target="_blank">
                  <div data-i18n="Horizontal">Horizontal</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-without-menu.html" className="menu-link">
                  <div data-i18n="Without menu">Without menu</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-without-navbar.html" className="menu-link">
                  <div data-i18n="Without navbar">Without navbar</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-fluid.html" className="menu-link">
                  <div data-i18n="Fluid">Fluid</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-container.html" className="menu-link">
                  <div data-i18n="Container">Container</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="layouts-blank.html" className="menu-link">
                  <div data-i18n="Blank">Blank</div>
                </a>
              </li>
            </ul>
          </li>
          {/* Apps & Pages */}
          <li className="menu-header small text-uppercase">
            <span className="menu-header-text">Apps &amp; Pages</span>
          </li>
          <li className="menu-item active">
            <a href="app-calendar.html" className="menu-link">
              <i className="menu-icon tf-icons bx bx-calendar" />
              <div data-i18n="Calendar">Calendar</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-food-menu" />
              <div data-i18n="Invoice">Invoice</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="app-invoice-list.html" className="menu-link">
                  <div data-i18n="List">List</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="app-invoice-preview.html" className="menu-link">
                  <div data-i18n="Preview">Preview</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="app-invoice-edit.html" className="menu-link">
                  <div data-i18n="Edit">Edit</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="app-invoice-add.html" className="menu-link">
                  <div data-i18n="Add">Add</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-user" />
              <div data-i18n="Users">Users</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="app-user-list.html" className="menu-link">
                  <div data-i18n="List">List</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="View">View</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="app-user-view-account.html" className="menu-link">
                      <div data-i18n="Account">Account</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="app-user-view-security.html" className="menu-link">
                      <div data-i18n="Security">Security</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="app-user-view-billing.html" className="menu-link">
                      <div data-i18n="Billing & Plans">Billing &amp; Plans</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="app-user-view-notifications.html" className="menu-link">
                      <div data-i18n="Notifications">Notifications</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="app-user-view-connections.html" className="menu-link">
                      <div data-i18n="Connections">Connections</div>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-check-shield" />
              <div data-i18n="Roles & Permissions">Roles &amp; Permissions</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="app-access-roles.html" className="menu-link">
                  <div data-i18n="Roles">Roles</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="app-access-permission.html" className="menu-link">
                  <div data-i18n="Permission">Permission</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-dock-top" />
              <div data-i18n="Pages">Pages</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="User Profile">User Profile</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="pages-profile-user.html" className="menu-link">
                      <div data-i18n="Profile">Profile</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-profile-teams.html" className="menu-link">
                      <div data-i18n="Teams">Teams</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-profile-projects.html" className="menu-link">
                      <div data-i18n="Projects">Projects</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-profile-connections.html" className="menu-link">
                      <div data-i18n="Connections">Connections</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Account Settings">Account Settings</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="pages-account-settings-account.html" className="menu-link">
                      <div data-i18n="Account">Account</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-account-settings-security.html" className="menu-link">
                      <div data-i18n="Security">Security</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-account-settings-billing.html" className="menu-link">
                      <div data-i18n="Billing & Plans">Billing &amp; Plans</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-account-settings-notifications.html" className="menu-link">
                      <div data-i18n="Notifications">Notifications</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-account-settings-connections.html" className="menu-link">
                      <div data-i18n="Connections">Connections</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="pages-faq.html" className="menu-link">
                  <div data-i18n="FAQ">FAQ</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Help Center">Help Center</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="pages-help-center-landing.html" className="menu-link">
                      <div data-i18n="Landing">Landing</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-help-center-categories.html" className="menu-link">
                      <div data-i18n="Categories">Categories</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-help-center-article.html" className="menu-link">
                      <div data-i18n="Article">Article</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="pages-pricing.html" className="menu-link">
                  <div data-i18n="Pricing">Pricing</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Misc">Misc</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="pages-misc-error.html" className="menu-link" target="_blank">
                      <div data-i18n="Error">Error</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-misc-under-maintenance.html" className="menu-link" target="_blank">
                      <div data-i18n="Under Maintenance">Under Maintenance</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-misc-comingsoon.html" className="menu-link" target="_blank">
                      <div data-i18n="Coming Soon">Coming Soon</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="pages-misc-not-authorized.html" className="menu-link" target="_blank">
                      <div data-i18n="Not Authorized">Not Authorized</div>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-lock-open-alt" />
              <div data-i18n="Authentications">Authentications</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Login">Login</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-login-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-login-cover.html" className="menu-link" target="_blank">
                      <div data-i18n="Cover">Cover</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Register">Register</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-register-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-register-cover.html" className="menu-link" target="_blank">
                      <div data-i18n="Cover">Cover</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-register-multisteps.html" className="menu-link" target="_blank">
                      <div data-i18n="Multi-steps">Multi-steps</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Verify Email">Verify Email</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-verify-email-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-verify-email-cover.html" className="menu-link" target="_blank">
                      <div data-i18n="Cover">Cover</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Reset Password">Reset Password</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-reset-password-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-reset-password-cover.html" className="menu-link" target="_blank">
                      <div data-i18n="Cover">Cover</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Forgot Password">Forgot Password</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-forgot-password-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-forgot-password-cover.html" className="menu-link" target="_blank">
                      <div data-i18n="Cover">Cover</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Two Steps">Two Steps</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="auth-two-steps-basic.html" className="menu-link" target="_blank">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="auth-two-steps-cover.html" className="menu-link" target="_blank">
                      <div data-i18n="Cover">Cover</div>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-spreadsheet" />
              <div data-i18n="Wizard Examples">Wizard Examples</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="wizard-ex-checkout.html" className="menu-link">
                  <div data-i18n="Checkout">Checkout</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="wizard-ex-property-listing.html" className="menu-link">
                  <div data-i18n="Property Listing">Property Listing</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="wizard-ex-create-deal.html" className="menu-link">
                  <div data-i18n="Create Deal">Create Deal</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="modal-examples.html" className="menu-link">
              <i className="menu-icon tf-icons bx bx-window-open" />
              <div data-i18n="Modal Examples">Modal Examples</div>
            </a>
          </li>
          {/* Components */}
          <li className="menu-header small text-uppercase"><span className="menu-header-text">Components</span></li>
          {/* Cards */}
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-collection" />
              <div data-i18n="Cards">Cards</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="cards-basic.html" className="menu-link">
                  <div data-i18n="Basic">Basic</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="cards-advance.html" className="menu-link">
                  <div data-i18n="Advance">Advance</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="cards-statistics.html" className="menu-link">
                  <div data-i18n="Statistics">Statistics</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="cards-analytics.html" className="menu-link">
                  <div data-i18n="Analytics">Analytics</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="cards-gamifications.html" className="menu-link">
                  <div data-i18n="Gamifications">Gamifications</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="cards-actions.html" className="menu-link">
                  <div data-i18n="Actions">Actions</div>
                </a>
              </li>
            </ul>
          </li>
          {/* User interface */}
          <li className="menu-item">
            <a href="javascript:void(0)" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-box" />
              <div data-i18n="User interface">User interface</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="ui-accordion.html" className="menu-link">
                  <div data-i18n="Accordion">Accordion</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-alerts.html" className="menu-link">
                  <div data-i18n="Alerts">Alerts</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-badges.html" className="menu-link">
                  <div data-i18n="Badges">Badges</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-buttons.html" className="menu-link">
                  <div data-i18n="Buttons">Buttons</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-carousel.html" className="menu-link">
                  <div data-i18n="Carousel">Carousel</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-collapse.html" className="menu-link">
                  <div data-i18n="Collapse">Collapse</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-dropdowns.html" className="menu-link">
                  <div data-i18n="Dropdowns">Dropdowns</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-footer.html" className="menu-link">
                  <div data-i18n="Footer">Footer</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-list-groups.html" className="menu-link">
                  <div data-i18n="List Groups">List groups</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-modals.html" className="menu-link">
                  <div data-i18n="Modals">Modals</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-navbar.html" className="menu-link">
                  <div data-i18n="Navbar">Navbar</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-offcanvas.html" className="menu-link">
                  <div data-i18n="Offcanvas">Offcanvas</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-pagination-breadcrumbs.html" className="menu-link">
                  <div data-i18n="Pagination & Breadcrumbs">Pagination &amp; Breadcrumbs</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-progress.html" className="menu-link">
                  <div data-i18n="Progress">Progress</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-spinners.html" className="menu-link">
                  <div data-i18n="Spinners">Spinners</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-tabs-pills.html" className="menu-link">
                  <div data-i18n="Tabs & Pills">Tabs &amp; Pills</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-toasts.html" className="menu-link">
                  <div data-i18n="Toasts">Toasts</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-tooltips-popovers.html" className="menu-link">
                  <div data-i18n="Tooltips & Popovers">Tooltips &amp; popovers</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="ui-typography.html" className="menu-link">
                  <div data-i18n="Typography">Typography</div>
                </a>
              </li>
            </ul>
          </li>
          {/* Extended components */}
          <li className="menu-item">
            <a href="javascript:void(0)" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-copy" />
              <div data-i18n="Extended UI">Extended UI</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="extended-ui-avatar.html" className="menu-link">
                  <div data-i18n="Avatar">Avatar</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-blockui.html" className="menu-link">
                  <div data-i18n="BlockUI">BlockUI</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-drag-and-drop.html" className="menu-link">
                  <div data-i18n="Drag & Drop">Drag &amp; Drop</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-media-player.html" className="menu-link">
                  <div data-i18n="Media Player">Media Player</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-perfect-scrollbar.html" className="menu-link">
                  <div data-i18n="Perfect Scrollbar">Perfect scrollbar</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-star-ratings.html" className="menu-link">
                  <div data-i18n="Star Ratings">Star Ratings</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-sweetalert2.html" className="menu-link">
                  <div data-i18n="SweetAlert2">SweetAlert2</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-text-divider.html" className="menu-link">
                  <div data-i18n="Text Divider">Text Divider</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="#" className="menu-link menu-toggle">
                  <div data-i18n="Timeline">Timeline</div>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a href="extended-ui-timeline-basic.html" className="menu-link">
                      <div data-i18n="Basic">Basic</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="extended-ui-timeline-fullscreen.html" className="menu-link">
                      <div data-i18n="Fullscreen">Fullscreen</div>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="menu-item">
                <a href="extended-ui-tour.html" className="menu-link">
                  <div data-i18n="Tour">Tour</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-treeview.html" className="menu-link">
                  <div data-i18n="Treeview">Treeview</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="extended-ui-misc.html" className="menu-link">
                  <div data-i18n="Miscellaneous">Miscellaneous</div>
                </a>
              </li>
            </ul>
          </li>
          {/* Icons */}
          <li className="menu-item">
            <a href="javascript:void(0)" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-crown" />
              <div data-i18n="Icons">Icons</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="icons-boxicons.html" className="menu-link">
                  <div data-i18n="Boxicons">Boxicons</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="icons-font-awesome.html" className="menu-link">
                  <div data-i18n="Fontawesome">Fontawesome</div>
                </a>
              </li>
            </ul>
          </li>
          {/* Forms & Tables */}
          <li className="menu-header small text-uppercase"><span className="menu-header-text">Forms &amp; Tables</span></li>
          {/* Forms */}
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-detail" />
              <div data-i18n="Form Elements">Form Elements</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="forms-basic-inputs.html" className="menu-link">
                  <div data-i18n="Basic Inputs">Basic Inputs</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-input-groups.html" className="menu-link">
                  <div data-i18n="Input groups">Input groups</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-custom-options.html" className="menu-link">
                  <div data-i18n="Custom Options">Custom Options</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-editors.html" className="menu-link">
                  <div data-i18n="Editors">Editors</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-file-upload.html" className="menu-link">
                  <div data-i18n="File Upload">File Upload</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-pickers.html" className="menu-link">
                  <div data-i18n="Pickers">Pickers</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-selects.html" className="menu-link">
                  <div data-i18n="Select & Tags">Select &amp; Tags</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-sliders.html" className="menu-link">
                  <div data-i18n="Sliders">Sliders</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-switches.html" className="menu-link">
                  <div data-i18n="Switches">Switches</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="forms-extras.html" className="menu-link">
                  <div data-i18n="Extras">Extras</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-detail" />
              <div data-i18n="Form Layouts">Form Layouts</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="form-layouts-vertical.html" className="menu-link">
                  <div data-i18n="Vertical Form">Vertical Form</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="form-layouts-horizontal.html" className="menu-link">
                  <div data-i18n="Horizontal Form">Horizontal Form</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="form-layouts-sticky.html" className="menu-link">
                  <div data-i18n="Sticky Actions">Sticky Actions</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-carousel" />
              <div data-i18n="Form Wizard">Form Wizard</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="form-wizard-numbered.html" className="menu-link">
                  <div data-i18n="Numbered">Numbered</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="form-wizard-icons.html" className="menu-link">
                  <div data-i18n="Icons">Icons</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="form-validation.html" className="menu-link">
              <i className="menu-icon tf-icons bx bx-list-check" />
              <div data-i18n="Form Validation">Form Validation</div>
            </a>
          </li>
          {/* Tables */}
          <li className="menu-item">
            <a href="tables-basic.html" className="menu-link">
              <i className="menu-icon tf-icons bx bx-table" />
              <div data-i18n="Tables">Tables</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-grid" />
              <div data-i18n="Datatables">Datatables</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="tables-datatables-basic.html" className="menu-link">
                  <div data-i18n="Basic">Basic</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="tables-datatables-advanced.html" className="menu-link">
                  <div data-i18n="Advanced">Advanced</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="tables-datatables-extensions.html" className="menu-link">
                  <div data-i18n="Extensions">Extensions</div>
                </a>
              </li>
            </ul>
          </li>
          {/* Charts & Maps */}
          <li className="menu-header small text-uppercase">
            <span className="menu-header-text">Charts &amp; Maps</span>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-chart" />
              <div data-i18n="Charts">Charts</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="charts-apex.html" className="menu-link">
                  <div data-i18n="Apex Charts">Apex Charts</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="charts-chartjs.html" className="menu-link">
                  <div data-i18n="ChartJS">ChartJS</div>
                </a>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <a href="maps-leaflet.html" className="menu-link">
              <i className="menu-icon tf-icons bx bx-map-alt" />
              <div data-i18n="Leaflet Maps">Leaflet Maps</div>
            </a>
          </li>
          {/* Misc */}
          <li className="menu-header small text-uppercase"><span className="menu-header-text">Misc</span></li>
          <li className="menu-item">
            <a href="https://themeselection.com/support/" target="_blank" className="menu-link">
              <i className="menu-icon tf-icons bx bx-support" />
              <div data-i18n="Support">Support</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/" target="_blank" className="menu-link">
              <i className="menu-icon tf-icons bx bx-file" />
              <div data-i18n="Documentation">Documentation</div>
            </a>
          </li>
        </ul>
      </aside>
      {/* / Menu */}
      {/* Layout container */}
      <div className="layout-page">
        {/* Navbar */}
        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
            <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
              <i className="bx bx-menu bx-sm" />
            </a>
          </div>
          <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
            {/* Search */}
            <div className="navbar-nav align-items-center">
              <div className="nav-item navbar-search-wrapper mb-0">
                <a className="nav-item nav-link search-toggler px-0" href="#">
                  <i className="bx bx-search bx-sm" />
                  <span className="d-none d-md-inline-block text-muted">Search (Ctrl+/)</span>
                </a>
              </div>
            </div>
            {/* /Search */}
            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Language */}
              <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
                <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                  <i className="fi fi-us fis rounded-circle fs-3 me-1" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#" data-language="en">
                      <i className="fi fi-us fis rounded-circle fs-4 me-1" />
                      <span className="align-middle">English</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" data-language="fr">
                      <i className="fi fi-fr fis rounded-circle fs-4 me-1" />
                      <span className="align-middle">France</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" data-language="de">
                      <i className="fi fi-de fis rounded-circle fs-4 me-1" />
                      <span className="align-middle">German</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" data-language="pt">
                      <i className="fi fi-pt fis rounded-circle fs-4 me-1" />
                      <span className="align-middle">Portuguese</span>
                    </a>
                  </li>
                </ul>
              </li>
              {/*/ Language */}
              {/* Style Switcher */}
              <li className="nav-item me-2 me-xl-0">
                <a className="nav-link style-switcher-toggle hide-arrow" href="#">
                  <i className="bx bx-sm" />
                </a>
              </li>
              {/*/ Style Switcher */}
              {/* Quick links  */}
              <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown me-2 me-xl-0">
                <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                  <i className="bx bx-grid-alt bx-sm" />
                </a>
                <div className="dropdown-menu dropdown-menu-end py-0">
                  <div className="dropdown-menu-header border-bottom">
                    <div className="dropdown-header d-flex align-items-center py-3">
                      <h5 className="text-body mb-0 me-auto">Shortcuts</h5>
                      <a href="javascript:void(0)" className="dropdown-shortcuts-add text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Add shortcuts"><i className="bx bx-sm bx-plus-circle" /></a>
                    </div>
                  </div>
                  <div className="dropdown-shortcuts-list scrollable-container">
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-calendar fs-4" />
                        </span>
                        <a href="app-calendar.html" className="stretched-link">Calendar</a>
                        <small className="text-muted mb-0">Appointments</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-food-menu fs-4" />
                        </span>
                        <a href="app-invoice-list.html" className="stretched-link">Invoice App</a>
                        <small className="text-muted mb-0">Manage Accounts</small>
                      </div>
                    </div>
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-user fs-4" />
                        </span>
                        <a href="app-user-list.html" className="stretched-link">User App</a>
                        <small className="text-muted mb-0">Manage Users</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-check-shield fs-4" />
                        </span>
                        <a href="app-access-roles.html" className="stretched-link">Role Management</a>
                        <small className="text-muted mb-0">Permission</small>
                      </div>
                    </div>
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-pie-chart-alt-2 fs-4" />
                        </span>
                        <a href="index.html" className="stretched-link">Dashboard</a>
                        <small className="text-muted mb-0">User Profile</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-cog fs-4" />
                        </span>
                        <a href="pages-account-settings-account.html" className="stretched-link">Setting</a>
                        <small className="text-muted mb-0">Account Settings</small>
                      </div>
                    </div>
                    <div className="row row-bordered overflow-visible g-0">
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-help-circle fs-4" />
                        </span>
                        <a href="pages-help-center-landing.html" className="stretched-link">Help Center</a>
                        <small className="text-muted mb-0">FAQs &amp; Articles</small>
                      </div>
                      <div className="dropdown-shortcuts-item col">
                        <span className="dropdown-shortcuts-icon bg-label-secondary rounded-circle mb-2">
                          <i className="bx bx-window-open fs-4" />
                        </span>
                        <a href="modal-examples.html" className="stretched-link">Modals</a>
                        <small className="text-muted mb-0">Useful Popups</small>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/* Quick links */}
              {/* Notification */}
              <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
                <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                  <i className="bx bx-bell bx-sm" />
                  <span className="badge bg-danger rounded-pill badge-notifications">5</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end py-0">
                  <li className="dropdown-menu-header border-bottom">
                    <div className="dropdown-header d-flex align-items-center py-3">
                      <h5 className="text-body mb-0 me-auto">Notification</h5>
                      <a href="javascript:void(0)" className="dropdown-notifications-all text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark all as read"><i className="bx fs-4 bx-envelope-open" /></a>
                    </div>
                  </li>
                  <li className="dropdown-notifications-list scrollable-container">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img src="assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Congratulation Lettie 🎉</h6>
                            <p className="mb-0">Won the monthly best seller gold badge</p>
                            <small className="text-muted">1h ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-danger">CF</span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Charles Franklin</h6>
                            <p className="mb-0">Accepted your connection</p>
                            <small className="text-muted">12hr ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img src="assets/img/avatars/2.png" alt className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">New Message ✉️</h6>
                            <p className="mb-0">You have new message from Natalie</p>
                            <small className="text-muted">1h ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-success"><i className="bx bx-cart" /></span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Whoo! You have new order 🛒</h6>
                            <p className="mb-0">ACME Inc. made new order $1,154</p>
                            <small className="text-muted">1 day ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img src="assets/img/avatars/9.png" alt className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Application has been approved 🚀</h6>
                            <p className="mb-0">Your ABC project application has been approved.</p>
                            <small className="text-muted">2 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-success"><i className="bx bx-pie-chart-alt" /></span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Monthly report is generated</h6>
                            <p className="mb-0">July monthly financial report is generated</p>
                            <small className="text-muted">3 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img src="assets/img/avatars/5.png" alt className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Send connection request</h6>
                            <p className="mb-0">Peter sent you connection request</p>
                            <small className="text-muted">4 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <img src="assets/img/avatars/6.png" alt className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">New message from Jane</h6>
                            <p className="mb-0">Your have new message from Jane</p>
                            <small className="text-muted">5 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-warning"><i className="bx bx-error" /></span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">CPU is running high</h6>
                            <p className="mb-0">CPU Utilization Percent is currently at 88.63%,</p>
                            <small className="text-muted">5 days ago</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read"><span className="badge badge-dot" /></a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive"><span className="bx bx-x" /></a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown-menu-footer border-top">
                    <a href="#" className="dropdown-item d-flex justify-content-center p-3">
                      View all notifications
                    </a>
                  </li>
                </ul>
              </li>
              {/*/ Notification */}
              {/* User */}
              <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                  <div className="avatar avatar-online">
                    <img src="assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="pages-account-settings-account.html">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar avatar-online">
                            <img src="assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <span className="fw-semibold d-block">John Doe</span>
                          <small className="text-muted">Admin</small>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-profile-user.html">
                      <i className="bx bx-user me-2" />
                      <span className="align-middle">My Profile</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-account-settings-account.html">
                      <i className="bx bx-cog me-2" />
                      <span className="align-middle">Settings</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-account-settings-billing.html">
                      <span className="d-flex align-items-center align-middle">
                        <i className="flex-shrink-0 bx bx-credit-card me-2" />
                        <span className="flex-grow-1 align-middle">Billing</span>
                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-help-center-landing.html">
                      <i className="bx bx-support me-2" />
                      <span className="align-middle">Help</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-faq.html">
                      <i className="bx bx-help-circle me-2" />
                      <span className="align-middle">FAQ</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-pricing.html">
                      <i className="bx bx-dollar me-2" />
                      <span className="align-middle">Pricing</span>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="auth-login-cover.html" target="_blank">
                      <i className="bx bx-power-off me-2" />
                      <span className="align-middle">Log Out</span>
                    </a>
                  </li>
                </ul>
              </li>
              {/*/ User */}
            </ul>
          </div>
          {/* Search Small Screens */}
          <div className="navbar-search-wrapper search-input-wrapper d-none">
            <input type="text" className="form-control search-input container-xxl border-0" placeholder="Search..." aria-label="Search..." />
            <i className="bx bx-x bx-sm search-toggler cursor-pointer" />
          </div>
        </nav>
        {/* / Navbar */}
        {/* Content wrapper */}
        <div className="content-wrapper">
          {/* Content */}
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card app-calendar-wrapper">
              <div className="row g-0">
                {/* Calendar Sidebar */}
                <div className="col app-calendar-sidebar" id="app-calendar-sidebar">
                  <div className="border-bottom p-4 my-sm-0 mb-3">
                    <div className="d-grid">
                      <button className="btn btn-primary btn-toggle-sidebar" data-bs-toggle="offcanvas" data-bs-target="#addEventSidebar" aria-controls="addEventSidebar">
                        <i className="bx bx-plus" />
                        <span className="align-middle">Add Event</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {/* inline calendar (flatpicker) */}
                    <div className="ms-n2">
                      <div className="inline-calendar" />
                    </div>
                    <hr className="container-m-nx my-4" />
                    {/* Filter */}
                    <div className="mb-4">
                      <small className="text-small text-muted text-uppercase align-middle">Filter</small>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input select-all" type="checkbox" id="selectAll" data-value="all" defaultChecked />
                      <label className="form-check-label" htmlFor="selectAll">View All</label>
                    </div>
                    <div className="app-calendar-events-filter">
                      <div className="form-check form-check-danger mb-2">
                        <input className="form-check-input input-filter" type="checkbox" id="select-personal" data-value="personal" defaultChecked />
                        <label className="form-check-label" htmlFor="select-personal">Personal</label>
                      </div>
                      <div className="form-check mb-2">
                        <input className="form-check-input input-filter" type="checkbox" id="select-business" data-value="business" defaultChecked />
                        <label className="form-check-label" htmlFor="select-business">Business</label>
                      </div>
                      <div className="form-check form-check-warning mb-2">
                        <input className="form-check-input input-filter" type="checkbox" id="select-family" data-value="family" defaultChecked />
                        <label className="form-check-label" htmlFor="select-family">Family</label>
                      </div>
                      <div className="form-check form-check-success mb-2">
                        <input className="form-check-input input-filter" type="checkbox" id="select-holiday" data-value="holiday" defaultChecked />
                        <label className="form-check-label" htmlFor="select-holiday">Holiday</label>
                      </div>
                      <div className="form-check form-check-info">
                        <input className="form-check-input input-filter" type="checkbox" id="select-etc" data-value="etc" defaultChecked />
                        <label className="form-check-label" htmlFor="select-etc">ETC</label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Calendar Sidebar */}
                {/* Calendar & Modal */}
                <div className="col app-calendar-content">
                  <div className="card shadow-none border-0">
                    <div className="card-body pb-0">
                      {/* FullCalendar */}
                      <div id="calendar" />
                    </div>
                  </div>
                  <div className="app-overlay" />
                  {/* FullCalendar Offcanvas */}
                  <div className="offcanvas offcanvas-end event-sidebar" tabIndex={-1} id="addEventSidebar" aria-labelledby="addEventSidebarLabel">
                    <div className="offcanvas-header border-bottom">
                      <h5 className="offcanvas-title mb-2" id="addEventSidebarLabel">Add Event</h5>
                      <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                    </div>
                    <div className="offcanvas-body">
                      <form className="event-form pt-0" id="eventForm" onsubmit="return false">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventTitle">Title</label>
                          <input type="text" className="form-control" id="eventTitle" name="eventTitle" placeholder="Event Title" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventLabel">Label</label>
                          <select className="select2 select-event-label form-select" id="eventLabel" name="eventLabel">
                            <option data-label="primary" value="Business" selected>Business</option>
                            <option data-label="danger" value="Personal">Personal</option>
                            <option data-label="warning" value="Family">Family</option>
                            <option data-label="success" value="Holiday">Holiday</option>
                            <option data-label="info" value="ETC">ETC</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventStartDate">Start Date</label>
                          <input type="text" className="form-control" id="eventStartDate" name="eventStartDate" placeholder="Start Date" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventEndDate">End Date</label>
                          <input type="text" className="form-control" id="eventEndDate" name="eventEndDate" placeholder="End Date" />
                        </div>
                        <div className="mb-3">
                          <label className="switch">
                            <input type="checkbox" className="switch-input allDay-switch" />
                            <span className="switch-toggle-slider">
                              <span className="switch-on" />
                              <span className="switch-off" />
                            </span>
                            <span className="switch-label">All Day</span>
                          </label>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventURL">Event URL</label>
                          <input type="url" className="form-control" id="eventURL" name="eventURL" placeholder="https://www.google.com" />
                        </div>
                        <div className="mb-3 select2-primary">
                          <label className="form-label" htmlFor="eventGuests">Add Guests</label>
                          <select className="select2 select-event-guests form-select" id="eventGuests" name="eventGuests" multiple>
                            <option data-avatar="1.png" value="Jane Foster">Jane Foster</option>
                            <option data-avatar="3.png" value="Donna Frank">Donna Frank</option>
                            <option data-avatar="5.png" value="Gabrielle Robertson">Gabrielle Robertson</option>
                            <option data-avatar="7.png" value="Lori Spears">Lori Spears</option>
                            <option data-avatar="9.png" value="Sandy Vega">Sandy Vega</option>
                            <option data-avatar="11.png" value="Cheryl May">Cheryl May</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventLocation">Location</label>
                          <input type="text" className="form-control" id="eventLocation" name="eventLocation" placeholder="Enter Location" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="eventDescription">Description</label>
                          <textarea className="form-control" name="eventDescription" id="eventDescription" defaultValue={""} />
                        </div>
                        <div className="mb-3 d-flex justify-content-sm-between justify-content-start my-4">
                          <div>
                            <button type="submit" className="btn btn-primary btn-add-event me-sm-3 me-1">Add</button>
                            <button type="submit" className="btn btn-primary btn-update-event d-none me-sm-3 me-1">
                              Update
                            </button>
                            <button type="reset" className="btn btn-label-secondary btn-cancel me-sm-0 me-1" data-bs-dismiss="offcanvas">
                              Cancel
                            </button>
                          </div>
                          <div><button className="btn btn-label-danger btn-delete-event d-none">Delete</button></div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* /Calendar & Modal */}
              </div>
            </div>
          </div>
          {/* / Content */}
          {/* Footer */}
          <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
              <div className="mb-2 mb-md-0">
                ©
                , made with ❤️ by
                <a href="https://themeselection.com" target="_blank" className="footer-link fw-bolder">ThemeSelection</a>
              </div>
              <div>
                <a href="https://themeselection.com/license/" className="footer-link me-4" target="_blank">License</a>
                <a href="https://themeselection.com/" target="_blank" className="footer-link me-4">More Themes</a>
                <a href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/" target="_blank" className="footer-link me-4">Documentation</a>
                <a href="https://themeselection.com/support/" target="_blank" className="footer-link d-none d-sm-inline-block">Support</a>
              </div>
            </div>
          </footer>
          {/* / Footer */}
          <div className="content-backdrop fade" />
        </div>
        {/* Content wrapper */}
      </div>
      {/* / Layout page */}
    </div>
    {/* Overlay */}
    <div className="layout-overlay layout-menu-toggle" />
    {/* Drag Target Area To SlideIn Menu On Small Screens */}
    <div className="drag-target" />
  </div>
  {/* / Layout wrapper */}
  {/* Core JS */}
  {/* Vendors JS */}
  {/* Main JS */}
  {/* Page JS */}
</div>


  )
}

export default AppCalendar
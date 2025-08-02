import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faPlus, faChevronUp, faChevronDown, faCalendarPlus, faSignOutAlt, faSearch, faFileExcel, faFilePdf, faCalendarCheck, faClock, faBell, faSyncAlt, faUser, faBook, faListOl, faClipboardCheck, faTimes, faCalendarDay, faCheck, faCalendarAlt, faHandshake, faUsers, faGraduationCap, faChalkboardTeacher, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import './sortingcolumn.css';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { mockAPI, mockData } from '../utils/mockData';
import { Modal, Button } from 'react-bootstrap';

// Import FontAwesomeIcon component

// Import the specific icons you are using
import { faCheckCircle, faTrash, faExclamationTriangle, faInfoCircle, faCog, faUserGraduate, faCalendarTimes } from '@fortawesome/free-solid-svg-icons';

// Add this CSS at the top of the file after imports
const headerStyles = `
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  .animated-header {
    background: linear-gradient(
      270deg,
      #2E1437,
      #D13B3B,
      #F0A500,
      #D13B3B,
      #2E1437
    );
    background-size: 300% 300%;
    animation: gradientAnimation 15s ease infinite;
    padding: 1rem 0;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
  }

  .animated-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.12) 100%
    );
    pointer-events: none;
  }

  @media (min-width: 768px) {
    .animated-header {
      padding: 1.25rem 0;
      margin-bottom: 1.5rem;
    }
  }

  @media (min-width: 992px) {
    .animated-header {
      padding: 1.5rem 0;
      margin-bottom: 2rem;
    }
  }

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .typing-text {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid #FFD700;
    animation: typing 3.5s steps(40, end),
               blink-caret 0.75s step-end infinite;
    margin: 0;
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #FFD700 }
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #FFD700;
    font-family: 'Segoe UI', Arial, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
    text-align: center;
    line-height: 1.2;
  }

  @media (min-width: 576px) {
    .header-title {
      font-size: 1.8rem;
    }
  }

  @media (min-width: 768px) {
    .header-title {
      font-size: 2rem;
    }
  }

  @media (min-width: 992px) {
    .header-title {
      font-size: 2.5rem;
    }
  }

  .header-title:hover {
    transform: scale(1.02);
  }

  .header-subtitle {
    font-size: 0.9rem;
    color: #ffffff;
    text-align: center;
    margin-top: 0.5rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 768px) {
    .header-subtitle {
      font-size: 1rem;
      margin-top: 1rem;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  /* Compact Header Buttons */
  .header-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.8rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.95);
    color: #2E1437;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    min-width: 36px;
    min-height: 36px;
  }

  @media (min-width: 576px) {
    .header-btn {
      padding: 0.6rem 0.875rem;
      font-size: 0.85rem;
      min-width: 40px;
      min-height: 40px;
    }
  }

  @media (min-width: 768px) {
    .header-btn {
      padding: 0.7rem 1rem;
      font-size: 0.9rem;
      min-width: 44px;
      min-height: 44px;
    }
  }

  @media (min-width: 992px) {
    .header-btn {
      padding: 0.8rem 1.25rem;
      font-size: 0.95rem;
    }
  }

  .header-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 1);
    color: #D13B3B;
  }

  .header-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .header-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
  }

  /* Notification Button Special Styling */
  .notification-btn {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  }

  .notification-btn:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 240, 200, 0.9));
  }

  /* Logout Button Special Styling */
  .logout-btn {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  }

  .logout-btn:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 240, 200, 0.9));
  }

  /* Report Button Special Styling */
  .report-btn {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  }

  .report-btn:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 240, 200, 0.9));
  }

  /* Compact Header Layout */
  .header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
  }

  @media (min-width: 768px) {
    .header-container {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      padding: 1rem 2rem;
    }
  }

  @media (min-width: 1200px) {
    .header-container {
      padding: 1.25rem 3rem;
    }
  }

  /* Compact Logo Section */
  .header-logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
    flex: 1;
  }

  @media (min-width: 768px) {
    .header-logo-section {
      gap: 1rem;
    }
  }

  .header-logo {
    height: 32px;
    width: auto;
    object-fit: contain;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  }

  @media (min-width: 576px) {
    .header-logo {
      height: 38px;
    }
  }

  @media (min-width: 768px) {
    .header-logo {
      height: 42px;
    }
  }

  @media (min-width: 992px) {
    .header-logo {
      height: 48px;
    }
  }

  .header-logo:hover {
    transform: scale(1.03);
    filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.2));
  }

  /* Compact Title Section */
  .header-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    text-align: left;
  }

  @media (min-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 0.25rem;
      text-align: left;
    }
  }

  .header-title-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    position: relative;
  }

  @media (min-width: 768px) {
    .header-title-container {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
  }

  .header-title {
    font-size: 1rem;
    font-weight: 700;
    color: #FFD700;
    font-family: 'Segoe UI', Arial, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    text-align: left;
    line-height: 1.2;
    letter-spacing: 0.3px;
    margin: 0;
  }

  @media (min-width: 576px) {
    .header-title {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 768px) {
    .header-title {
      font-size: 1.25rem;
      text-align: left;
    }
  }

  @media (min-width: 992px) {
    .header-title {
      font-size: 1.4rem;
    }
  }

  @media (min-width: 1200px) {
    .header-title {
      font-size: 1.6rem;
    }
  }

  .header-title:hover {
    transform: scale(1.01);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  }

  .header-logo-right {
    height: 32px;
    width: auto;
    object-fit: contain;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  }

  @media (min-width: 576px) {
    .header-logo-right {
      height: 38px;
    }
  }

  @media (min-width: 768px) {
    .header-logo-right {
      height: 42px;
    }
  }

  @media (min-width: 992px) {
    .header-logo-right {
      height: 48px;
    }
  }

  .header-logo-right:hover {
    transform: scale(1.03);
    filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.2));
  }

  .header-subtitle {
    font-size: 0.7rem;
    color: #ffffff !important;
    text-align: left;
    margin: 0;
    font-weight: 600;
    letter-spacing: 0.2px;
    line-height: 1.3;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 768px) {
    .header-subtitle {
      font-size: 0.75rem;
      text-align: left;
      color: #ffffff !important;
    }
  }

  @media (min-width: 992px) {
    .header-subtitle {
      font-size: 0.8rem;
      color: #ffffff !important;
    }
  }

  /* Compact Navigation Actions */
  .header-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }

  @media (min-width: 576px) {
    .header-actions {
      flex-direction: row;
      gap: 0.75rem;
      align-items: center;
    }
  }

  @media (min-width: 768px) {
    .header-actions {
      flex-direction: row;
      gap: 1rem;
      width: auto;
      align-items: center;
    }
  }

  @media (min-width: 992px) {
    .header-actions {
      gap: 1.25rem;
    }
  }

  /* Responsive container */
  .responsive-container {
    padding: 0 1rem;
  }

  @media (min-width: 576px) {
    .responsive-container {
      padding: 0 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .responsive-container {
      padding: 0 2rem;
    }
  }

  @media (min-width: 992px) {
    .responsive-container {
      padding: 0 3rem;
    }
  }

  /* Responsive search section */
  .search-section {
    margin-bottom: 1.5rem;
  }

  @media (min-width: 768px) {
    .search-section {
      margin-bottom: 2rem;
    }
  }

  .search-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .search-row {
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }
  }

  .search-input-group {
    flex: 1;
  }

  .search-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  @media (min-width: 576px) {
    .search-actions {
      flex-direction: row;
      gap: 0.75rem;
      align-items: center;
    }
  }

  @media (min-width: 768px) {
    .search-actions {
      flex-direction: row;
      gap: 1rem;
      align-items: center;
    }
  }

  /* Responsive table */
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .responsive-table {
    min-width: 600px;
  }

  @media (max-width: 767px) {
    .responsive-table th,
    .responsive-table td {
      padding: 0.5rem 0.25rem;
      font-size: 0.875rem;
    }
  }

  /* Responsive faculty card */
  .faculty-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media (min-width: 576px) {
    .faculty-card {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
  }

  .faculty-info {
    flex: 1;
  }

  .faculty-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 768px) {
    .faculty-name {
      font-size: 1.1rem;
    }
  }

  .faculty-department {
    font-size: 0.8rem;
    color: #6c757d;
  }

  @media (min-width: 768px) {
    .faculty-department {
      font-size: 0.9rem;
    }
  }

  /* Responsive subjects list */
  .subjects-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media (min-width: 576px) {
    .subjects-list {
      gap: 0.75rem;
    }
  }

  .subject-item {
    padding: 0.5rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    border-left: 3px solid #007bff;
  }

  .subject-code-name {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 768px) {
    .subject-code-name {
      font-size: 1rem;
    }
  }

  .subject-schedule {
    font-size: 0.8rem;
    color: #6c757d;
  }

  @media (min-width: 768px) {
    .subject-schedule {
      font-size: 0.85rem;
    }
  }

  /* Responsive action buttons */
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  @media (min-width: 576px) {
    .action-buttons {
      flex-direction: row;
      gap: 0.75rem;
      align-items: center;
    }
  }

  .book-consultation-btn {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    white-space: nowrap;
  }

  @media (min-width: 576px) {
    .book-consultation-btn {
      font-size: 0.9rem;
      padding: 0.6rem 1.2rem;
    }
  }

  @media (min-width: 768px) {
    .book-consultation-btn {
      font-size: 1rem;
      padding: 0.75rem 1.5rem;
    }
  }

  /* Responsive pagination */
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .pagination {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
  }

  @media (min-width: 576px) {
    .pagination {
      gap: 0.5rem;
    }
  }

  .page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  @media (min-width: 768px) {
    .page-link {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
  }

  /* Responsive modal */
  .responsive-modal .modal-dialog {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }

  @media (min-width: 576px) {
    .responsive-modal .modal-dialog {
      margin: 1.5rem auto;
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    .responsive-modal .modal-dialog {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .responsive-modal .modal-dialog {
      max-width: 960px;
    }
  }

  .modal-body {
    padding: 1rem;
  }

  @media (min-width: 768px) {
    .modal-body {
      padding: 2rem;
    }
  }

  /* Responsive form elements */
  .form-label {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 768px) {
    .form-label {
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
  }

  .form-select,
  .form-control {
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
  }

  @media (min-width: 768px) {
    .form-select,
    .form-control {
      font-size: 1rem;
      padding: 0.75rem 1rem;
    }
  }

  /* Responsive slot buttons */
  .slot-buttons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .slot-btn {
    min-width: 80px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }

  @media (min-width: 576px) {
    .slot-btn {
      min-width: 90px;
      font-size: 0.9rem;
      padding: 0.6rem 1rem;
    }
  }

  @media (min-width: 768px) {
    .slot-btn {
      min-width: 100px;
      font-size: 1rem;
      padding: 0.75rem 1.2rem;
    }
  }

  /* Responsive schedule buttons */
  .schedule-buttons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .schedule-btn {
    min-width: 100px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }

  @media (min-width: 576px) {
    .schedule-btn {
      min-width: 120px;
      font-size: 0.9rem;
      padding: 0.6rem 1rem;
    }
  }

  @media (min-width: 768px) {
    .schedule-btn {
      min-width: 140px;
      font-size: 1rem;
      padding: 0.75rem 1.2rem;
    }
  }

  /* Responsive notification modal */
  .notification-modal .modal-dialog {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }

  @media (min-width: 576px) {
    .notification-modal .modal-dialog {
      margin: 1.5rem auto;
      max-width: 500px;
    }
  }

  /* Responsive feedback modal */
  .feedback-modal .modal-dialog {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }

  @media (min-width: 576px) {
    .feedback-modal .modal-dialog {
      margin: 1.5rem auto;
      max-width: 600px;
    }
  }

  .feedback-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  @media (min-width: 576px) {
    .feedback-buttons {
      gap: 1rem;
    }
  }

  .feedback-btn {
    font-size: 1.5rem;
    padding: 0.5rem;
    min-width: 80px;
  }

  @media (min-width: 576px) {
    .feedback-btn {
      font-size: 2rem;
      padding: 0.75rem;
      min-width: 100px;
    }
  }

  /* Responsive text sizes */
  .responsive-text-sm {
    font-size: 0.875rem;
  }

  .responsive-text-md {
    font-size: 1rem;
  }

  .responsive-text-lg {
    font-size: 1.125rem;
  }

  .responsive-text-xl {
    font-size: 1.25rem;
  }

  @media (min-width: 768px) {
    .responsive-text-sm {
      font-size: 1rem;
    }
    .responsive-text-md {
      font-size: 1.125rem;
    }
    .responsive-text-lg {
      font-size: 1.25rem;
    }
    .responsive-text-xl {
      font-size: 1.5rem;
    }
  }

  /* Responsive spacing */
  .responsive-mb-1 {
    margin-bottom: 0.5rem;
  }

  .responsive-mb-2 {
    margin-bottom: 1rem;
  }

  .responsive-mb-3 {
    margin-bottom: 1.5rem;
  }

  .responsive-mb-4 {
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .responsive-mb-1 {
      margin-bottom: 0.75rem;
    }
    .responsive-mb-2 {
      margin-bottom: 1.5rem;
    }
    .responsive-mb-3 {
      margin-bottom: 2rem;
    }
    .responsive-mb-4 {
      margin-bottom: 2.5rem;
    }
  }

  /* Responsive grid */
  .responsive-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 576px) {
    .responsive-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .responsive-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }

  @media (min-width: 992px) {
    .responsive-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Mobile-first card design */
  .responsive-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }

  @media (min-width: 768px) {
    .responsive-card {
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .responsive-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 768px) {
    .responsive-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  }

  /* Responsive button groups */
  .responsive-btn-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media (min-width: 576px) {
    .responsive-btn-group {
      flex-direction: row;
      gap: 0.75rem;
    }
  }

  /* Responsive icons */
  .responsive-icon {
    font-size: 1rem;
  }

  @media (min-width: 576px) {
    .responsive-icon {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 768px) {
    .responsive-icon {
      font-size: 1.2rem;
    }
  }

  /* Responsive alerts */
  .responsive-alert {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }

  @media (min-width: 768px) {
    .responsive-alert {
      font-size: 1rem;
      padding: 1rem 1.5rem;
    }
  }

  /* Responsive badges */
  .responsive-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  @media (min-width: 768px) {
    .responsive-badge {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
    }
  }

  /* Responsive table headers */
  .responsive-table th {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.75rem 0.5rem;
  }

  @media (min-width: 768px) {
    .responsive-table th {
      font-size: 1rem;
      padding: 1rem 0.75rem;
    }
  }

  /* Responsive table cells */
  .responsive-table td {
    font-size: 0.875rem;
    padding: 0.75rem 0.5rem;
    vertical-align: middle;
  }

  @media (min-width: 768px) {
    .responsive-table td {
      font-size: 1rem;
      padding: 1rem 0.75rem;
    }
  }

  /* Responsive modal footer */
  .modal-footer {
    padding: 1rem;
    gap: 0.5rem;
  }

  @media (min-width: 576px) {
    .modal-footer {
      padding: 1.5rem;
      gap: 0.75rem;
    }
  }

  /* Responsive form groups */
  .form-group {
    margin-bottom: 1rem;
  }

  @media (min-width: 768px) {
    .form-group {
      margin-bottom: 1.5rem;
    }
  }

  /* Responsive row and column spacing */
  .row {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }

  @media (min-width: 768px) {
    .row {
      margin-left: -0.75rem;
      margin-right: -0.75rem;
    }
  }

  .col, .col-md-6, .col-12 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  @media (min-width: 768px) {
    .col, .col-md-6, .col-12 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
  }
`;

// Add custom styles for notification bell and modal
const notificationStyles = `
  .notification-bell-btn {
    box-shadow: 0 2px 8px rgba(44,62,80,0.08);
    transition: background 0.2s, box-shadow 0.2s;
    color: #2E1437;
    position: relative;
  }
  .notification-bell-btn:hover, .notification-bell-btn:focus {
    background: #ffe082 !important;
    color: #d13b3b !important;
    box-shadow: 0 4px 16px rgba(241,196,15,0.15);
  }
  .notification-badge {
    background: linear-gradient(135deg, #d13b3b, #b91c1c) !important;
    color: #fff !important;
    font-weight: 600;
    font-size: 0.7rem;
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 8px rgba(209, 59, 59, 0.25);
    border-radius: 8px;
    padding: 0.2rem 0.4rem;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 2px 8px rgba(209, 59, 59, 0.25);
    }
    50% {
      box-shadow: 0 2px 12px rgba(209, 59, 59, 0.4);
    }
    100% {
      box-shadow: 0 2px 8px rgba(209, 59, 59, 0.25);
    }
  }
  .notification-item.unread {
    background: #fffbe6 !important;
    font-weight: 600;
    border-left: 4px solid #f0a500;
  }
  .notification-item.read {
    background: #f8f9fa;
    color: #888;
  }
`;

// Modern Consultation Modal Styles
const modernModalStyles = `
  /* Modal Container */
  .modern-consultation-modal .modal-content {
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
    border: none;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modern-consultation-modal .modal-content:hover {
    box-shadow: 0 25px 80px rgba(59, 130, 246, 0.2);
  }

  /* Modal Header */
  .modern-modal-header {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none;
    padding: 2rem 2rem 1.5rem;
    position: relative;
  }

  .modern-modal-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }

  .modern-modal-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    position: relative;
    z-index: 1;
  }

  .title-icon-wrapper {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 0.75rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .title-icon {
    font-size: 1.5rem;
    color: white;
  }

  .title-content h4 {
    color: white;
    font-weight: 700;
    font-size: 1.5rem;
    margin: 0;
  }

  .title-content p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-size: 0.875rem;
  }

  .modern-modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;
    transition: all 0.2s ease;
    position: relative;
    z-index: 1;
  }

  .modern-modal-header .btn-close:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  /* Modal Body */
  .modern-modal-body {
    padding: 2rem;
    background: #ffffff;
  }

  /* Progress Indicator */
  .booking-progress {
    margin-bottom: 2rem;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: 0 1rem;
  }

  .progress-steps::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e2e8f0;
    transform: translateY(-50%);
    z-index: 0;
  }

  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
  }

  .step-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .progress-step.active .step-icon {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }

  .progress-step.completed .step-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  }

  .step-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-align: center;
    transition: color 0.3s ease;
  }

  .progress-step.active .step-label,
  .progress-step.completed .step-label {
    color: #1e293b;
  }

  /* Cards */
  .info-card,
  .selection-card,
  .summary-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .info-card:hover,
  .selection-card:hover,
  .summary-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .card-header-modern {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 1.5rem 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }

  .header-content h6 {
    color: #1e293b;
    font-weight: 700;
    margin: 0;
  }

  .header-content p {
    color: #64748b;
    margin: 0;
    font-size: 0.875rem;
  }

  .card-body-modern {
    padding: 1.5rem;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  /* Form Elements */
  .form-group-modern {
    margin-bottom: 1.5rem;
  }

  .form-label-modern {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .required-indicator {
    color: #ef4444;
    margin-left: 0.25rem;
  }

  .select-wrapper {
    position: relative;
  }

  .form-select-modern {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    transition: all 0.3s ease;
    appearance: none;
    cursor: pointer;
  }

  .form-select-modern:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .form-select-modern.is-valid {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .form-select-modern.is-invalid {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .select-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    pointer-events: none;
    transition: color 0.3s ease;
  }

  .form-select-modern:focus + .select-icon {
    color: #3b82f6;
  }

  /* Validation Messages */
  .validation-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .validation-message.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .validation-message.success {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  /* Schedule Selection */
  .schedule-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .day-schedule-group {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .day-header {
    display: flex;
    align-items: center;
    color: #1e293b;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .schedule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .schedule-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    text-align: left;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .schedule-card:hover:not(.disabled) {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  .schedule-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
  }

  .schedule-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f1f5f9;
  }

  .schedule-time {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #1e293b;
  }

  .schedule-slots {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .slot-count {
    font-weight: 600;
  }

  .availability {
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .availability.available {
    background: #f0fdf4;
    color: #16a34a;
  }

  .availability.unavailable {
    background: #fef2f2;
    color: #dc2626;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: #64748b;
  }

  .empty-icon {
    font-size: 3rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  .empty-state h6 {
    color: #475569;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  /* Slot Selection */
  .slot-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 1rem;
  }

  .slot-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem 0.5rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 80px;
  }

  .slot-card:hover:not(.booked) {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  .slot-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
  }

  .slot-card.booked {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f1f5f9;
  }

  .slot-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slot-number .number {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
  }

  .slot-status .status {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .slot-status .status.available {
    color: #16a34a;
  }

  .slot-status .status.booked {
    color: #dc2626;
  }

  /* Summary Card */
  .summary-card {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1px solid #fbbf24;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .summary-item label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #d97706;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .summary-item span {
    font-size: 0.875rem;
    font-weight: 600;
    color: #92400e;
  }

  /* Modal Footer */
  .modern-modal-footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 1.5rem 2rem;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .btn-modern {
    padding: 0.875rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-outline-secondary.btn-modern {
    background: #ffffff;
    color: #64748b;
    border: 2px solid #e2e8f0;
  }

  .btn-outline-secondary.btn-modern:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .btn-primary.btn-modern {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn-primary.btn-modern:hover:not(.disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-modern.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .footer-validation {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid #fbbf24;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .modern-modal-body {
      padding: 1.5rem;
    }

    .modern-modal-header {
      padding: 1.5rem 1.5rem 1rem;
    }

    .title-content h4 {
      font-size: 1.25rem;
    }

    .progress-steps {
      margin: 0 0.5rem;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .step-label {
      font-size: 0.7rem;
    }

    .info-grid,
    .schedule-grid,
    .slot-container {
      grid-template-columns: 1fr;
    }

    .footer-content {
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-modern {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .modern-modal-body {
      padding: 1rem;
    }

    .card-header-modern,
    .card-body-modern {
      padding: 1rem;
    }

    .schedule-card,
    .slot-card {
      padding: 0.75rem;
    }
  }
`;

const StudentConsultations = () => {
  // State declarations at the top
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [faculty, setFaculty] = useState([]);
  const [sortedFaculty, setSortedFaculty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFacultySchedule, setSelectedFacultySchedule] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [maxSlots, setMaxSlots] = useState(0);
  const [bookedSlots, setBookedSlots] = useState(0);
  const [slotInfo, setSlotInfo] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [facultySchedules, setFacultySchedules] = useState([]);
  const [pendingConsultations, setPendingConsultations] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  // Add state for clipboard modal
  const [showClipboardModal, setShowClipboardModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [reportMessage, setReportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // Add state for missing fields
  const [missingFields, setMissingFields] = useState([]);
  const prevConsultationsRef = useRef([]); // Track previous consultations

  const navigate = useNavigate();

  // Initialize axios headers
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Set default headers for all axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [navigate]);

  // Move fetchFacultyData to top-level in StudentConsultations
  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Use mock data instead of real API
      const facultyData = mockData.faculty.map(f => ({
        _id: f.id,
        name: f.name,
        email: f.email,
        school_id: f.id,
        department: f.department,
        contact_number: 'N/A',
        subjects: f.subjects,
        schedules: f.schedule.map(s => ({
          _id: `${f.id}-${s.day}`,
          day: s.day,
          time: s.time,
          location: s.location,
          subjectId: f.subjects[0]
        }))
      }));
      
      setFaculty(facultyData);
      setSortedFaculty(facultyData);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch faculty data. Please try again later.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, [navigate]);

  // Effect to sort the faculty whenever the list or sorting configuration changes
  useEffect(() => {
    const sortedData = [...faculty].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedFaculty(sortedData);
  }, [faculty, sortConfig]);

  // Filter faculty based on search query
  const filteredResults = sortedFaculty.filter(f =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.school_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const [newStudent, setNewStudent] = useState({
    school_id: '',
    name: '',
    email: '',
    password: '',
    contact_number: '',
    program: '',
    year_level: '',
    section: '',
    topics_or_subjects: '',
    academic_year: '',
  });
  
  const [errorMessage, setErrorMessage] = useState(''); // Error message for failed API calls
  const [sortedStudents, setSortedStudents] = useState([]); // Sorted list of students
  const [isHovered, setIsHovered] = useState(false); // Hover state for UI interactions
  const [showViewModal, setShowViewModal] = useState(false); // Modal visibility for viewing student
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for view/update actions

  const [formData, setFormData] = useState({
    school_id: '',
    name: '',
    email: '',
    contactNumber: '',
    program: '',
    yearLevel: '',
    section: '',
    topicsOrSubjects: '',
    academicYear: '',
  });

  useEffect(() => {
    if (selectedFaculty) {
      setFormData({
        schoolId: selectedFaculty.school_id || '',
        name: selectedFaculty.name || '',
        email: selectedFaculty.email || '',
        contactNumber: selectedFaculty.contact_number || '',
        program: selectedFaculty.program || '',
        yearLevel: selectedFaculty.year_level || '',
        section: selectedFaculty.section || '',
        topicsOrSubjects: Array.isArray(selectedFaculty.topics_or_subjects) ? selectedFaculty.topics_or_subjects.join(', ') : '',
        academicYear: selectedFaculty.academic_year || '',
      });
    }
  }, [selectedFaculty]); // Run when selectedStudent changes //UPDATE NI SYA

    // Function to fetch consultations
    const fetchConsultations = async () => {
      try {
      const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!token || !userData.id) {
          console.log('No token or user ID found');
          return;
        }

        // Use mock data instead of real API
        const newConsultations = mockData.consultations.filter(c => c.studentId === userData.id);
        
        // Compare previous and new consultations for status changes
        const prevConsultations = prevConsultationsRef.current;
        // Only run notification logic if prevConsultations is not empty (not first load)
        if (prevConsultations.length > 0) {
          newConsultations.forEach(newC => {
            const prevC = prevConsultations.find(c => c._id === newC._id);
            if (prevC && prevC.status !== newC.status) {
              // Only notify if status changed from pending to approved/rejected
              if (
                (prevC.status === 'pending' && (newC.status === 'approved' || newC.status === 'rejected')) ||
                (prevC.status !== newC.status && (newC.status === 'approved' || newC.status === 'rejected'))
              ) {
                const newNotification = {
                  id: newC._id,
                  title: newC.status === 'approved' ? 'Consultation Approved' : 'Consultation Rejected',
                  message: newC.status === 'approved'
                    ? `Your consultation for ${newC.subjectId?.subjectName || 'a subject'} has been approved!`
                    : `Your consultation for ${newC.subjectId?.subjectName || 'a subject'} has been rejected.`,
                  time: new Date().toLocaleString(),
                  isRead: false,
                  status: newC.status
                };
                setStudentNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
                // Show notification popup
                Swal.fire({
                  icon: newC.status === 'approved' ? 'success' : 'error',
                  title: 'Consultation Update',
                  text: newNotification.message,
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                });
              }
            }
          });
        }
        prevConsultationsRef.current = newConsultations;
        setConsultations(newConsultations);
        // Debug log
        console.log('Fetched consultations for student:', newConsultations);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        if (error.response?.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please log in again'
          });
          navigate('/login');
        }
      }
    };

    useEffect(() => {
      const handleStatusUpdate = (event) => {
        const { consultationId, newStatus } = event.detail;
        
        // Update consultations list
        setConsultations(prevConsultations => 
          prevConsultations.map(consultation => {
            if (consultation._id === consultationId) {
              console.log(`Updating consultation ${consultationId} status to ${newStatus}`);
              return { ...consultation, status: newStatus };
            }
            return consultation;
          })
        );

        // Create a new notification for approved/rejected status
        if (newStatus === 'approved' || newStatus === 'rejected') {
          const newNotification = {
            id: consultationId,
            title: newStatus === 'approved' ? 'Consultation Approved' : 'Consultation Rejected',
            message: newStatus === 'approved'
              ? `Your consultation has been approved!`
              : `Your consultation has been rejected.`,
            time: new Date().toLocaleString(),
            isRead: false,
            status: newStatus
          };

          // Add to notifications list
          setStudentNotifications(prev => [newNotification, ...prev]);
          
          // Update unread count
          setUnreadCount(prev => prev + 1);
        }

        // Show notification to student
        const statusMessages = {
          approved: 'Your consultation request has been approved!',
          rejected: 'Your consultation request has been rejected.',
          completed: 'Your consultation has been marked as completed.',
          pending: 'Your consultation status has been updated to pending.'
        };

        Swal.fire({
          icon: newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'error' : 'info',
          title: 'Consultation Update',
          text: statusMessages[newStatus] || `Consultation status updated to ${newStatus}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      };

      // Listen for status updates
      window.addEventListener('consultationStatusUpdated', handleStatusUpdate);

      // Cleanup listener
      return () => {
        window.removeEventListener('consultationStatusUpdated', handleStatusUpdate);
      };
    }, []);

    // Add periodic refresh for real-time updates
    useEffect(() => {
      const interval = setInterval(() => {
        // Only refresh if the page is visible and user is active
        if (document.visibilityState === 'visible') {
          fetchConsultations(); // Silent refresh, no popup
        }
      }, 60000); // Refresh every 60 seconds (1 minute)

      return () => clearInterval(interval);
    }, []);

    // Add a manual refresh function
    const refreshNotifications = async () => {
      console.log('Manual refresh triggered');
      try {
        await fetchConsultations();
        // No popup, silent refresh
      } catch (error) {
        console.error('Error refreshing:', error);
        // Optionally, you can keep an error popup here if you want
      }
    };

    // Function to handle subject selection
    const handleSubjectSelect = async (subject) => {
      console.log('Starting subject selection...');
      console.log('Selected subject:', subject);
      setSelectedSubject(subject);
      setSelectedSchedule(null);
      setSelectedSlot(null);
      
      try {
        const token = localStorage.getItem('authToken');
        console.log('Current token:', token);
        console.log('Selected faculty:', selectedFaculty);
        
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please log in to view schedules'
          });
          navigate('/login');
          return;
        }

        // Use the schedule from the subject directly
        if (subject.schedule) {
          console.log('Using subject schedule:', subject.schedule);
          
          // Create a schedule object with the subject's schedule data
          const schedule = {
            day: subject.schedule.day,
            startTime: subject.schedule.startTime,
            endTime: subject.schedule.endTime,
            location: subject.room,
            facultyId: selectedFaculty._id,
            subjectId: subject._id,
            maxSlots: 2 // Default to 2 slots
          };

          // Get current bookings for the subject
          const bookingsResponse = await axios.get(
            `http://localhost:5000/api/consultations/subject/${subject._id}/count`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          console.log('Bookings for subject:', subject._id, ':', bookingsResponse.data);
          
          const scheduleWithBookings = {
            ...schedule,
            _id: subject._id, // Use subject ID as temporary schedule ID
            currentSlots: bookingsResponse.data.count || 0,
            isFullyBooked: (bookingsResponse.data.count || 0) >= schedule.maxSlots
          };

          console.log('Processed schedule with bookings:', scheduleWithBookings);
          setFacultySchedules([scheduleWithBookings]);
        } else {
          console.log('No schedule found in subject');
          setFacultySchedules([]);
          Swal.fire({
            icon: 'info',
            title: 'No Schedules Available',
            text: 'No consultation schedule found for this subject'
          });
        }
      } catch (error) {
        console.error('Error in handleSubjectSelect:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch schedules'
        });
      }
    };

    // Function to format time
    const formatTime = (timeString) => {
      if (!timeString) return 'Not set';
      try {
        // If timeString is already in HH:mm format, just return it
        if (timeString.match(/^\d{2}:\d{2}$/)) {
          return timeString;
        }
        // If it's a date string, convert it
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return timeString; // If invalid date, return original
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error('Error formatting time:', error);
        return timeString; // Return original if error
      }
    };

    // Function to format schedule display
    const formatSchedule = (schedule) => {
      if (!schedule || !schedule.day || !schedule.startTime || !schedule.endTime) {
        return 'Schedule not set';
      }
      const formattedStartTime = formatTime(schedule.startTime);
      const formattedEndTime = formatTime(schedule.endTime);
      return `${schedule.day} ${formattedStartTime} - ${formattedEndTime}`;
    };

  // Function to check if a schedule is booked
  const isScheduleBooked = async (schedule) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `http://localhost:5000/api/consultations/subject/${schedule.subjectId}/count`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const { count, maxSlots, remainingSlots, isFullyBooked } = response.data;
      return {
        isFullyBooked,
        remainingSlots,
        maxSlots
      };
    } catch (error) {
      console.error('Error checking schedule availability:', error);
      return { isFullyBooked: false, remainingSlots: 0, maxSlots: 0 };
    }
  };

  // Function to handle consultation booking
  const handleBookConsultation = async () => {
    console.log('handleBookConsultation called with:', {
      selectedFaculty: selectedFaculty?._id,
      selectedSubject: selectedSubject?._id,
      selectedSchedule: selectedSchedule?._id,
      selectedSlot,
    });

    if (!selectedFaculty || !selectedSubject || !selectedSchedule || !selectedSlot) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields'
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please log in to book a consultation'
        });
        navigate('/login');
        return;
      }

      console.log('Booking consultation with data:', {
        faculty: selectedFaculty._id,
        subject: selectedSubject._id,
        schedule: selectedSchedule,
        slot: selectedSlot,
      });

      // Create consultation using subject's schedule
      const response = await axios.post(
        'http://localhost:5000/api/consultations',
        {
          facultyId: selectedFaculty._id,
          subjectId: selectedSubject._id,
          scheduleId: selectedSubject._id, // Use subject ID since schedule is part of subject
          section: 'N/A', // Provide a default value for section
          slot: selectedSlot,
          schedule: {
            day: selectedSchedule.day,
            startTime: selectedSchedule.startTime,
            endTime: selectedSchedule.endTime,
            location: selectedSchedule.location
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Booking response:', response);

      if (response.status === 201) {
        await handleBookingSuccess(); // Refresh consultations list
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Consultation booked successfully!'
        });
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book consultation';
      console.log('Server error response:', error.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    }
  };

  // Function to handle successful booking
  const handleBookingSuccess = async () => {
    console.log('handleBookingSuccess called');
    try {
      await fetchConsultations(); // Remove the parameter, use the existing function
      console.log('Consultations refreshed successfully');
    } catch (error) {
      console.error('Error refreshing consultations:', error);
    }
  };

  // Function to group schedules by day
  const groupSchedulesByDay = (schedules) => {
    const grouped = {};
    schedules.forEach(schedule => {
      if (!grouped[schedule.day]) {
        grouped[schedule.day] = [];
      }
      grouped[schedule.day].push(schedule);
    });
    return grouped;
  };

  // Add consultation status badge component
  const ConsultationStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'warning';
        case 'approved':
          return 'success';
        case 'rejected':
          return 'danger';
        case 'completed':
          return 'info';
        default:
          return 'secondary';
      }
    };

    return (
      <span className={`badge bg-${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.replace('/login');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
    setSelectedSubject(null);
    setSelectedSchedule(null);
    setSelectedSlot(null);
  };

  // Add export functions
  // Remove exportToExcel function and button

  // Update exportToPDF to export notification history
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const now = new Date();
      const dateString = now.toLocaleString();
      // Get student name from localStorage or context
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const studentName = userData.name || 'Student';
      // Title
      doc.setFontSize(16);
      doc.text(`Consultation History`, 14, 15);
      doc.setFontSize(12);
      doc.text(`Student: ${studentName}`, 14, 25);
      doc.text(`Date: ${dateString}`, 14, 32);
      // Table data from notification bell (studentNotifications)
      const tableData = studentNotifications.map(n => [
        n.time,
        n.status,
        n.message
      ]);
      doc.autoTable({
        head: [["Date", "Status", "Message"]],
        body: tableData,
        startY: 38,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 100 }
        }
      });
      doc.save('consultation_history.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export consultation history to PDF',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Add this effect to fetch pending consultations
  useEffect(() => {
    const fetchStudentConsultations = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.id) {
          console.error('No user data found');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/consultations/student/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPendingConsultations(response.data);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      }
    };

    fetchStudentConsultations();
  }, [navigate]);

  // Effect to filter notifications for debugging: show ALL consultations
  useEffect(() => {
    const filtered = consultations.map((c) => ({
      id: c._id,
      title: c.status ? `Consultation ${c.status.charAt(0).toUpperCase() + c.status.slice(1)}` : 'Consultation',
      message: `With ${c.facultyId?.name || c.facultyName || 'faculty'} for ${c.subjectId?.subjectName || c.subjectName || 'subject'} (Status: ${c.status})`,
      time: c.updatedAt ? new Date(c.updatedAt).toLocaleString() : new Date().toLocaleString(),
      isRead: c.isRead || false,
      status: c.status
    }));
    setStudentNotifications(filtered);
    setUnreadCount(filtered.filter(n => !n.isRead).length);
  }, [consultations]);

  // Handler to mark all notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:5000/api/consultations/notifications/read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Handler for clicking a notification (could add more logic)
  const handleNotificationClick = (id) => {
    setStudentNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setShowNotifications(false);
  };

  // NotificationModal component
  const NotificationModal = ({ show, onHide }) => (
    <Modal show={show} onHide={onHide} centered className="notification-modal">
      <Modal.Header closeButton>
        <Modal.Title className="responsive-text-lg">Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="notification-list">
          {studentNotifications.length > 0 ? (
            studentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item p-3 border-bottom ${!notification.isRead ? 'unread' : 'read'}`}
                style={{ cursor: 'pointer', borderRadius: '6px', marginBottom: '4px' }}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-1 responsive-text-md" style={{ color: !notification.isRead ? '#d13b3b' : '#888' }}>{notification.title}</h6>
                  <small className="text-muted responsive-text-sm">{notification.time}</small>
                </div>
                <p className="mb-0 responsive-text-sm" style={{ color: !notification.isRead ? '#2E1437' : '#aaa' }}>{notification.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted my-3 responsive-text-md">No notifications</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <div className="responsive-btn-group">
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={markNotificationsAsRead}>
            <span className="d-none d-sm-inline">Mark all as read</span>
            <span className="d-inline d-sm-none">Mark Read</span>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );

  // Add this useEffect to track modal state
  useEffect(() => {
    console.log('Modal state changed:', showModal);
    if (showModal) {
      console.log('Current states when modal opens:', {
        selectedFaculty,
        selectedSubject,
        selectedSchedule,
      });
    }
  }, [showModal]);

  // Add useEffect to track selectedFaculty changes
  useEffect(() => {
    console.log('selectedFaculty changed:', selectedFaculty);
  }, [selectedFaculty]);

  // Add useEffect to track selectedSubject changes
  useEffect(() => {
    console.log('selectedSubject changed:', selectedSubject);
  }, [selectedSubject]);

  // Add useEffect to track selectedSchedule changes
  useEffect(() => {
    console.log('selectedSchedule changed:', selectedSchedule);
  }, [selectedSchedule]);

  // Function to handle schedule selection
  const handleScheduleSelect = (schedule) => {
    console.log('Selecting schedule:', schedule);
    setSelectedSchedule(schedule);
    setSelectedSlot(null);
    
    // Log the schedule details
    console.log('Selected schedule details:', {
      id: schedule._id,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      maxSlots: schedule.maxSlots,
      currentSlots: schedule.currentSlots,
      isFullyBooked: schedule.isFullyBooked
    });
  };

  // Update handlers for report modal
  const handleOpenClipboardModal = () => {
    setShowClipboardModal(true);
    setSelectedFeedback(null); // Reset selection when opening
    setReportMessage(''); // Reset message when opening
  };

  const handleCloseClipboardModal = () => {
    setShowClipboardModal(false);
  };

  const handleFeedbackSelect = (emoji) => {
    setSelectedFeedback(emoji);
  };

  const handleReportMessageChange = (e) => {
    setReportMessage(e.target.value);
  };

  const handleSubmitReport = async () => {
    if (!selectedFeedback) {
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select an emoji to express your experience.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Get user data from localStorage if available
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Create the report payload - simplified
      const reportData = {
        userName: userData.name || 'Anonymous Student',
        userEmail: userData.email || 'No email provided',
        title: `Student Feedback: ${selectedFeedback}`,
        message: reportMessage || 'No additional details provided.',
        emoji: selectedFeedback,
        reportType: 'Student Feedback',
        sender: userData.name || 'Anonymous Student'
      };

      console.log('Sending report data:', reportData);

      // Send report without authentication header
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        reportData
      );

      console.log('Report submission response:', response);

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Thank You!',
          text: 'Your feedback has been submitted successfully.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        handleCloseClipboardModal();
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Unable to submit your feedback. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles + notificationStyles + modernModalStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Function to handle faculty selection
  const handleFacultySelect = async (faculty) => {
    console.log('Selected faculty:', faculty);
    try {
      // Set the selected faculty with all required properties
      const facultyData = {
        _id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        contact_number: faculty.contact_number, // Ensure this is included
        schedules: faculty.schedules || [],
        subjects: faculty.subjects || []
      };
      console.log('Setting faculty data:', facultyData);
      setSelectedFaculty(facultyData);
      
      // Set the faculty's subjects
      if (faculty.subjects && Array.isArray(faculty.subjects)) {
        console.log('Setting faculty subjects:', faculty.subjects);
        setSelectedSubjects(faculty.subjects);
      } else {
        console.log('No subjects found for faculty');
        setSelectedSubjects([]);
      }

      // Reset other states
      setSelectedSubject(null);
      setSelectedSchedule(null);
      setFacultySchedules([]);

      // Show the modal after setting all states
      setShowModal(true);
    } catch (error) {
      console.error('Error selecting faculty:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load faculty details. Please try again.'
      });
    }
  };

  // Update Book Consultation button logic to check missing fields
  const isBookDisabled = !selectedFaculty || !selectedSubject || !selectedSchedule || !selectedSlot;

  // Add debugging function
  const debugBookingState = () => {
    console.log('=== BOOKING STATE DEBUG ===');
    console.log('selectedFaculty:', selectedFaculty);
    console.log('selectedSubject:', selectedSubject);
    console.log('selectedSchedule:', selectedSchedule);
    console.log('selectedSlot:', selectedSlot);
    console.log('isBookDisabled:', isBookDisabled);
    console.log('missingFields:', missingFields);
    console.log('==========================');
  };

  useEffect(() => {
    const missing = [];
    if (!selectedSubject) missing.push('Subject');
    if (!selectedSchedule) missing.push('Schedule');
    if (!selectedSlot) missing.push('Slot');
    setMissingFields(missing);
    
    // Debug on state changes
    debugBookingState();
  }, [selectedSubject, selectedSchedule, selectedSlot]);

  return (
    <div className="container-fluid p-0">
      {/* Header Section with Animated Gradient */}
      <div className="animated-header">
        <div className="header-container">
          {/* Logo and Title Section */}
          <div className="header-logo-section">
            <img
              src="/assets/img/branding/brand-img-small.png"
              alt="School Logo"
              className="header-logo"
            />
            <div className="header-content">
              <div className="header-title-container">
                <h1 className="header-title fade-in-up">
                  Faculty Consultation Management System
                </h1>
                <img
                  src="/assets/img/branding/brand-img-right.png"
                  alt="Right Logo"
                  className="header-logo-right"
                />
              </div>
              <p className="header-subtitle">
                Schedule and manage your faculty consultations efficiently
              </p>
            </div>
          </div>
          
          {/* Navigation Actions */}
          <div className="header-actions">
            <div className="position-relative d-inline-block">
              <button
                className="header-btn notification-btn"
                onClick={() => {
                  refreshNotifications();
                  setShowNotifications(true);
                }}
                aria-label="Show notifications"
              >
                <FontAwesomeIcon icon={faBell} className="responsive-icon" />
              </button>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle notification-badge">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              className="header-btn report-btn"
              onClick={handleOpenClipboardModal}
              aria-label="Submit feedback"
            >
              <span role="img" aria-label="clipboard" className="responsive-icon">📋</span>
            </button>
            <button 
              className="header-btn logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="responsive-icon" />
              <span className="d-none d-sm-inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <NotificationModal show={showNotifications} onHide={() => setShowNotifications(false)} />

      <div className="responsive-container">
        {/* Search and Export Section */}
        <div className="card responsive-card search-section">
          <div className="card-body">
            <div className="search-row">
              <div className="search-input-group">
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <FontAwesomeIcon icon={faSearch} className="text-muted responsive-icon" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Search faculty..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="search-actions">
                <button 
                  onClick={exportToPDF}
                  className="btn btn-danger"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="responsive-icon me-2" />
                  <span className="d-none d-sm-inline">Export to PDF</span>
                  <span className="d-inline d-sm-none">PDF</span>
                </button>
                <button
                  onClick={fetchFacultyData}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    <FontAwesomeIcon icon={faSyncAlt} className="responsive-icon me-2" />
                  )}
                  <span className="d-none d-sm-inline">Refresh</span>
                  <span className="d-inline d-sm-none">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty List Section */}
        <div className="card responsive-card">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 responsive-text-lg">Available Faculty Members</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle responsive-table">
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Subjects</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((f) => (
                    <tr key={f._id}>
                      <td>
                        <div className="faculty-card">
                          <div className="faculty-info">
                            <h6 className="mb-0 faculty-name">{f.name}</h6>
                            <small className="text-muted faculty-department">{f.department || 'Department not specified'}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {f.subjects && f.subjects.length > 0 ? (
                          <div className="subjects-list">
                            {f.subjects.map((subject) => (
                              <div key={subject._id} className="subject-item">
                                <div className="subject-code-name">{subject.subjectCode} - {subject.subjectName}</div>
                                {subject.schedule && (
                                  <div className="subject-schedule">
                                    <FontAwesomeIcon icon={faCalendarCheck} className="me-1 responsive-icon" />
                                    {subject.schedule.startTime}-{subject.schedule.endTime}
                                    <br />
                                    Location: {subject.room}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No subjects assigned</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary book-consultation-btn"
                            onClick={() => {
                              console.log('Faculty button clicked:', f);
                              handleFacultySelect(f);
                            }}
                          >
                            <FontAwesomeIcon icon={faCalendarPlus} className="responsive-icon me-2" />
                            <span className="d-none d-sm-inline">Book Consultation</span>
                            <span className="d-inline d-sm-none">Book</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        <span className="d-none d-sm-inline">Previous</span>
                        <span className="d-inline d-sm-none">Prev</span>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <span className="d-none d-sm-inline">Next</span>
                        <span className="d-inline d-sm-none">Next</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
      </div>

      {/* Modern Booking Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="modern-consultation-modal">
        <Modal.Header closeButton className="modern-modal-header">
          <Modal.Title className="modern-modal-title">
            <div className="title-icon-wrapper">
              <FontAwesomeIcon icon={faHandshake} className="title-icon" />
            </div>
            <div className="title-content">
              <h4 className="mb-0 fw-bold">Book Consultation</h4>
              <p className="mb-0 text-muted small">Schedule your academic consultation</p>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="modern-modal-body">
          {/* Progress Indicator */}
          <div className="booking-progress mb-4">
            <div className="progress-steps">
              <div className={`progress-step ${selectedFaculty ? 'completed' : 'active'}`}>
                <div className="step-icon">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <span className="step-label">Faculty</span>
              </div>
              <div className={`progress-step ${selectedSubject ? 'completed' : selectedFaculty ? 'active' : ''}`}>
                <div className="step-icon">
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <span className="step-label">Subject</span>
              </div>
              <div className={`progress-step ${selectedSchedule ? 'completed' : selectedSubject ? 'active' : ''}`}>
                <div className="step-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <span className="step-label">Schedule</span>
              </div>
              <div className={`progress-step ${selectedSlot ? 'completed' : selectedSchedule ? 'active' : ''}`}>
                <div className="step-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <span className="step-label">Confirm</span>
              </div>
            </div>
          </div>

          {/* Faculty Information Card */}
          <div className="info-card faculty-card mb-4">
            <div className="card-header-modern">
              <div className="header-icon">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <div className="header-content">
                <h6 className="mb-1 fw-bold">Faculty Information</h6>
                <p className="mb-0 text-muted small">Consultation with {selectedFaculty?.name}</p>
              </div>
            </div>
            <div className="card-body-modern">
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Name</label>
                  <p className="info-value">{selectedFaculty?.name}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Email</label>
                  <p className="info-value">{selectedFaculty?.email}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Department</label>
                  <p className="info-value">{selectedFaculty?.department || 'Not specified'}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Contact</label>
                  <p className="info-value">{selectedFaculty?.contact_number || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="selection-card mb-4">
            <div className="card-header-modern">
              <div className="header-icon">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <div className="header-content">
                <h6 className="mb-1 fw-bold">Select Subject</h6>
                <p className="mb-0 text-muted small">Choose the subject for consultation</p>
              </div>
            </div>
            <div className="card-body-modern">
              <div className="form-group-modern">
                <label htmlFor="subjectSelect" className="form-label-modern">
                  Subject Name and Code
                  {!selectedSubject && <span className="required-indicator">*</span>}
                </label>
                <div className="select-wrapper">
                  <select
                    id="subjectSelect"
                    className={`form-select-modern ${!selectedSubject ? 'is-invalid' : 'is-valid'}`}
                    value={selectedSubject?._id || ''}
                    onChange={(e) => {
                      const subjectId = e.target.value;
                      if (!subjectId) {
                        setSelectedSubject(null);
                        setFacultySchedules([]);
                        setSelectedSchedule(null);
                        return;
                      }
                      const subject = selectedSubjects.find(s => s._id === subjectId);
                      if (subject) {
                        handleSubjectSelect(subject);
                      }
                    }}
                  >
                    <option value="">Choose a subject...</option>
                    {selectedSubjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subjectCode} - {subject.subjectName}
                      </option>
                    ))}
                  </select>
                  <div className="select-icon">
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
                {!selectedSubject && (
                  <div className="validation-message error">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Please select a subject to continue</span>
                  </div>
                )}
                {selectedSubject && (
                  <div className="validation-message success">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Subject selected successfully</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Selection */}
          {selectedSubject && (
            <div className="selection-card mb-4">
              <div className="card-header-modern">
                <div className="header-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="header-content">
                  <h6 className="mb-1 fw-bold">Select Schedule</h6>
                  <p className="mb-0 text-muted small">Choose your preferred consultation time</p>
                </div>
              </div>
              <div className="card-body-modern">
                {facultySchedules.length > 0 ? (
                  <div className="schedule-container">
                    {Object.entries(groupSchedulesByDay(facultySchedules)).map(([day, daySchedules]) => (
                      <div key={day} className="day-schedule-group">
                        <h6 className="day-header">
                          <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                          {day}
                        </h6>
                        <div className="schedule-grid">
                          {daySchedules.map((schedule) => (
                            <button
                              key={schedule._id}
                              className={`schedule-card ${selectedSchedule?._id === schedule._id ? 'selected' : ''} ${schedule.isFullyBooked ? 'disabled' : ''}`}
                              onClick={() => handleScheduleSelect(schedule)}
                              disabled={schedule.isFullyBooked}
                            >
                              <div className="schedule-time">
                                <FontAwesomeIcon icon={faClock} />
                                <span>{schedule.startTime} - {schedule.endTime}</span>
                              </div>
                              <div className="schedule-slots">
                                <span className={`slot-count ${schedule.isFullyBooked ? 'text-danger' : 'text-success'}`}>
                                  {schedule.currentSlots || 0}/{schedule.maxSlots || 'N/A'} slots
                                </span>
                                <span className={`availability ${schedule.isFullyBooked ? 'unavailable' : 'available'}`}>
                                  {schedule.isFullyBooked ? 'Fully Booked' : 'Available'}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FontAwesomeIcon icon={faCalendarTimes} />
                    </div>
                    <h6>No schedules available</h6>
                    <p className="text-muted">There are no consultation schedules available for this subject.</p>
                  </div>
                )}
                {!selectedSchedule && facultySchedules.length > 0 && (
                  <div className="validation-message error">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Please select a schedule to continue</span>
                  </div>
                )}
                {selectedSchedule && (
                  <div className="validation-message success">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Schedule selected: {selectedSchedule.startTime} - {selectedSchedule.endTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Slot Selection */}
          {selectedSchedule && (
            <div className="selection-card mb-4">
              <div className="card-header-modern">
                <div className="header-icon">
                  <FontAwesomeIcon icon={faListOl} />
                </div>
                <div className="header-content">
                  <h6 className="mb-1 fw-bold">Select Slot</h6>
                  <p className="mb-0 text-muted small">Choose your preferred consultation slot</p>
                </div>
              </div>
              <div className="card-body-modern">
                <div className="slot-container">
                  {Array.from({ length: selectedSchedule.maxSlots }, (_, i) => {
                    const slotNumber = i + 1;
                    const isBooked = selectedSchedule.currentSlots >= slotNumber;
                    return (
                      <button
                        key={slotNumber}
                        className={`slot-card ${selectedSlot === slotNumber ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                        onClick={() => !isBooked && setSelectedSlot(slotNumber)}
                        disabled={isBooked}
                      >
                        <div className="slot-number">
                          <span className="number">{slotNumber}</span>
                        </div>
                        <div className="slot-status">
                          <span className={`status ${isBooked ? 'booked' : 'available'}`}>
                            {isBooked ? 'Booked' : 'Available'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!selectedSlot && (
                  <div className="validation-message error">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Please select an available slot</span>
                  </div>
                )}
                {selectedSlot && (
                  <div className="validation-message success">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Slot {selectedSlot} selected</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedSlot && (
            <div className="summary-card">
              <div className="card-header-modern">
                <div className="header-icon">
                  <FontAwesomeIcon icon={faClipboardCheck} />
                </div>
                <div className="header-content">
                  <h6 className="mb-1 fw-bold">Booking Summary</h6>
                  <p className="mb-0 text-muted small">Review your consultation details</p>
                </div>
              </div>
              <div className="card-body-modern">
                <div className="summary-grid">
                  <div className="summary-item">
                    <label>Faculty</label>
                    <span>{selectedFaculty?.name}</span>
                  </div>
                  <div className="summary-item">
                    <label>Subject</label>
                    <span>{selectedSubject?.subjectCode} - {selectedSubject?.subjectName}</span>
                  </div>
                  <div className="summary-item">
                    <label>Schedule</label>
                    <span>{selectedSchedule?.startTime} - {selectedSchedule?.endTime}</span>
                  </div>
                  <div className="summary-item">
                    <label>Slot</label>
                    <span>Slot {selectedSlot}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="modern-modal-footer">
          <div className="footer-content">
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-modern"
              onClick={handleCloseModal}
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-modern ${isBookDisabled ? 'disabled' : ''}`}
              onClick={() => {
                if (!isBookDisabled) {
                  handleBookConsultation();
                } else {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Missing Information',
                    text: `Please complete: ${missingFields.join(', ')}`
                  });
                }
              }}
              disabled={isBookDisabled}
            >
              <FontAwesomeIcon icon={faCheck} className="me-2" />
              Book Consultation
            </button>
          </div>
          {isBookDisabled && missingFields.length > 0 && (
            <div className="footer-validation">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              <span>Please complete: {missingFields.join(', ')}</span>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Clipboard Modal - Changed to User Report Form */}
      <Modal show={showClipboardModal} onHide={handleCloseClipboardModal} centered className="feedback-modal">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold responsive-text-lg">
            <span role="img" aria-label="clipboard" className="me-2">📋</span>
            Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="text-center responsive-mb-3">
            <h5 className="fw-bold responsive-mb-2 responsive-text-lg">How would you rate your experience?</h5>
            <div className="feedback-buttons">
              <button 
                className={`btn feedback-btn ${selectedFeedback === "😊" ? 'btn-light border border-primary' : 'btn-outline-light'}`}
                onClick={() => handleFeedbackSelect("😊")}
                style={{ backgroundColor: selectedFeedback === "😊" ? '#e6f2ff' : 'transparent' }}
              >
                <span role="img" aria-label="very happy">😊</span>
                <div className="mt-2 responsive-text-sm">Very Happy</div>
              </button>
              
              <button 
                className={`btn feedback-btn ${selectedFeedback === "🙂" ? 'btn-light border border-primary' : 'btn-outline-light'}`}
                onClick={() => handleFeedbackSelect("🙂")}
                style={{ backgroundColor: selectedFeedback === "🙂" ? '#e6f2ff' : 'transparent' }}
              >
                <span role="img" aria-label="happy">🙂</span>
                <div className="mt-2 responsive-text-sm">Happy</div>
              </button>
              
              <button 
                className={`btn feedback-btn ${selectedFeedback === "😐" ? 'btn-light border border-primary' : 'btn-outline-light'}`}
                onClick={() => handleFeedbackSelect("😐")}
                style={{ backgroundColor: selectedFeedback === "😐" ? '#e6f2ff' : 'transparent' }}
              >
                <span role="img" aria-label="neutral">😐</span>
                <div className="mt-2 responsive-text-sm">Neutral</div>
              </button>
              
              <button 
                className={`btn feedback-btn ${selectedFeedback === "🙁" ? 'btn-light border border-primary' : 'btn-outline-light'}`}
                onClick={() => handleFeedbackSelect("🙁")}
                style={{ backgroundColor: selectedFeedback === "🙁" ? '#e6f2ff' : 'transparent' }}
              >
                <span role="img" aria-label="slightly unhappy">🙁</span>
                <div className="mt-2 responsive-text-sm">Unhappy</div>
              </button>
              
              <button 
                className={`btn feedback-btn ${selectedFeedback === "😠" ? 'btn-light border border-primary' : 'btn-outline-light'}`}
                onClick={() => handleFeedbackSelect("😠")}
                style={{ backgroundColor: selectedFeedback === "😠" ? '#e6f2ff' : 'transparent' }}
              >
                <span role="img" aria-label="angry">😠</span>
                <div className="mt-2 responsive-text-sm">Angry</div>
              </button>
              
              <button 
                className={`btn feedback-btn ${selectedFeedback === "😡" ? 'btn-light border border-primary' : 'btn-outline-light'}`}
                onClick={() => handleFeedbackSelect("😡")}
                style={{ backgroundColor: selectedFeedback === "😡" ? '#e6f2ff' : 'transparent' }}
              >
                <span role="img" aria-label="super angry">😡</span>
                <div className="mt-2 responsive-text-sm">Very Angry</div>
              </button>
            </div>
          </div>

          {/* Additional details textarea */}
          <div className="form-group">
            <label htmlFor="reportDetails" className="form-label fw-bold">Additional Details</label>
            <textarea 
              id="reportDetails"
              className="form-control" 
              rows="4" 
              placeholder="Please provide any additional details about your experience or issues you encountered..."
              value={reportMessage}
              onChange={handleReportMessageChange}
              style={{ resize: 'none' }}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top-0 modal-footer">
          <div className="responsive-btn-group">
            <Button variant="secondary" onClick={handleCloseClipboardModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitReport}
              disabled={!selectedFeedback || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span className="d-none d-sm-inline">Submitting...</span>
                  <span className="d-inline d-sm-none">Submitting</span>
                </>
              ) : (
                <>
                  <span className="d-none d-sm-inline">Submit Report</span>
                  <span className="d-inline d-sm-none">Submit</span>
                </>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentConsultations;
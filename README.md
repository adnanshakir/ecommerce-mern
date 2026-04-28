# 📦 YANITED – Full Stack E-Commerce Platform

## 🚀 Overview

YANITED is a production-oriented MERN stack e-commerce platform built to simulate real-world workflows including product management, cart systems, payments, and order handling. The project focuses heavily on backend correctness, scalable architecture, and clean UI/UX using modern tools.

---

## 🛠️ What I Built

* Complete **buyer flow**: browse → cart → checkout → payment → orders
* Full **seller dashboard**: create, edit, manage products & variants
* **Dynamic cart system** with backend-driven pricing
* **Razorpay payment integration** with verification
* **Order management system** (history + detail pages)
* **Product filtering & search system**
* Clean, responsive UI using **Tailwind + shadcn**

---

## ⚙️ Tech Stack

* **Frontend**: React, Redux Toolkit, Tailwind CSS, shadcn/ui
* **Backend**: Node.js, Express, MongoDB, Mongoose
* **Payments**: Razorpay
* **Storage**: ImageKit
* **Auth**: JWT (httpOnly cookies)

---

## 🧠 Key Challenges & How I Solved Them

### 1. 🔐 Secure Payment Flow

**Challenge:** Prevent tampering with price and ensure trustable checkout
**Solution:**

* Calculated totals on backend using aggregation
* Implemented Razorpay order + signature verification
* Stored payment state (`pending → paid → failed`) reliably

---

### 2. 🛒 Cart Data Consistency

**Challenge:** Price mismatch when product price changes
**Solution:**

* Stored snapshot price in cart
* Compared with live product price
* Dynamically calculated discounts on frontend

---

### 3. 🧩 Complex Product Structure (Variants)

**Challenge:** Managing nested product + variants + images
**Solution:**

* Designed schema for base product + variants
* Built unified edit page for both
* Implemented partial updates (no overwrite bugs)

---

### 4. 🖼️ Image Management (Real-world problem)

**Challenge:** Deleting images from DB but not from storage
**Solution:**

* Stored `fileId` for each image
* Synced DB deletion with ImageKit cleanup
* Handled both product & variant image lifecycle

---

### 5. ⚡ State & UI Synchronization

**Challenge:** Multiple sources of truth (Redux, API, UI)
**Solution:**

* Centralized cart + auth state
* Built reusable hooks (`useCart`, `useAuth`, `useProduct`)
* Avoided unnecessary re-renders and API spam

---

### 6. 🔄 Order Flow Design (Industry-like)

**Challenge:** Separating success page vs order history
**Solution:**

* `/order-success` → immediate feedback
* `/orders` → history
* `/orders/:id` → detailed breakdown

---

## 🧱 Architecture Decisions

* Backend-first logic for **security-critical operations** (pricing, payments)
* Modular structure (controllers, services, hooks)
* Reusable UI components with **design consistency via CSS variables**
* Separation of concerns between buyer & seller flows

---

## ✨ Highlights

* Real-world payment workflow (not mock)
* Clean and scalable folder structure
* Proper error handling + validation
* Focus on **production-level thinking**, not just features

---

## 📌 What This Project Demonstrates

* Strong understanding of **full-stack architecture**
* Ability to handle **complex state & async flows**
* Experience with **real integrations (payments, storage)**
* Writing **maintainable, scalable, and realistic code**

# KeyExchange Lab: Interactive Diffie-Hellman & MITM Simulator

[![Cryptography & Network Security](https://img.shields.io/badge/Course-Module%202%3A%20DH%20%26%20MITM-38bdf8?style=for-the-badge)](https://github.com)
[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Standard%20Lib-059669?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React Vite Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-2563eb?style=for-the-badge&logo=react)](https://react.dev)
[![Offline Fallback](https://img.shields.io/badge/Engine-In--Browser%20BigInt-f59e0b?style=for-the-badge)](https://developer.mozilla.org)
[![Tests Passing](https://img.shields.io/badge/Tests-16%2F16%20Passed-emerald?style=for-the-badge&logo=pytest)](https://docs.pytest.org)

**KeyExchange Lab** is a full-stack, enterprise-grade educational cybersecurity laboratory and interactive visualizer demonstrating the **Diffie-Hellman Key Exchange (DHKE)** protocol and the classic **Man-in-the-Middle (MITM)** attack. Designed specifically for university presentations and oral examinations in **Cryptography & Network Security (Module 2)**.

---

## Table of Contents
- [1. Project Overview & Features](#1-project-overview--features)
- [2. System Architecture & Tech Stack](#2-system-architecture--tech-stack)
- [3. Mathematical Foundations](#3-mathematical-foundations)
- [4. The Man-in-the-Middle (MITM) Exploit](#4-the-man-in-the-middle-mitm-exploit)
- [5. Environment Variables & Configuration](#5-environment-variables--configuration)
- [6. Local Development Setup](#6-local-development-setup)
- [7. API Schemas & Endpoints Reference](#7-api-schemas--endpoints-reference)
- [8. Testing & Quality Assurance](#8-testing--quality-assurance)
- [9. Production Deployment Guide](#9-production-deployment-guide)
- [10. Viva Voce Examination Guide](#10-viva-voce-examination-guide)
- [11. Repository Cleanliness & Contribution](#11-repository-cleanliness--contribution)

---

## 1. Project Overview & Features

### Core Capabilities
- **Real-Time 3-Column Protocol Simulator**: Visualizes Alice (Initiator), Bob (Responder), and the Insecure Public Channel with step-by-step mathematical substitution and live transmission wire.
- **Active MITM Attack Toggle**: Flip the MITM switch to watch Eve slide into the center of the channel, intercept public values mid-flight, establish dual poisoned sessions ($K_{EA}$ and $K_{EB}$), and tamper with transmitted messages in real time.
- **Dual Cryptographic Engine with Zero-Crash Fallback**:
  - **Server API**: Python FastAPI backend using pure standard library (`pow(base, exp, mod)`, `secrets`, `hashlib`).
  - **In-Browser Fallback**: Client-side TypeScript module utilizing native `BigInt` and the Web Crypto API. Automatically takes over if the backend is sleeping or unreachable.
- **Buttery-Smooth Navigation & Lenis Easing**: Redesigned modern navigation bar with subtle orange glowing accents, glassmorphic backdrop blur (`backdrop-blur-2xl`), responsive layout, and Lenis inertial smooth scrolling.
- **Interactive Paint-Mixing Analogy**: Step-by-step visual analogy explaining why modular exponentiation behaves like a physical one-way pigment mixture that cannot be separated.
- **Live Discrete Logarithm Brute-Force Cracker**: Real-time brute-force solver on small toy primes with execution timer and step counter, paired with an exponential complexity comparison chart ($5$, $64$, $128$, $256$, and $2048$-bit primes).
- **Authenticated DH Countermeasure**: Demonstrates digital signatures and X.509 certificate validation, showing how cryptographic identity verification rejects Eve's rogue public keys.
- **Examiner-Ready Viva Preparation Module**: 8 curated, high-scoring oral exam questions with complete technical explanations.

---

## 2. System Architecture & Tech Stack

```
                     ┌────────────────────────────────────────┐
                     │            Client Browser              │
                     │  React 18 + Vite + TypeScript + Tailwind│
                     │     Framer Motion + Lenis Smooth Scroll│
                     └───────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │  In-Browser BigInt Engine │                   │      FastAPI Backend      │
   │  - powMod (BigInt)        │                   │  - Python 3.11+ / Uvicorn │
   │  - Miller-Rabin test      │                   │  - pow(base, exp, mod)    │
   │  - Web Crypto SHA-256     │                   │  - secrets (CSPRNG)       │
   │  - XOR Stream Cipher      │                   │  - hashlib (SHA-256)      │
   │  (Zero-latency fallback)  │                   │  - CORS & Pydantic models │
   └───────────────────────────┘                   └───────────────────────────┘
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lenis Smooth Scroll, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Uvicorn, Pytest, HTTPX.
- **Crypto Math**: 100% Python Standard Library and Web Crypto API. Zero opaque external crypto dependencies.

---

## 3. Mathematical Foundations

Diffie-Hellman establishes a shared symmetric key over an insecure medium without transmitting the key itself.

### Protocol Steps:
1. **Public Domain Parameters**: Both parties agree on large prime modulus $p$ and generator $g$ where $2 \le g < p$.
2. **Private Exponents**:
   - Alice secretly generates $a \in [2, p - 2]$.
   - Bob secretly generates $b \in [2, p - 2]$.
3. **Public Values Computation**:
   - Alice computes: $A = g^a \pmod p$
   - Bob computes: $B = g^b \pmod p$
4. **Exchange**: Alice sends $A$ to Bob; Bob sends $B$ to Alice. Passive observer Eve sees $(p, g, A, B)$.
5. **Shared Secret Derivation**:
   - Alice computes: $K_A = B^a \pmod p = (g^b)^a \pmod p = g^{ba} \pmod p$
   - Bob computes: $K_B = A^b \pmod p = (g^a)^b \pmod p = g^{ab} \pmod p$
   - Since $g^{ab} \equiv g^{ba} \pmod p$, both derive identical key:
     $$K = g^{ab} \pmod p$$
6. **Symmetric Key**:
   $$\text{SessionKey} = \text{SHA-256}(K)$$

---

## 4. The Man-in-the-Middle (MITM) Exploit

Basic Diffie-Hellman does not authenticate identity. An active attacker Eve exploits this by intercepting and replacing public values:

1. Eve intercepts $A$ and $B$ in flight.
2. Eve generates private keys $e_A$ and $e_B$, and public keys $E_A = g^{e_A} \pmod p$ and $E_B = g^{e_B} \pmod p$.
3. Eve sends $E_A$ to Alice (impersonating Bob) and $E_B$ to Bob (impersonating Alice).
4. Alice computes $K_A = (E_A)^a \pmod p = K_{EA}$.
5. Bob computes $K_B = (E_B)^b \pmod p = K_{EB}$.
6. Eve derives both $K_{EA}$ and $K_{EB}$. When Alice sends a message, Eve decrypts with $K_{EA}$, tampers with the text, re-encrypts with $K_{EB}$, and forwards it to Bob undetected.

**Defense**: Digital certificates (X.509) and signatures (RSA/ECDSA). Alice and Bob sign their ephemeral public keys. Eve cannot forge the signature without Alice's private key, causing handshake abortion upon tampering.

---

## 5. Environment Variables & Configuration

### Root & Backend (`.env`)
Create a `.env` file in the root or `backend/` directory:
```bash
# Server Host and Port
PORT=8000
HOST=0.0.0.0

# CORS Allowed Origins (Comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,https://<your-username>.github.io
```

### Frontend (`frontend/.env`)
Create a `.env` file in `frontend/`:
```bash
# Point to your local or deployed FastAPI service
# Local development:
VITE_API_URL=http://localhost:8000

# Production (e.g. Render):
# VITE_API_URL=https://keyexchange-lab-api.onrender.com
```

Template files are provided in [`.env.example`](file:///d:/Crypto/.env.example) and [`frontend/.env.example`](file:///d:/Crypto/frontend/.env.example).

---

## 6. Local Development Setup

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run test suite (16 tests)
pytest

# Launch FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- API Health: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Step 2: Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Open browser at: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 7. API Schemas & Endpoints Reference

All endpoints return JSON responses with standard HTTP status codes.

### 1. Health Check
- **`GET /api/health`**
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "engine": "FastAPI DH Engine (Python Standard Library)"
}
```

### 2. Standard Safe Parameters
- **`GET /api/params?bits={toy|64|128|256}`**
- **Response `200 OK`**:
```json
{
  "selected": {
    "bits": "toy",
    "p": "23",
    "g": "5",
    "description": "Small toy prime (p = 23, g = 5, q = 11)..."
  },
  "available_bits": ["toy", "64", "128", "256"]
}
```

### 3. Generate Keypair
- **`POST /api/keypair`**
- **Request Body**:
```json
{
  "p": "23",
  "g": "5",
  "private": "6"
}
```
*(If `"private"` is omitted or empty, a cryptographically secure random exponent is generated).*
- **Response `200 OK`**:
```json
{
  "p": "23",
  "g": "5",
  "private": "6",
  "public": "8"
}
```

### 4. Calculate Shared Secret
- **`POST /api/shared-secret`**
- **Request Body**:
```json
{
  "p": "23",
  "their_public": "19",
  "my_private": "6"
}
```
- **Response `200 OK`**:
```json
{
  "shared_secret": "2",
  "derived_key_hex": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"
}
```

### 5. Simulate Full Protocol & MITM
- **`POST /api/simulate`**
- **Request Body**:
```json
{
  "p": "23",
  "g": "5",
  "mitm": true,
  "message": "Secret message",
  "alice_private": "6",
  "bob_private": "15",
  "eve_alice_private": "8",
  "eve_bob_private": "11",
  "tampered_message": "Tampered payload",
  "authenticated_dh": false
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "mitm": true,
  "authenticated_dh": false,
  "alice": { "private": "6", "public": "8", "computed_key": "4" },
  "bob": { "private": "15", "public": "19", "computed_key": "22" },
  "eve": {
    "private_alice": "8", "public_alice": "16",
    "private_bob": "11", "public_bob": "22",
    "computed_key_alice": "4", "computed_key_bob": "22"
  },
  "keys_match": false,
  "tampered": true,
  "steps": [ ... ]
}
```

### 6. Discrete Logarithm Brute-Force Cracker
- **`POST /api/discrete-log`**
- **Request Body**:
```json
{
  "p": 23,
  "g": 5,
  "public_val": 8,
  "max_steps": 200000
}
```
- **Response `200 OK`**:
```json
{
  "found": true,
  "private_key": 6,
  "steps": 7,
  "time_ms": 0.05,
  "exhausted": false
}
```

---

## 8. Testing & Quality Assurance

### Backend Automated Test Suite
The backend contains 16 automated test cases covering core crypto algorithms, edge cases, invalid inputs, safe prime validation, and all API endpoints:
```bash
cd backend
pytest -v
```
All 16 tests pass:
- `test_params_endpoint`
- `test_keypair_generation_random`
- `test_keypair_with_specified_private`
- `test_shared_secret_matching`
- `test_simulate_honest_dh`
- `test_simulate_mitm_attack`
- `test_simulate_authenticated_mitm_defense`
- `test_discrete_log_brute_force`
- `test_modular_exponentiation`
- `test_safe_prime_properties`
- ...

### Frontend Typecheck & Build Validation
```bash
cd frontend
npm run build
```
Validates zero TypeScript errors and outputs minified static production assets to `frontend/dist/`.

---

## 9. Production Deployment Guide

### Option A: Render (Backend)
1. Push your repository to GitHub.
2. Link your repository in [Render Dashboard](https://dashboard.render.com).
3. The repo includes [`render.yaml`](file:///d:/Crypto/render.yaml) blueprint:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
4. Set `ALLOWED_ORIGINS` to include your frontend production URL.

### Option B: GitHub Pages (Frontend)
1. In your GitHub repository, enable **GitHub Pages** (Settings &rarr; Pages &rarr; Source: GitHub Actions).
2. The included workflow [`.github/workflows/deploy.yml`](file:///d:/Crypto/.github/workflows/deploy.yml) automatically triggers on push to `main`/`master`.
3. Set the repository secret `VITE_API_URL` to your Render backend URL (e.g. `https://keyexchange-lab-api.onrender.com`).
4. **Offline Resilience**: Even if the free-tier backend is sleeping, the in-browser BigInt engine takes over seamlessly with zero user interruption.

---

## 10. Viva Voce Examination Guide

### Q1: Why is Diffie-Hellman secure against passive eavesdroppers?
**Answer**: A passive eavesdropper only observes $(p, g, A, B)$. Computing $K = g^{ab} \bmod p$ from only $A$ and $B$ requires solving the Computational Diffie-Hellman (CDH) problem, computationally equivalent to the Discrete Logarithm Problem (DLP). For prime lengths $\ge 2048$ bits, DLP requires astronomical compute with no classical polynomial-time solution.

### Q2: What is a Safe Prime ($p = 2q + 1$) and why is it critical?
**Answer**: A prime $p$ where $q = (p - 1) / 2$ is also prime. In non-safe primes, $p - 1$ may have multiple small prime factors, enabling attackers to use the **Pohlig-Hellman algorithm** to solve the discrete log in small subgroups and reconstruct the key via the Chinese Remainder Theorem. Safe primes eliminate small subgroups.

### Q3: How does Authenticated DH stop MITM attacks?
**Answer**: Basic DH provides confidentiality but no authentication. In Authenticated DH (such as TLS 1.3 ECDHE), Alice signs ephemeral key $A$ using her private key validated by an X.509 Certificate Authority. Bob verifies the signature using Alice's certificate. An active attacker Eve cannot forge this signature without Alice's private key.

*(See the in-app Viva Questions tab for all 8 comprehensive questions).*

---

## 11. Repository Cleanliness & Contribution

- Build artifacts (`node_modules/`, `dist/`, `.vite/`), Python bytecode (`__pycache__/`, `*.pyc`), and test caches (`.pytest_cache/`, `.coverage`) are strictly excluded via `.gitignore` and must **never** be committed to git.
- Keep dependencies updated via `package.json` and `requirements.txt`.
- Run `pytest` and `npm run build` prior to opening pull requests.

---

## License
Crafted for educational excellence in **Cryptography & Network Security (Module 2)**.
Licensed under the MIT License.

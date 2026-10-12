# KeyExchange Lab: Interactive Diffie-Hellman & MITM Simulator

[![Cryptography & Network Security](https://img.shields.io/badge/Course-Module%202%3A%20DH%20%26%20MITM-38bdf8?style=for-the-badge)](https://github.com)
[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Standard%20Lib-059669?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React Vite Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-2563eb?style=for-the-badge&logo=react)](https://react.dev)
[![Offline Fallback](https://img.shields.io/badge/Engine-In--Browser%20BigInt-f59e0b?style=for-the-badge)](https://developer.mozilla.org)

**KeyExchange Lab** is a full-stack, educational cybersecurity laboratory and interactive visualizer demonstrating the **Diffie-Hellman Key Exchange (DHKE)** protocol and the classic **Man-in-the-Middle (MITM)** attack. Designed specifically for university presentations and oral examinations in **Cryptography & Network Security (Module 2)**.

---

## Table of Contents
- [1. Project Overview & Features](#1-project-overview--features)
- [2. System Architecture & Tech Stack](#2-system-architecture--tech-stack)
- [3. How Diffie-Hellman Works (Mathematical Foundations)](#3-how-diffie-hellman-works-mathematical-foundations)
- [4. The Man-in-the-Middle (MITM) Attack Explained](#4-the-man-in-the-middle-mitm-attack-explained)
- [5. Local Setup & Execution Guide](#5-local-setup--execution-guide)
- [6. Deployment Instructions (GitHub Pages & Render)](#6-deployment-instructions-github-pages--render)
- [7. 3-Minute Live Presentation Script (For Examiners)](#7-3-minute-live-presentation-script-for-examiners)
- [8. 8 Essential Viva Voce Questions & Answers](#8-8-essential-viva-voce-questions--answers)
- [9. Project Limitations & Educational Scope](#9-project-limitations--educational-scope)

---

## 1. Project Overview & Features

### Core Capabilities
- **Real-Time 3-Column Protocol Simulator**: Visualizes Alice (Initiator), Bob (Responder), and the Insecure Public Channel with glowing packet paths and step-by-step mathematical substitution.
- **Active MITM Attack Toggle**: Flip the MITM switch to watch Eve slide into the center of the channel, intercept public values mid-flight, establish dual poisoned sessions ($K_{EA}$ and $K_{EB}$), and tamper with transmitted messages in real time.
- **Dual Cryptographic Engine with Zero-Crash Fallback**:
  - **Server API**: Python FastAPI backend using pure standard library (`pow(base, exp, mod)`, `secrets`, `hashlib`).
  - **In-Browser Fallback**: Client-side TypeScript module utilizing native `BigInt` and the Web Crypto API. Automatically takes over if the backend is unreachable or sleeping.
- **Synchronized Live Math Log**: Every step is cataloged in plain English and LaTeX mathematical formulas; click any step to instantly jump the animation timeline to that step.
- **Interactive Paint-Mixing Analogy**: Step-by-step visual analogy explaining why modular exponentiation behaves like a physical one-way pigment mixture that cannot be separated.
- **Live Discrete Logarithm Brute-Force Cracker**: Real-time brute-force solver on small toy primes with execution timer and step counter, paired with an exponential complexity comparison chart ($5$, $64$, $128$, $256$, and $2048$-bit primes).
- **Authenticated DH Countermeasure**: Demonstrates digital signatures and X.509 certificate validation (linking to Module 3/TLS 1.3), showing how signature verification rejects Eve's rogue public keys.
- **Examiner-Ready Viva Preparation Module**: 8 curated, high-scoring oral exam questions with complete technical explanations.

---

## 2. System Architecture & Tech Stack

```
                     ┌────────────────────────────────────────┐
                     │            Client Browser              │
                     │  React 18 + Vite + TypeScript + Tailwind│
                     │     Framer Motion + Canvas Confetti    │
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

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, Canvas Confetti.
- **Backend**: Python FastAPI, Pydantic, Uvicorn, Pytest, HTTPX.
- **Crypto Math**: 100% Python Standard Library and Web Crypto API. No black-box external crypto packages.

---

## 3. How Diffie-Hellman Works (Mathematical Foundations)

Diffie-Hellman allows two parties to agree on a symmetric secret over an untrusted network without transmitting the secret itself.

### The Mathematical Protocol
1. **Public Domain Parameters**:
   - Both parties agree on a large prime modulus $p$ and a generator (primitive root) $g$ where $2 \le g < p$.
2. **Private Exponents**:
   - Alice secretly generates private key $a \in [2, p - 2]$.
   - Bob secretly generates private key $b \in [2, p - 2]$.
3. **Public Values Computation**:
   - Alice computes: $A = g^a \pmod p$
   - Bob computes: $B = g^b \pmod p$
4. **Public Values Exchange**:
   - Alice sends $A$ to Bob over the insecure channel.
   - Bob sends $B$ to Alice over the insecure channel.
   - A passive eavesdropper Eve observes: $(p, g, A, B)$.
5. **Shared Secret Computation**:
   - Alice computes: $K_A = B^a \pmod p = (g^b)^a \pmod p = g^{ba} \pmod p$
   - Bob computes: $K_B = A^b \pmod p = (g^a)^b \pmod p = g^{ab} \pmod p$
   - Since $g^{ab} \equiv g^{ba} \pmod p$, both parties compute the exact same key:
     $$K = K_A = K_B = g^{ab} \pmod p$$
6. **Key Derivation & Symmetric Encryption**:
   - Both parties derive a 256-bit symmetric session key:
     $$\text{Key} = \text{SHA-256}(K)$$
   - Messages are encrypted via symmetric stream cipher:
     $$\text{Ciphertext} = \text{Plaintext} \oplus \text{KeyStream}$$

---

## 4. The Man-in-the-Middle (MITM) Attack Explained

Unauthenticated Diffie-Hellman provides **confidentiality against passive eavesdroppers**, but provides **zero authentication of identity**.

### The MITM Exploit Flow
1. **Packet Interception**:
   - Alice sends $A = g^a \pmod p$ intended for Bob.
   - Bob sends $B = g^b \pmod p$ intended for Alice.
   - Eve intercepts both packets mid-flight. Neither arrives at its destination.
2. **Dual Rogue Key Generation**:
   - Eve generates private keys $e_A$ (for Alice) and $e_B$ (for Bob).
   - Eve computes public keys $E_A = g^{e_A} \pmod p$ and $E_B = g^{e_B} \pmod p$.
3. **Key Substitution**:
   - Eve sends $E_A$ to Alice (pretending to be Bob).
   - Eve sends $E_B$ to Bob (pretending to be Alice).
4. **Poisoned Shared Secrets**:
   - Alice computes: $K_A = (E_A)^a \pmod p = g^{a \cdot e_A} \pmod p$
   - Bob computes: $K_B = (E_B)^b \pmod p = g^{b \cdot e_B} \pmod p$
   - Eve computes both:
     - $K_{EA} = A^{e_A} \pmod p = g^{a \cdot e_A} \pmod p = K_A$ (Eve shares with Alice)
     - $K_{EB} = B^{e_B} \pmod p = g^{b \cdot e_B} \pmod p = K_B$ (Eve shares with Bob)
5. **Eavesdropping and Message Tampering**:
   - Alice encrypts: $C_A = \text{Message} \oplus \text{SHA256}(K_A)$.
   - Eve intercepts $C_A$, decrypts with $K_{EA}$, and reads Alice's plaintext.
   - Eve modifies the plaintext to a fraudulent message.
   - Eve re-encrypts the tampered text with $K_{EB}$ and forwards it to Bob.
   - Bob decrypts with $K_B$ and receives the forged message with zero cryptographic warnings.

### How to Prevent MITM:
- **Digital Signatures & Certificates (Authenticated DH)**:
  Alice and Bob bind their public values $A$ and $B$ to digital certificates signed by a trusted Certificate Authority (CA) using RSA or ECDSA.
  If Eve injects $E_A$ or $E_B$, signature verification fails and the connection is aborted immediately.

---

## 5. Local Setup & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Step 1: Run the Backend
```bash
# Navigate to the backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run automated tests (all 16 tests should pass)
pytest tests -v

# Start FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Step 2: Run the Frontend
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## 6. Deployment Instructions (GitHub Pages & Render)

### Backend Deployment (Render)
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and create a **New Web Service** connected to your repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `ALLOWED_ORIGINS`: `https://<your-username>.github.io,http://localhost:5173`
5. Alternatively, deploy directly using the included `render.yaml` blueprint file.

### Frontend Deployment (GitHub Pages)
1. In your GitHub repository, go to **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. (Optional) Set the repository secret `VITE_API_URL` to your Render backend URL (e.g., `https://keyexchange-lab-api.onrender.com`).
4. Push to `main` branch: the `.github/workflows/deploy.yml` workflow will automatically build and publish the frontend to GitHub Pages.
5. If the backend is ever sleeping or paused on Render's free tier, the frontend's In-Browser BigInt engine seamlessly runs locally with zero downtime!

---

## 7. 3-Minute Live Presentation Script (For Examiners)

> **Timer: 0:00 - 0:45 | Introduction & Honest Diffie-Hellman**
> *"Good morning, esteemed examiners. This is KeyExchange Lab, an interactive laboratory for Module 2: Key Management and Diffie-Hellman Key Exchange.*
> *In 1976, Whitfield Diffie and Martin Hellman solved a fundamental dilemma: how do two parties establish a shared cryptographic key across an insecure public channel where every packet can be overheard?*
> *Notice on screen: Alice chooses private key $a=6$, Bob chooses $b=15$. Over the public wire, they exchange only public numbers $A = 5^6 \bmod 23 = 8$ and $B = 5^{15} \bmod 23 = 19$.*
> *By the commutative property of modular exponents, Alice computes $B^a \bmod p$ and Bob computes $A^b \bmod p$. Both arrive at the exact same shared key $K = 2$. Alice encrypts her message, Bob decrypts it, and end-to-end security is confirmed."*

> **Timer: 0:45 - 1:45 | Man-in-the-Middle Attack Demonstration**
> *"Now let us turn to the primary vulnerability: basic Diffie-Hellman does not authenticate identity. I will now flip the MITM switch.*
> *Observe Eve sliding into the public channel. Eve intercepts Alice's packet $A$ and Bob's packet $B$. She generates two rogue private keys: $e_A=8$ and $e_B=11$.*
> *Eve forwards her own forged public keys: $E_A=16$ to Alice and $E_B=22$ to Bob.*
> *Notice the critical result in our Live Math Log: Alice computes key $K_A = 4$, while Bob computes key $K_B = 22$. Their keys DO NOT MATCH!*
> *Eve holds the decryption keys to both sides. When Alice sends 'Secret rendezvous at noon', Eve intercepts the ciphertext, decrypts it, tampers with the message to read 'Wire $1,000,000 to Eve', re-encrypts with Bob's key, and Bob accepts the altered payload completely unaware."*

> **Timer: 1:45 - 2:30 | Complexity & Defense Countermeasure**
> *"Why can't an observer crack the keys? Below the simulator, we provide a live Discrete Logarithm Cracker. For our toy prime $p=23$, brute force succeeds in under $1$ millisecond. But as shown in our complexity chart, for a 256-bit prime, solving the discrete log requires $2^{128}$ operations—longer than the age of the universe.*
> *Finally, how does the real world stop Eve? I toggle Authenticated DH. Digital signatures bind the public keys to verified X.509 certificates. Eve cannot forge Alice's private signing key, and the handshake immediately aborts.*
> *Thank you. I am ready for your viva questions."*

---

## 8. 8 Essential Viva Voce Questions & Answers

### Q1: Why is Diffie-Hellman secure against passive eavesdroppers?
**Answer**: A passive eavesdropper only observes the public domain parameters $(p, g)$ and public values $A = g^a \bmod p$ and $B = g^b \bmod p$. Computing the shared secret $K = g^{ab} \bmod p$ from only $A$ and $B$ is the **Computational Diffie-Hellman (CDH) problem**, which is believed to be computationally equivalent to the **Discrete Logarithm Problem (DLP)**. For sufficiently large primes (e.g. 2048-bit MODP or 256-bit Elliptic Curves), no known classical polynomial-time algorithm can solve DLP.

### Q2: What is the Discrete Logarithm Problem (DLP) and why is it a one-way function?
**Answer**: Given $g$, $p$, and $y$, finding an integer $x$ such that $g^x \equiv y \pmod p$ is the Discrete Logarithm Problem. Computing $y$ from $x$ is trivial using the square-and-multiply algorithm in $O(\log x)$ modular multiplications. Reversing it to find $x$ from $y$ requires exponential or sub-exponential search (e.g., Pollard's rho algorithm $O(\sqrt{p})$ or General Number Field Sieve), making it a trapdoor/one-way function.

### Q3: How does the Man-in-the-Middle (MITM) attack work against Diffie-Hellman?
**Answer**: An active attacker Eve intercepts public keys $A$ and $B$ in transit. Eve generates two independent rogue key pairs $(e_A, E_A)$ and $(e_B, E_B)$. She sends $E_A$ to Alice (impersonating Bob) and $E_B$ to Bob (impersonating Alice). Alice establishes key $K_{EA} = (E_A)^a \bmod p$, Bob establishes $K_{EB} = (E_B)^b \bmod p$, and Eve computes both keys. Eve acts as a transparent proxy, decrypting, modifying, and re-encrypting all traffic undetected.

### Q4: Why can't Alice or Bob detect the MITM attack in unauthenticated DH?
**Answer**: Diffie-Hellman is strictly a **key agreement** protocol, not an **authentication** protocol. A public key $A = g^a \bmod p$ has no mathematical binding to an identity. Bob receives an integer but has no mathematical evidence whether that integer came from Alice or from Eve.

### Q5: How do digital certificates and PKI prevent MITM in TLS?
**Answer**: In Authenticated Diffie-Hellman (such as TLS 1.3 ECDHE handshakes), each party holds a long-term asymmetric key pair validated by a Certificate Authority (CA) through an X.509 certificate. When sending public value $A$, Alice digitally signs $A$ using her private key. Bob verifies the signature using Alice's trusted certificate. Eve cannot forge this signature without Alice's private key, causing the handshake to abort immediately if Eve tampers with the public key.

### Q6: What is a "Safe Prime" ($p = 2q + 1$) and why is it required?
**Answer**: A safe prime is a prime $p$ where $q = (p - 1) / 2$ is also prime (Sophie Germain prime). The order of the multiplicative group $\mathbb{Z}_p^*$ is $p - 1 = 2q$. Its only divisors are $1, 2, q$, and $2q$. If $p - 1$ contains small prime factors, an attacker can exploit the **Pohlig-Hellman algorithm** to solve the discrete log in each small subgroup and combine results via the Chinese Remainder Theorem. Safe primes guarantee no small subgroups exist, forcing attacks to search the entire prime group.

### Q7: What is the fundamental difference between Diffie-Hellman and RSA?
**Answer**: Diffie-Hellman is solely a **key agreement protocol**: neither party dictates the secret; both contribute random values to jointly compute a session key. Basic DH cannot directly encrypt messages or produce digital signatures. RSA is a general-purpose public-key cryptosystem based on integer factorization that supports both encryption/decryption and digital signatures.

### Q8: What is Perfect Forward Secrecy (PFS) and why does Ephemeral DH (ECDHE) provide it?
**Answer**: Perfect Forward Secrecy ensures that compromise of a long-term private key in the future does NOT compromise past recorded session communications. In Ephemeral Diffie-Hellman (DHE / ECDHE), temporary, unique DH keys are generated for each session and destroyed immediately after the symmetric session key is derived. Even if an attacker steals the server's long-term certificate private key years later, the past session exponents $a$ and $b$ no longer exist anywhere in memory or on disk.

---

## 9. Project Limitations & Educational Scope

- **Toy vs. Production Moduli**: While the simulator supports 64, 128, and 256-bit safe primes, real-world protocols require minimum 2048-bit MODP groups (RFC 3526) or 256-bit Elliptic Curves (X25519) to resist state-level adversaries.
- **Symmetric Stream Cipher**: The message encryption demonstrated in this lab uses an educational SHA-256 counter XOR stream cipher for transparent algorithmic inspection. Production systems use authenticated encryption like AES-GCM or ChaCha20-Poly1305 to ensure message integrity and authenticity simultaneously.

---

## License & Credits
Crafted as an academic project for **Cryptography & Network Security (Module 2)**.
Licensed under the MIT License.

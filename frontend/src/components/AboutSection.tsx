import React, { useState } from "react";
import {
  GraduationCap,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
} from "lucide-react";
import { ScrollReveal } from "./common/ScrollReveal";

export const AboutSection: React.FC = () => {
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);

  const toggleViva = (index: number) => {
    setOpenVivaIndex((prev) => (prev === index ? null : index));
  };

  const vivaQuestions = [
    {
      q: "1. Why is the Diffie-Hellman Key Exchange secure against passive eavesdroppers?",
      a: "Diffie-Hellman is secure because a passive observer only sees the public parameters (p, g) and the public values (A = g^a mod p, B = g^b mod p). To compute the shared secret K = g^(ab) mod p from only A and B, the attacker must solve the Computational Diffie-Hellman (CDH) problem, which is believed to be computationally equivalent to the Discrete Logarithm Problem (DLP). In groups of sufficient size (e.g. 2048-bit primes or 256-bit elliptic curves), solving DLP requires astronomical time with no known classical polynomial-time algorithm.",
    },
    {
      q: "2. What is the Discrete Logarithm Problem (DLP) and why is it a one-way function?",
      a: "Given base g, modulus p, and result y, finding an integer x such that g^x ≡ y (mod p) is the Discrete Logarithm Problem. It functions as a trapdoor/one-way function because modular exponentiation (computing y from x) is extremely fast using the square-and-multiply algorithm (O(log x) modular multiplications), whereas reversing it (finding x from y) requires exponential or sub-exponential algorithms like Pollard's rho or the General Number Field Sieve (GNFS).",
    },
    {
      q: "3. How does the Man-in-the-Middle (MITM) attack work against basic Diffie-Hellman?",
      a: "An active attacker Eve intercepts Alice's public value A and Bob's public value B mid-flight. Eve generates two independent rogue key pairs: (e_A, E_A) and (e_B, E_B). She sends E_A to Alice (impersonating Bob) and E_B to Bob (impersonating Alice). Alice establishes shared key K_EA = (E_A)^a mod p, while Bob establishes K_EB = (E_B)^b mod p. Eve calculates both K_EA and K_EB. When Alice sends an encrypted message, Eve intercepts it, decrypts with K_EA, reads/alters the plaintext, re-encrypts with K_EB, and forwards it to Bob undetected.",
    },
    {
      q: "4. Why can't Alice or Bob detect the MITM attack in unauthenticated Diffie-Hellman?",
      a: "Basic Diffie-Hellman is strictly a key-agreement protocol, NOT an authentication protocol. A public key (like A = g^a mod p) carries no inherent cryptographic binding to the identity 'Alice'. When Bob receives a number, he has no mathematical way of verifying whether that number originated from Alice or from an impostor like Eve.",
    },
    {
      q: "5. How do digital certificates and Public Key Infrastructure (PKI) prevent MITM?",
      a: "In Authenticated DH (and modern TLS 1.3), each party binds their identity to a long-term public/private key pair signed by a trusted Certificate Authority (CA) via an X.509 certificate. When Alice sends her ephemeral DH key A, she digitally signs A using her private signature key. Bob verifies Alice's signature against her trusted CA certificate. An attacker Eve cannot forge this signature without Alice's private key, causing the handshake to abort immediately if Eve substitutes a forged key.",
    },
    {
      q: "6. What is a 'Safe Prime' (p = 2q + 1) and why is it critical for Diffie-Hellman?",
      a: "A safe prime is a prime p such that (p - 1) / 2 = q is also prime (Sophie Germain prime). The order of the multiplicative group Z_p* is p - 1 = 2q. Its only divisors are 1, 2, q, and 2q. If p is not safe, p - 1 could factor into many small primes, enabling an attacker to use the Pohlig-Hellman algorithm to solve the discrete log in each small subgroup and combine results via Chinese Remainder Theorem. Safe primes completely eliminate small subgroup attacks.",
    },
    {
      q: "7. What is the fundamental difference between Diffie-Hellman and RSA?",
      a: "Diffie-Hellman is specifically a key-exchange (agreement) algorithm: neither party chooses the secret in advance; both contribute random values to jointly compute a shared key. Basic DH cannot directly encrypt arbitrary files or produce digital signatures. In contrast, RSA is a general-purpose public-key cryptosystem based on integer factorization that natively supports both asymmetric encryption/decryption and digital signatures.",
    },
    {
      q: "8. What is Perfect Forward Secrecy (PFS) and how does Ephemeral Diffie-Hellman achieve it?",
      a: "Perfect Forward Secrecy ensures that if an attacker compromises a server's long-term private key in the future, past recorded encrypted communications cannot be decrypted. In Ephemeral Diffie-Hellman (DHE / ECDHE), unique, temporary DH keys are generated for each session and destroyed immediately after the session key is derived. Even if the server's long-term certificate private key is leaked later, the past ephemeral exponents a and b no longer exist anywhere, keeping past traffic secure.",
    },
  ];

  return (
    <section id="syllabus" className="py-12 md:py-16 scroll-mt-24 border-t border-neutral-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <ScrollReveal direction="up" delay={0.05} distance={20}>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Academic Context & Examination Prep
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Syllabus Mapping & Viva Voce Guide
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mt-2">
              Curated for Cryptography & Network Security Module 2. High-scoring answers ready for oral examinations, project reviews, and lab assessments.
            </p>
          </div>
        </ScrollReveal>

        {/* Syllabus Module 2 Coverage Card */}
        <ScrollReveal direction="up" delay={0.1} distance={25}>
          <div className="bg-[#0c0c12] rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Course Syllabus Mapping (Module 2: Key Management & Asymmetric Crypto)
                </h3>
                <p className="text-xs text-neutral-400">
                  Core academic topics implemented and demonstrated in this laboratory
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#08080c] border border-neutral-800 space-y-1.5">
                <span className="text-blue-400 font-bold block">1. Diffie-Hellman Protocol</span>
                <p className="text-neutral-300 leading-relaxed">
                  Modular arithmetic: <code className="text-blue-300">A = g^a mod p</code> and <code className="text-blue-300">K = B^a mod p</code>. Symmetric key establishment without transmission.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#08080c] border border-neutral-800 space-y-1.5">
                <span className="text-emerald-400 font-bold block">2. Discrete Log Problem</span>
                <p className="text-neutral-300 leading-relaxed">
                  One-way trapdoor function: computational hardness, prime group order, and vulnerability of small parameters to brute-force.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#08080c] border border-neutral-800 space-y-1.5">
                <span className="text-rose-400 font-bold block">3. Man-in-the-Middle Attack</span>
                <p className="text-neutral-300 leading-relaxed">
                  Active channel adversary: packet interception, dual key substitution, message decryption, tampering, and seamless forwarding.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#08080c] border border-neutral-800 space-y-1.5">
                <span className="text-orange-400 font-bold block">4. Authentication & TLS 1.3</span>
                <p className="text-neutral-300 leading-relaxed">
                  Countermeasures: digital signatures (RSA/ECDSA), X.509 Public Key Infrastructure, and Ephemeral DH (PFS).
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Viva Voce Questions Accordion */}
        <ScrollReveal direction="up" delay={0.15} distance={25}>
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <Award className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-lg text-white">
                8 Essential Viva Voce Questions & Answers
              </h3>
            </div>

            <div className="space-y-3">
              {vivaQuestions.map((item, idx) => {
                const isOpen = openVivaIndex === idx;

                return (
                  <div
                    key={idx}
                    className="bg-[#0c0c12] rounded-2xl border border-neutral-800/90 overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleViva(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-neutral-900/40 transition-colors"
                    >
                      <span className="text-sm font-semibold text-neutral-100">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-orange-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 bg-[#08080c]">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Tech Stack & Architecture Badges */}
        <ScrollReveal direction="up" delay={0.2} distance={25}>
          <div className="bg-[#0c0c12] rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800">
              <Layers className="w-5 h-5 text-orange-400" />
              <h4 className="font-bold text-base text-white">Full-Stack System Architecture</h4>
            </div>

            <div className="flex flex-wrap gap-2.5 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                React 18 + Vite + TypeScript
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                Tailwind CSS (Cyber Aesthetics)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                Framer Motion Animations
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                FastAPI + Pydantic + Uvicorn
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                Client BigInt Engine (Zero-Crash Fallback)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                Web Crypto API SHA-256
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                Pytest Automated Test Suite
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono">
                GitHub Pages + Render CI/CD
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 text-xs text-orange-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Educational Disclaimer:</strong> KeyExchange Lab is designed strictly for academic demonstration and classroom presentation. While the modular arithmetic, safe primes, and Miller-Rabin algorithms adhere directly to cryptographic standards, the XOR stream cipher and simplified certificate simulation are optimized for transparent visual understanding rather than production encryption.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Footer info & credits */}
        <ScrollReveal direction="up" delay={0.24} distance={15}>
          <div className="text-center text-xs text-neutral-500 pt-6 border-t border-neutral-900 space-y-2">
            <p>
              KeyExchange Lab &bull; Cryptography & Network Security Course Project (Module 2)
            </p>
            <p className="text-[11px] text-neutral-600">
              Crafted for live examiner presentation, mathematical storytelling, and reliable offline demonstration.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

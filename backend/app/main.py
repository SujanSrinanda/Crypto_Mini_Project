"""FastAPI Application for KeyExchange Lab.

Interactive Diffie-Hellman Key Exchange and Man-in-the-Middle Simulator.
Educational API adhering to pure Python standard library cryptography.
"""

import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.crypto import (
    STANDARD_PARAMS,
    decrypt_message,
    encrypt_message,
    generate_private_key,
    modular_exponentiation,
    parse_int,
    simulate_protocol,
    solve_discrete_log_brute_force,
    validate_dh_parameters,
)
from app.models import (
    DecryptRequest,
    DecryptResponse,
    EncryptRequest,
    EncryptResponse,
    HealthResponse,
    KeyPairRequest,
    KeyPairResponse,
    ParamsResponse,
    ParamSet,
    SharedSecretRequest,
    SharedSecretResponse,
    SimulateRequest,
    SimulateResponse,
)

app = FastAPI(
    title="KeyExchange Lab API",
    description=(
        "Educational REST API simulating Diffie-Hellman Key Exchange (DHKE) and "
        "Man-in-the-Middle (MITM) attacks for Cryptography & Network Security (Module 2). "
        "Uses pure Python standard library for transparent crypto arithmetic."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for local development and deployed frontend
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "https://*.github.io",
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins.extend([origin.strip() for origin in env_origins.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for educational demo accessibility across deploy URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check() -> HealthResponse:
    """Return operational status and engine information."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        engine="FastAPI DH Engine (Python Standard Library)",
    )


@app.get("/api/params", response_model=ParamsResponse, tags=["Parameters"])
def get_parameters(
    bits: str = Query(
        default="toy",
        description="Desired parameter size ('toy', '64', '128', '256')",
        pattern="^(toy|64|128|256)$",
    )
) -> ParamsResponse:
    """Fetch standard safe prime modulus p and generator g.
    
    Returns known safe primes resisting Pohlig-Hellman attacks.
    """
    selected_key = bits if bits in STANDARD_PARAMS else "toy"
    param_data = STANDARD_PARAMS[selected_key]
    return ParamsResponse(
        selected=ParamSet(**param_data),
        available_bits=list(STANDARD_PARAMS.keys()),
    )


@app.post("/api/keypair", response_model=KeyPairResponse, tags=["Key Exchange"])
def create_keypair(payload: KeyPairRequest) -> KeyPairResponse:
    """Generate or compute a Diffie-Hellman key pair.
    
    If 'private' is omitted, a cryptographically secure random private exponent is chosen.
    Computes public key: A = g^a mod p.
    """
    try:
        p = parse_int(payload.p, "p")
        g = parse_int(payload.g, "g")
        validate_dh_parameters(p, g)

        if payload.private is not None and str(payload.private).strip():
            private_val = parse_int(payload.private, "private")
            if private_val < 2 or private_val >= p:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Private key must satisfy 2 <= private < p ({p}). Received {private_val}.",
                )
        else:
            private_val = generate_private_key(p)

        public_val = modular_exponentiation(g, private_val, p)

        return KeyPairResponse(
            p=str(p),
            g=str(g),
            private=str(private_val),
            public=str(public_val),
        )
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err


@app.post("/api/shared-secret", response_model=SharedSecretResponse, tags=["Key Exchange"])
def calculate_shared_secret(payload: SharedSecretRequest) -> SharedSecretResponse:
    """Compute shared secret: S = their_public ^ my_private mod p.
    
    Derives 256-bit symmetric encryption key via SHA-256.
    """
    try:
        p = parse_int(payload.p, "p")
        their_public = parse_int(payload.their_public, "their_public")
        my_private = parse_int(payload.my_private, "my_private")

        validate_dh_parameters(p, 2)  # basic check on p
        if their_public <= 1 or their_public >= p:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Their public key must satisfy 1 < public < p. Received {their_public}.",
            )

        shared_secret = modular_exponentiation(their_public, my_private, p)
        from app.crypto import derive_symmetric_key

        derived_key = derive_symmetric_key(shared_secret)

        return SharedSecretResponse(
            shared_secret=str(shared_secret),
            derived_key_hex=derived_key.hex(),
        )
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err


@app.post("/api/simulate", response_model=SimulateResponse, tags=["Simulation"])
def simulate(payload: SimulateRequest) -> SimulateResponse:
    """Execute complete Diffie-Hellman exchange simulation.
    
    Supports:
    - Normal secure exchange between Alice and Bob
    - Man-in-the-Middle attack by Eve (with dual forged keypairs and tampering)
    - Authenticated DH mode where Eve's forged public key is rejected by digital signature verification
    
    Returns ordered steps formatted for frontend visual timeline animation.
    """
    try:
        result = simulate_protocol(
            p_val=payload.p,
            g_val=payload.g,
            mitm=payload.mitm,
            message=payload.message,
            alice_private=payload.alice_private,
            bob_private=payload.bob_private,
            eve_alice_private=payload.eve_alice_private,
            eve_bob_private=payload.eve_bob_private,
            tampered_message=payload.tampered_message,
            authenticated_dh=payload.authenticated_dh,
        )
        return SimulateResponse(**result)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err


@app.post("/api/encrypt", response_model=EncryptResponse, tags=["Encryption"])
def encrypt(payload: EncryptRequest) -> EncryptResponse:
    """Encrypt a plaintext message using key derived from shared secret (SHA-256 + XOR stream)."""
    try:
        secret_int = parse_int(payload.shared_secret, "shared_secret")
        key_hex, ciphertext_hex = encrypt_message(payload.message, secret_int)
        return EncryptResponse(
            plaintext=payload.message,
            derived_key_hex=key_hex,
            ciphertext_hex=ciphertext_hex,
        )
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err


@app.post("/api/decrypt", response_model=DecryptResponse, tags=["Encryption"])
def decrypt(payload: DecryptRequest) -> DecryptResponse:
    """Decrypt a ciphertext hex string using key derived from shared secret."""
    try:
        secret_int = parse_int(payload.shared_secret, "shared_secret")
        key_hex, plaintext = decrypt_message(payload.ciphertext_hex, secret_int)
        return DecryptResponse(
            ciphertext_hex=payload.ciphertext_hex,
            derived_key_hex=key_hex,
            plaintext=plaintext,
        )
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err


class DiscreteLogRequest(BaseModel):
    p: int = Field(description="Modulus p")
    g: int = Field(description="Generator g")
    public_val: int = Field(description="Target public key to solve private exponent for")
    max_steps: int = Field(default=200000, description="Max trial steps")


@app.post("/api/discrete-log", tags=["Educational Lab"])
def crack_discrete_log(payload: DiscreteLogRequest):
    """Solve the Discrete Logarithm Problem using brute force.
    
    Demonstrates computational complexity: trivial for toy primes, astronomically difficult for large primes.
    """
    try:
        validate_dh_parameters(payload.p, payload.g)
        return solve_discrete_log_brute_force(
            p=payload.p,
            g=payload.g,
            public_val=payload.public_val,
            max_steps=payload.max_steps,
        )
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err

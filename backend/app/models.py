"""Pydantic models for KeyExchange Lab FastAPI Backend."""

from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(default="ok", description="Server operational status")
    version: str = Field(default="1.0.0", description="API version")
    engine: str = Field(
        default="FastAPI DH Engine (Python Standard Library)",
        description="Name of cryptographic engine in use"
    )


class ParamSet(BaseModel):
    """Safe prime and generator parameter set."""
    bits: Union[int, str] = Field(description="Bit length identifier (toy, 64, 128, 256)")
    p: str = Field(description="Safe prime modulus p in decimal string format")
    g: str = Field(description="Generator / base g in decimal string format")
    description: str = Field(description="Description and cryptographic strength notes")


class ParamsResponse(BaseModel):
    """Response containing standard safe prime DH parameters."""
    selected: ParamSet
    available_bits: List[str]


class KeyPairRequest(BaseModel):
    """Request to compute or generate a Diffie-Hellman keypair."""
    p: Union[int, str] = Field(description="Modulus p (must be prime)")
    g: Union[int, str] = Field(description="Generator g")
    private: Optional[Union[int, str]] = Field(
        default=None,
        description="Optional manual private key. If omitted, cryptographically securely generated."
    )


class KeyPairResponse(BaseModel):
    """Response containing DH private and public keys."""
    private: str = Field(description="Private exponent in decimal string format")
    public: str = Field(description="Public key = g^private mod p in decimal string format")
    p: str
    g: str


class SharedSecretRequest(BaseModel):
    """Request to compute Diffie-Hellman shared secret."""
    p: Union[int, str] = Field(description="Modulus p")
    their_public: Union[int, str] = Field(description="The other party's public key")
    my_private: Union[int, str] = Field(description="My own private key")


class SharedSecretResponse(BaseModel):
    """Response containing computed shared secret."""
    shared_secret: str = Field(description="Computed shared secret = their_public^my_private mod p")
    derived_key_hex: str = Field(description="SHA-256 derived symmetric encryption key hex")


class EncryptRequest(BaseModel):
    """Request to encrypt a message using derived symmetric key."""
    shared_secret: Union[int, str] = Field(description="Shared secret integer or string")
    message: str = Field(description="Plaintext string message to encrypt")


class EncryptResponse(BaseModel):
    """Response containing ciphertext."""
    plaintext: str
    derived_key_hex: str
    ciphertext_hex: str = Field(description="Hexadecimal XOR stream ciphertext")


class DecryptRequest(BaseModel):
    """Request to decrypt a ciphertext hex using derived symmetric key."""
    shared_secret: Union[int, str] = Field(description="Shared secret integer or string")
    ciphertext_hex: str = Field(description="Hexadecimal XOR stream ciphertext")


class DecryptResponse(BaseModel):
    """Response containing decrypted plaintext."""
    ciphertext_hex: str
    derived_key_hex: str
    plaintext: str


class SimulationStep(BaseModel):
    """Step representation for frontend animation timeline."""
    step: int = Field(description="Sequential step index (1-based)")
    actor: Literal["Alice", "Bob", "Eve", "Channel", "System"] = Field(
        description="Primary actor performing or responsible for the step"
    )
    action: str = Field(description="Short action label")
    description: str = Field(description="Detailed human-readable explanation of what happened")
    formula: Optional[str] = Field(default=None, description="Mathematical equation rendered in step")
    values: Dict[str, Any] = Field(default_factory=dict, description="Active variables and values at this step")
    packet: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Packet transport details (sender, receiver, payload, intercepted)"
    )
    alert_type: Literal["info", "success", "warning", "danger"] = Field(
        default="info",
        description="Visual emphasis state"
    )


class SimulateRequest(BaseModel):
    """Full protocol simulation request."""
    p: Union[int, str] = Field(description="Modulus p")
    g: Union[int, str] = Field(description="Generator g")
    mitm: bool = Field(default=False, description="Enable Man-in-the-Middle attack mode")
    authenticated_dh: bool = Field(
        default=False,
        description="Enable digital signatures/certificates to counter MITM"
    )
    message: str = Field(
        default="Secret rendezvous at noon.",
        description="Original message from Alice to Bob"
    )
    tampered_message: Optional[str] = Field(
        default="Wire $1,000,000 to Eve's offshore account immediately.",
        description="Altered message transmitted by Eve in MITM mode"
    )
    alice_private: Optional[Union[int, str]] = None
    bob_private: Optional[Union[int, str]] = None
    eve_alice_private: Optional[Union[int, str]] = None
    eve_bob_private: Optional[Union[int, str]] = None


class SimulateResponse(BaseModel):
    """Complete simulation result and animated steps."""
    success: bool
    mitm: bool
    authenticated_dh: bool
    keys_match: bool
    auth_verified: bool
    summary: Dict[str, Any]
    steps: List[SimulationStep]

"""API integration tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify /api/health returns ok status and engine name."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "FastAPI" in data["engine"]


def test_params_endpoint():
    """Verify /api/params returns standard safe primes."""
    response = client.get("/api/params?bits=toy")
    assert response.status_code == 200
    data = response.json()
    assert data["selected"]["bits"] == "toy"
    assert data["selected"]["p"] == "23"
    assert data["selected"]["g"] == "5"

    response_64 = client.get("/api/params?bits=64")
    assert response_64.status_code == 200
    assert response_64.json()["selected"]["bits"] == "64"


def test_keypair_endpoint():
    """Verify /api/keypair computes correct public key from private."""
    # 5^4 mod 23 = 4
    response = client.post("/api/keypair", json={"p": 23, "g": 5, "private": 4})
    assert response.status_code == 200
    data = response.json()
    assert data["public"] == "4"
    assert data["private"] == "4"

    # Test random generation
    response_auto = client.post("/api/keypair", json={"p": 23, "g": 5})
    assert response_auto.status_code == 200
    data_auto = response_auto.json()
    assert int(data_auto["private"]) >= 2
    assert int(data_auto["public"]) >= 1


def test_shared_secret_endpoint():
    """Verify /api/shared-secret computes shared secret correctly."""
    # Alice: priv=6, Bob public=19, p=23 -> 19^6 mod 23 = 2
    response = client.post(
        "/api/shared-secret",
        json={"p": 23, "their_public": 19, "my_private": 6},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["shared_secret"] == "2"
    assert len(data["derived_key_hex"]) == 64


def test_encrypt_decrypt_endpoints():
    """Verify /api/encrypt and /api/decrypt roundtrip."""
    enc_resp = client.post(
        "/api/encrypt",
        json={"shared_secret": 42, "message": "Super Secret Message"},
    )
    assert enc_resp.status_code == 200
    enc_data = enc_resp.json()
    assert "ciphertext_hex" in enc_data

    dec_resp = client.post(
        "/api/decrypt",
        json={"shared_secret": 42, "ciphertext_hex": enc_data["ciphertext_hex"]},
    )
    assert dec_resp.status_code == 200
    assert dec_resp.json()["plaintext"] == "Super Secret Message"


def test_simulate_endpoint():
    """Verify /api/simulate returns ordered timeline steps."""
    response = client.post(
        "/api/simulate",
        json={
            "p": 23,
            "g": 5,
            "mitm": False,
            "message": "Hello Exam Committee!",
            "alice_private": 6,
            "bob_private": 15,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["keys_match"] is True
    assert len(data["steps"]) >= 6
    assert data["steps"][0]["step"] == 1


def test_invalid_parameter_validation():
    """Verify validation returns 400 for composite modulus."""
    response = client.post(
        "/api/keypair",
        json={"p": 24, "g": 5, "private": 3},  # 24 is composite
    )
    assert response.status_code == 400
    assert "composite" in response.json()["detail"].lower()

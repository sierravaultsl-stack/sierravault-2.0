# SierraVault

SierraVault is more than a file storage application — it is a national solution to the longstanding problem of lost, damaged, or missing official documents in Sierra Leone. Certificates, IDs, and government records are now secure, accessible, and verifiable.

Built on a robust blockchain infrastructure, SierraVault ensures your documents are safe and accessible only by you.

---

## Features

### Enhanced Identity Verification
- Optional NIN-based login allows users to link their National Identification Number.
- Receive official government documents directly inside SierraVault.
- Secure, fast, and trustworthy access to national services.

### Inclusive AI Assistance
- AI Krio text-to-speech assistant reads every page aloud.
- Supports Krio and English for inclusive accessibility.
- Makes navigation simple for users of all literacy levels.

### Digital Empowerment
- Not just storage — it’s data security and national progress.
- Every stored document strengthens Sierra Leone’s digital future.

---

## Getting Started

### Installation
Clone the repository and install dependencies:
```bash

pnpm install

```

Make sure all dependencies are installed
```bash
pnpm add @google/generative-ai mongoose bcryptjs jsonwebtoken @supabase/supabase-js
```

Run the dev environment
```bash
pnpm dev
```
### Mock Credentials (Summary)

| Name           | Surname  | NIN      | Expiry     |
|----------------|---------|----------|------------|
| Sorie Kamara   | Kamara  | 1AAKDES  | 2029-03-12 |
| Hawa Kargbo    | Kargbo  | 1BBHDES  | 2032-07-22 |
| Mohamed Bangura| Bangura | 1CCMDES  | 2026-11-09 |
| ...            | ...     | ...      | ...        |

> Full unsued list is in [`mock-data/unused.json`](mock-data/unused.json)
> Full used list is in [`mock-data/unused.json`](mock-data/used.json)


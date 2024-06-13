---
sidebar_position: 1
---

# Versioning

`@shined/use` strictly adheres to the principles of [Semantic Versioning (SemVer)](https://semver.org/), ensuring a predictable and transparent method for managing version numbers and compatibility. Understanding how version numbers are incremented can help you prepare for upgrades and integrate new features with confidence.

## SemVer Versioning

Each version is composed of three segments: Major, Minor, and Patch (e.g., `1.4.2`).

- **Major Version**: Incompatible API changes that could necessitate modifications in existing code.
- **Minor Version**: New features that are backward-compatible without disrupting existing implementations.
- **Patch Version**: Backward-compatible bug fixes that address unexpected behavior or glitches.

## Pre-release Versions

In addition to the standard versioning structure, we may also release pre-release versions for testing and feedback. Pre-release versions are identified by appending a hyphen and a series of dot-separated identifiers to the version number (e.g., `1.4.2-alpha.1`, `1.4.2-rc.1`, etc.).

+++
title = "NeuroScan - Malicious Commit Detection"
description = "LLM-based software supply chain security system designed to detect malicious scripts."
date = 2025-09-01
updated = 2026-01-13
[taxonomies]
tags = ["security", "llm", "python"]
+++

**GitHub**: [JakeClark-chan/npm_commit_detection](https://github.com/JakeClark-chan/npm_commit_detection)

A research project associated with UIT.
NeuroScan is a software supply chain security system designed to detect malicious scripts in NPM packages at the commit level, before they are ever released or deployed.
- Hybrid analysis pipeline: Integrates Static Analysis (metadata extraction, pattern matching), Dynamic Analysis (Falco Syscall Monitoring, Package Hunter Sandbox), and LLM Semantic Inspection.
- Deobfuscation engine: Automatically detects and reverses JS obfuscation techniques, then uses an LLM to restore readability before deep analysis.
- CI/CD integration: Embeds the detection workflow into GitHub Actions for automated security scanning on every push.
- Multi-model benchmarking: Tested on GPT-OSS-120B, Llama-4, GPT-5-Mini, achieving 83.76% Accuracy and 94% Recall.
- Cost-optimized: Only $0.36 per 200 commits; processing speed of 45.2 commits/minute.
- Real-world validation: Validated on 36 real malware repositories, successfully catching Crypto Stealers and VS Code exploits.

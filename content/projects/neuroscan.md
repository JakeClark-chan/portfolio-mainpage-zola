+++
title = "NeuroScan - Malicious Commit Detection"
description = "Hệ thống soi mã nguồn độc hại trong NPM package bằng LLM cực kì đỉnh chóp."
date = 2025-09-01
updated = 2026-01-13
[taxonomies]
tags = ["security", "llm", "python"]
+++

**GitHub**: [JakeClark-chan/npm_commit_detection](https://github.com/JakeClark-chan/npm_commit_detection)

Đề tài nghiên cứu "flex" trí tuệ tại UIT.
Hệ thống bảo mật chuỗi cung ứng phần mềm cực kì xịn xò, chuyên đi săn lùng script độc hại trong các NPM package ngay thời điểm commit (trước khi được release).
- Kiến trúc lai (Hybrid Pipeline): Phối hợp ăn ý giữa Static Analysis, Dynamic Analysis với sandbox, và con mắt tinh tường của LLM.
- Bắt bài Obfuscation: Tự động lột mặt nạ code bị làm rối, hết đường chạy.
- Tích hợp CI/CD: Gắn thẳng vào GitHub Actions để tự động quét mỗi khi có ông nào push code lên. Đỡ phải làm bằng cơm.
- Benchmark thực chiến: Đã test trên dàn LLM khủng như GPT-OSS-120B, Llama-4, GPT-5-Mini. Bắt dính 94% malware thực tế, tốc độ chạy thì ảo ma (45.2 commit/phút), mà giá siêu "hạt dẻ" chỉ 0.36 đô cho 200 commit.

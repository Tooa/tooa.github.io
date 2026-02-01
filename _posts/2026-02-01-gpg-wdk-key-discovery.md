---
date: 2026-02-01
layout: post
title: WKD for OpenPGP key discovery on Github Pages
description: How I debugged and fixed OpenPGP WKD key discovery failures. The solution involved switching from the WDK direct method to the WDK advanced method using a dedicated GitHub Pages repository.
tags:
- Linux
---

# Introduction

Last year, I created an OpenPGP [Web Key Directory (WKD)](https://wiki.gnupg.org/WKDHosting) hosted on Github Pages to enable automatic lookup of my OpenPGP public keys based on my email address.

Back then, I decided to use the **Direct Method**, which is a fallback method for discovering keys through WKD and does not require setting up a custom DNS record (`openpgpkey.domain.tld`).

Most WKD clients prefer the **Advanced Method** though by looking up the `openpgpkey.domain.tld` domain for advanced key discovery. If this DNS request fails, they will lookup `domain.tld` and then use this host for the direct method.

> The directory structure differs between the direct and the advanced method. Use [webkeydirectory.com](https://www.webkeydirectory.com) to verify your setup after setting up the WKD.
{: .callout .callout-tip}

# Problem Statement & Troubleshooting

While setting up a fresh installation of [CachyOS](https://cachyos.org/) this weekend, the key import via WKD failed:

> I use Arch BTW!
{: .callout .callout-aside}

```terminal
$ gpg-wks-client --check -v --debug=ipc mail@domain.tld

gpg-wks-client: DBG: chan_3 <- # Home: /home/<user>/.gnupg
gpg-wks-client: DBG: chan_3 <- # Config: /home/<user>/.gnupg/dirmngr.conf
gpg-wks-client: DBG: chan_3 <- OK Dirmngr 2.4.9 at your service, process 5107
gpg-wks-client: DBG: connection to the dirmngr established
gpg-wks-client: DBG: chan_3 -> WKD_GET -- mail@domain.tld
gpg-wks-client: DBG: chan_3 <- S SOURCE https://openpgpkey.domain.tld
gpg-wks-client: DBG: chan_3 <- ERR 1 General error <Unspecified source>
gpg-wks-client: DBG: chan_3 -> BYE
gpg-wks-client: error looking up 'mail@domain.tld' via WKD: General error
```

The error message revealed nothing useful. The thing called dirmngr (spoken: dirmanager) is a tool that comes with GnuPG. It is responsible for sending or receiving information about public keys, like getting them from a keyserver or via WKD.

If you want to analyze what is going wrong with dirmngr, you can create [log files](https://wiki.gnupg.org/TroubleShooting/DebugWithDirmngr).

`~/.gnupg/dirmngr.conf`:

```config
log-file /home/<user>/dirmngr.log
verbose
debug dns,network,lookup
```

The debug log below reveals the issue. This is what you can observe in the log:

- dirmngr first attempts to locate the public key via the advanced method
- dirmngr successfully resolves `openpgpkey.domain.tld`, but fails to verify the certificate
- dirmngr skips the direct method as fallback

The Problem: Despite **no** CNAME configuration, dirmngr successfully resolves `openpgpkey.domain.tld`. In consequence, dirmngr now skips the direct method as fallback.


`~/dirmngr.log`:

```config
dirmngr[142016.5]: enabled debug flags: dns network lookup
dirmngr[142016.5]: permanently loaded certificates: 145
dirmngr[142016.5]:     runtime cached certificates: 0
dirmngr[142016.5]:            trusted certificates: 145 (145,0,0,0)
dirmngr[142016.5]: handler for fd 5 terminated
dirmngr[142016.5]: handler for fd 5 started
dirmngr[142016.5]: connection from process 152242 (1000:1000)
dirmngr[142016.5]: DBG: dns: libdns initialized
dirmngr[142016.5]: DBG: dns: resolve_dns_name(openpgpkey.domain.tld): Success
dirmngr[142016.5]: DBG: Using TLS library: GNUTLS 3.8.11
dirmngr[142016.5]: detected interfaces: IPv4 IPv6
dirmngr[142016.5]: DBG: http.c:connect_server: trying name='openpgpkey.domain' port=443
dirmngr[142016.5]: DBG: dns: resolve_dns_name(openpgpkey.domain.tld): Success
dirmngr[142016.5]: DBG: http.c:2893:socket_new: object 0x00007fc370fb3190 for fd 6 created
dirmngr[142016.5]: TLS verification of peer failed: status=0x0042
dirmngr[142016.5]: TLS verification of peer failed: The certificate is NOT trusted. The certificate issuer is unknown.-
dirmngr[142016.5]: TLS verification of peer failed: hostname does not match
dirmngr[142016.5]: DBG: expected hostname: openpgpkey.domain.tld
dirmngr[142016.5]: DBG: BEGIN Certificate 'server[0]':
dirmngr[142016.5]: DBG:      serial: 058715B14819765A73941B66A6DE1364
dirmngr[142016.5]: DBG:   notBefore: 2026-01-31 08:07:11
dirmngr[142016.5]: DBG:    notAfter: 2027-01-31 08:07:11
dirmngr[142016.5]: DBG:      issuer: CN=TRAEFIK DEFAULT CERT
dirmngr[142016.5]: DBG:     subject: CN=TRAEFIK DEFAULT CERT
dirmngr[142016.5]: DBG:         aka: (8:dns-name81:86be942d4d7104eebd8a6783e066e9e8.24bed133f6aabc1d2182b35f2fa76289.traefik.default)
dirmngr[142016.5]: DBG:   hash algo: 1.2.840.113549.1.1.11
dirmngr[142016.5]: DBG:   SHA1 fingerprint: D118CC76203D39481C4C38639A32887234105343
dirmngr[142016.5]: DBG: END Certificate
dirmngr[142016.5]: TLS connection authentication failed: General error
dirmngr[142016.5]: error connecting to 'https://openpgpkey.domain.tld/.well-known/openpgpkey/domain.tld/hu/dizb37aqa5h4skgu7jf1xjr4q71w4paq?l=mail': General error
dirmngr[142016.5]: command 'WKD_GET' failed: General error <Unspecified source>
dirmngr[142016.5]: handler for fd 5 terminated
dirmngr[142016.0]: SIGTERM received - shutting down ...
dirmngr[142016.0]: dirmngr (GnuPG) 2.4.9 stopped
```

# The Solution

I never determined why dirmngr successfully resolves the `openpgpkey.domain.tld` DNS without a CNAME configuration. Investigating would require more time than I had available. So, I switched to the advanced method instead.

I already have a [personal user repository](https://github.com/Tooa/tooa.github.io) hosting my website with a custom CNAME `domain.tld`. But, Github Pages do not support multiple CNAME records (`domain.tld` and `openpgpkey.domain.tld`) for this personal user site repository (`<username>.github.io`). So I created a dedicated [openpgpkey](https://github.com/Tooa/openpgpkey) Github Pages repository hosting the WKD in advanced method structure.

I then configured an additional CNAME record via my domain service provider that redirects `openpgpkey.domain.tld` to `<username>.github.io`. That way, `domain.tld` still resolves to my website and `openpgpkey.domain.tld` to the WKD.

In conclusion, switching to the advanced method solved (worked around) the problem:

```terminal
$ gpg-wks-client --check -v mail@domain.tld

gpg-wks-client: public key for 'mail@domain.tld' found via WKD
```

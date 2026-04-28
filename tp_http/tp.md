# TP 2 : Maîtrise de cURL

## Notion de cURL dans le concept de dev

cURL est une commande qui permet d'envoyer des requêtes HTTP vers une destination et de récupérer des réponses.
C'est comme une simulation d'un navigateur en ligne de commande.

---

## 2.1 Requête GET simple

### Commande de base

```bash
curl https://httpbin.org/get
```

Résultat :
```json
{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.5.0",
    "X-Amzn-Trace-Id": "Root=1-69f0b28a-1f768139077eb12678b4e5d1"
  },
  "origin": "196.217.130.231",
  "url": "https://httpbin.org/get"
}
```

### Option `-i` : afficher les headers de réponse

```bash
curl -i https://httpbin.org/get
```

L'option `-i` affiche les headers HTTP de la réponse en plus du corps.

Résultat :
```
HTTP/2 200
date: Tue, 28 Apr 2026 13:14:04 GMT
content-type: application/json
content-length: 256
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true

{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.5.0",
    "X-Amzn-Trace-Id": "Root=1-69f0b29c-246166ea5ad0cd6946cccf8f"
  },
  "origin": "196.217.130.231",
  "url": "https://httpbin.org/get"
}
```

### Option `-v` : mode verbose (débogage complet)

```bash
curl -v https://httpbin.org/get
```

Le mode `-v` est différent de `-i` : il affiche la requête + la réponse + toutes les infos réseau (résolution DNS, handshake TLS, négociation HTTP/2...).

Résultat :
```
* Host httpbin.org:443 was resolved.
* IPv4: 44.199.179.5, 23.23.43.241, ...
*   Trying 44.199.179.5:443...
* Connected to httpbin.org (44.199.179.5) port 443
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* Server certificate: CN=httpbin.org (valide jusqu'au 17 Aug 2026)
* using HTTP/2

> GET /get HTTP/2
> Host: httpbin.org
> User-Agent: curl/8.5.0
> Accept: */*

< HTTP/2 200
< date: Tue, 28 Apr 2026 13:24:38 GMT
< content-type: application/json
< content-length: 256
< server: gunicorn/19.9.0
< access-control-allow-origin: *
< access-control-allow-credentials: true

{
  "args": {},
  "headers": { ... },
  "origin": "196.217.130.231",
  "url": "https://httpbin.org/get"
}
* Connection #0 to host httpbin.org left intact
```

### Différence entre `-i` et `-v`

| Option | Ce qu'elle affiche |
|--------|--------------------|
| `-i`   | Headers de réponse + corps |
| `-v`   | Tout : infos réseau + requête envoyée + headers réponse + corps (mode débogage complet) |

---

## 2.2 Requête POST avec données

```bash
curl -X POST -d "name=John&email=john@example.com" \
  https://httpbin.org/post
```

Résultat :
```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {
    "email": "john@example.com",
    "name": "John"
  },
  "headers": {
    "Accept": "*/*",
    "Content-Length": "32",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.5.0",
    "X-Amzn-Trace-Id": "Root=1-69f0b532-111c0d6a180852b3672ffe73"
  },
  "json": null,
  "origin": "196.217.130.231",
  "url": "https://httpbin.org/post"
}
```


# 2.3 Headers personnalisés

```bash
curl -H "Authorization: Bearer montoken123" \
     -H "X-Custom-Header: MonHeader" \
     https://httpbin.org/headers
```

Résultat :
```json
{
  "headers": {
    "Accept": "*/*",
    "Authorization": "Bearer montoken123",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.5.0",
    "X-Amzn-Trace-Id": "Root=...",
    "X-Custom-Header": "MonHeader"
  }
}
```

# 2.4 Suivre les redirections

```bash
curl -L https://httpbin.org/redirect/3
```

Sans `-L`, curl s'arrête à la première redirection (code 302).
Avec `-L`, curl suit automatiquement toutes les redirections jusqu'à la réponse finale.

```bash
# Pour voir chaque étape de la redirection
curl -v -L https://httpbin.org/redirect/3
```

# 2.5 Télécharger un fichier

```bash
curl -O https://httpbin.org/image/png
# ou avec un nom personnalisé
curl -o mon_image.png https://httpbin.org/image/png
```

# Exercice avancé cURL

Commande cURL complète :

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: MonHeader" \
  -d '{"action": "test", "value": 42}' \
  -i
```

Résultat :
```json
{
  "data": "{\"action\": \"test\", \"value\": 42}",
  "headers": {
    "Content-Type": "application/json",
    "X-Custom-Header": "MonHeader",
    ...
  },
  "json": {
    "action": "test",
    "value": 42
  },
  "url": "https://httpbin.org/post"
}
```

---

# TP 3 : API REST avec JavaScript

## 3.1 GET basique

```javascript
fetch('https://httpbin.org/get')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error('Erreur:', err));

// Avec async/await
async function getData() {
  const response = await fetch('https://httpbin.org/get');
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  console.log(data);
}
getData();
```

## 3.2 POST - Créer une ressource

```javascript
async function createResource() {
  const response = await fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', age: 25 })
  });
  const data = await response.json();
  console.log('Créé:', data);
}
createResource();
```

## 3.3 PUT - Modifier une ressource

```javascript
async function updateResource(id) {
  const response = await fetch(`https://httpbin.org/put`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name: 'Alice Modifiée' })
  });
  const data = await response.json();
  console.log('Modifié:', data);
}
updateResource(1);
```

## 3.4 DELETE - Supprimer une ressource

```javascript
async function deleteResource(id) {
  const response = await fetch(`https://httpbin.org/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (response.ok) console.log('Supprimé avec succès');
  else console.error('Erreur suppression:', response.status);
}
deleteResource(1);
```

## Exercice pratique : fetchWithRetry

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      // Si erreur 5xx, on réessaie
      if (response.status >= 500 && attempt < maxRetries) {
        console.warn(`Tentative ${attempt} échouée (${response.status}), retry...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      return response;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Utilisation
fetchWithRetry('https://httpbin.org/status/500', {}, 3)
  .then(res => console.log('Status:', res.status))
  .catch(err => console.error('Échec après 3 tentatives:', err));
```

---

# TP 4 : Analyse des Headers de Sécurité

## 4.1 Vérifier les headers d'un site

```bash
curl -I https://github.com
```

Résultat (extrait) :
```
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubdomains; preload
x-frame-options: deny
x-content-type-options: nosniff
content-security-policy: default-src 'none'; ...
referrer-policy: origin-when-cross-origin, strict-origin-when-cross-origin
```

## 4.2 Analyse avec Security Headers

Site analysé : https://securityheaders.com → entrer `github.com`

### Tableau d'analyse des 3 sites

| Site | HSTS | X-Frame-Options | CSP | Note |
|------|------|-----------------|-----|------|
| github.com | ✅ max-age=31536000; includeSubdomains; preload | ✅ deny | ✅ présent | A+ |
| google.com | ✅ max-age=31536000 | ✅ SAMEORIGIN | ✅ présent | A |
| wikipedia.org | ✅ max-age=106384710 | ✅ deny | ✅ présent | A |

---

# TP 5 : Cache HTTP

## 5.1 Observer le cache

```bash
# Première requête
curl -I https://httpbin.org/cache/60
# Résultat : Cache-Control: public, max-age=60

# Requête conditionnelle avec ETag
curl -I https://httpbin.org/etag/monEtag
# Résultat : ETag: "monEtag"
```

## 5.2 Requête conditionnelle avec ETag

```bash
# 1. Récupérer l'ETag
curl -I https://httpbin.org/etag/test123
# ETag: "test123"

# 2. Utiliser If-None-Match pour valider le cache
curl -H 'If-None-Match: "test123"' https://httpbin.org/etag/test123
# Réponse : 304 Not Modified (ressource non modifiée, cache valide)
```

## 5.3 Simulation de cache dans le navigateur

Observations :
- F5 (rechargement normal) : le navigateur envoie `If-None-Match` / `If-Modified-Since` → serveur répond 304 si pas de changement
- Ctrl+Shift+R (hard reload) : le navigateur ignore le cache, envoie une requête fraîche → serveur répond 200

## Exercice : Page HTML avec headers de cache

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>Cache Demo</title>
</head>
<body>
  <img src="image.png" alt="demo">
  <script src="app.js"></script>
</body>
</html>
```

Headers de cache recommandés par type de fichier (à configurer côté serveur) :

```
# Images (rarement modifiées)
Cache-Control: public, max-age=31536000, immutable

# CSS / JS (versionnés avec hash dans le nom)
Cache-Control: public, max-age=31536000, immutable

# HTML (toujours revalidé)
Cache-Control: no-cache
```

---

# Exercices Récapitulatifs

## Exercice 1 : Client HTTP minimaliste

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Client HTTP</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 2rem auto; }
    textarea, input, select { width: 100%; margin: 0.5rem 0; padding: 0.4rem; }
    pre { background: #f4f4f4; padding: 1rem; overflow: auto; }
  </style>
</head>
<body>
  <h2>Client HTTP</h2>
  <label>URL : <input id="url" type="text" value="https://httpbin.org/get"></label>
  <label>Méthode :
    <select id="method">
      <option>GET</option><option>POST</option>
      <option>PUT</option><option>DELETE</option>
    </select>
  </label>
  <label>Body (JSON) :<textarea id="body" rows="4"></textarea></label>
  <button onclick="sendRequest()">Envoyer</button>

  <h3>Statut : <span id="status">-</span></h3>
  <h3>Headers de réponse :</h3>
  <pre id="headers">-</pre>
  <h3>Corps de la réponse :</h3>
  <pre id="response">-</pre>

  <script>
    async function sendRequest() {
      const url = document.getElementById('url').value;
      const method = document.getElementById('method').value;
      const bodyText = document.getElementById('body').value;

      const options = { method, headers: {} };
      if (bodyText && method !== 'GET') {
        options.headers['Content-Type'] = 'application/json';
        options.body = bodyText;
      }

      try {
        const res = await fetch(url, options);
        document.getElementById('status').textContent = `${res.status} ${res.statusText}`;

        // Afficher les headers
        let headersStr = '';
        res.headers.forEach((val, key) => headersStr += `${key}: ${val}\n`);
        document.getElementById('headers').textContent = headersStr;

        const data = await res.text();
        document.getElementById('response').textContent = data;
      } catch (err) {
        document.getElementById('status').textContent = 'Erreur réseau';
        document.getElementById('response').textContent = err.message;
      }
    }
  </script>
</body>
</html>
```

## Exercice 2 : Questions théoriques

**1. Quelle est la différence entre `no-cache` et `no-store` ?**
- `no-cache` : le navigateur peut stocker la ressource en cache, mais doit la revalider auprès du serveur avant chaque utilisation (via ETag ou Last-Modified).
- `no-store` : la ressource n'est jamais stockée en cache, ni en mémoire ni sur disque. Utilisé pour les données sensibles (ex: pages bancaires).

**2. Pourquoi POST n'est-il pas idempotent ?**
Chaque appel POST crée une nouvelle ressource ou déclenche une nouvelle action. Appeler POST deux fois sur `/orders` crée deux commandes distinctes. À l'inverse, PUT/DELETE appliqués plusieurs fois donnent le même résultat.

**3. Que se passe-t-il si le serveur renvoie un code 301 ?**
Le navigateur (ou curl avec `-L`) redirige automatiquement et de façon permanente vers la nouvelle URL indiquée dans le header `Location`. Le navigateur mémorise cette redirection pour les futures visites.

**4. À quoi sert le header `Origin` ?**
Il indique l'origine (protocole + domaine + port) de la requête. Utilisé par le mécanisme CORS pour que le serveur vérifie si la requête cross-origin est autorisée. Le serveur répond avec `Access-Control-Allow-Origin` pour l'accepter ou la refuser.

**5. Pourquoi utiliser `HttpOnly` sur les cookies de session ?**
Le flag `HttpOnly` empêche JavaScript d'accéder au cookie via `document.cookie`. Cela protège contre les attaques XSS (Cross-Site Scripting) : même si un attaquant injecte du JS malveillant, il ne peut pas voler le cookie de session.

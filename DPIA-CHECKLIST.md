# DPIA Checklist — Fellow Travellers
## Data Protection Impact Assessment (AVG Artikel 35)

> Vul dit in VOOR je begint met bouwen. Dit is geen formaliteit — 
> dit is de juridische basis die voorkomt dat je aansprakelijk bent.

---

## 1. Verwerkingsverantwoordelijke
- [ ] Naam van de verwerkingsverantwoordelijke vastgelegd
- [ ] KvK-nummer geregistreerd
- [ ] Privacyverklaring opgesteld (zie template hieronder)
- [ ] Functionaris voor Gegevensbescherming aangesteld (verplicht bij gezondheidsdata)

---

## 2. Categorieën Verwerkte Data

| Data type | Aanwezig? | Encryptie | Rechtsgrond AVG |
|-----------|-----------|-----------|-----------------|
| Dagboek entries | Ja | AES-GCM 256 client-side | Art. 6(1)(a) — toestemming |
| HALT check-ins | Ja | AES-GCM 256 client-side | Art. 6(1)(a) — toestemming |
| Stap voortgang | Ja (anoniem) | Nee (geen inhoud) | Art. 6(1)(a) — toestemming |
| IP-adressen | Via Vercel logs | Vercel AVG-compliant | Art. 6(1)(f) — beveiliging |
| Session UUID | Ja | Nee (geen PII) | Art. 6(1)(a) — toestemming |
| AI-gesprekken | Nee (niet opgeslagen) | N.v.t. | N.v.t. |

**⚠️ ARTIKEL 9 GEZONDHEIDSDATA:**
Dagboek entries en HALT-waarden vallen mogelijk onder bijzondere 
persoonsgegevens (gezondheid). Zero-knowledge architectuur betekent dat 
WIJ de inhoud niet verwerken — de gebruiker verwerkt lokaal. 
Dit moet juridisch worden getoetst.

---

## 3. Privacy by Design Maatregelen

- [x] Zero-knowledge encryptie (server leest geen inhoud)
- [x] Local-first architectuur (app werkt zonder server)
- [x] Geen tracking pixels of analytics
- [x] Geen cookies van derden
- [x] Anonieme sessies (geen verplicht emailadres)
- [x] Dataretentie beleid: gebruiker kan alles wissen
- [x] EU-regio hosting (Vercel Amsterdam + Neon EU West)
- [ ] Privacy audit door externe partij (aanbevolen voor lancering)

---

## 4. AI-Specifieke Risico's (EU AI Act)

De AI-companion is gecategoriseerd als: **Beperkt Risico** (transparantieplicht)
Niet: High Risk (geen besluitvorming over gezondheidszorg)

Vereiste waarborgen:
- [x] Duidelijke non-therapie disclaimer bij elke sessie
- [x] Gebruiker weet altijd dat ze met AI praten
- [x] Geen geautomatiseerde beslissingen over zorg
- [x] Crisis doorverwijzing naar professionele hulp
- [x] Geen emotiedetectie als medisch systeem
- [ ] Jaarlijkse review van AI-gebruik

---

## 5. Risicobeoordeling Peer Support

| Risico | Kans | Impact | Maatregel |
|--------|------|--------|-----------|
| Crisis tijdens peer contact | Middel | Hoog | Crisis protocol + 113 |
| Grensoverschrijding peer | Laag | Hoog | Moderatiebeleid + blokkeer |
| Afhankelijkheid op peer | Middel | Middel | Cooldown timers + disclaimer |
| Data-inbreuk berichten | Laag | Hoog | E2E encryptie |
| Identiteitsopenbaring | Laag | Middel | Alias systeem |

---

## 6. Verplichte Documenten voor Lancering

- [ ] Privacyverklaring (NL + EN)
- [ ] Gebruiksvoorwaarden met expliciete non-therapie clausule
- [ ] Cookie-verklaring (minimaal — alleen functionele cookies)
- [ ] Data verwerkersovereenkomst met Vercel
- [ ] Data verwerkersovereenkomst met Neon
- [ ] Data verwerkersovereenkomst met Anthropic

---

## 7. Crisisprotocol Juridische Positie

**Fundamenteel principe:** Door zero-knowledge encryptie verwerken wij 
geen inhoud. Wij kunnen niet aansprakelijk worden gesteld voor inhoud 
die wij nooit hebben gezien.

**Wel aansprakelijk voor:**
- Adequate doorverwijzing naar professionele hulp (113)
- Geen misleidende claims over therapeutische werking
- Veilige peer-support omgeving (moderatiebeleid)

**Template disclaimer (gebruik in app en website):**
```
Fellow Travellers is een zelfhulp-reflectietool en geen medische 
of therapeutische dienst. De app vervangt geen professionele 
geestelijke gezondheidszorg. Bij crisis of suïcidale gedachten: 
bel 113 (24/7) of ga naar de Spoedeisende Hulp.
```

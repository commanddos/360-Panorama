# 360° Panorama Archive — GitHub Pages v3

## Struktura danych

Dane panoram są podzielone według roku:

```text
data/
├── years.json
├── 2026.json
├── 2025.json
└── ...
```

`years.json` jest małym manifestem, który mówi stronie, jakie pliki roczne ma załadować. Nie zawiera katalogu panoram.

Przykład:

```json
{
  "years": [2026, 2025]
}
```

Po dodaniu nowego roku, np. `2027.json`, dopisz `2027` do `data/years.json`.

## Hierarchia strony

**Rok → Kraj → Miasto / Lokalizacja → Panorama**

## Języki

Strona startuje domyślnie po polsku. Przełącznik `PL / EN` znajduje się w prawym górnym rogu. Wybrany język jest zapamiętywany w przeglądarce.

Interfejs jest dwujęzyczny. Dla tytułu i opisu panoramy można opcjonalnie używać pól `title_pl`, `title_en`, `description_pl`, `description_en`; jeśli ich nie ma, strona używa standardowych pól `title` i `description`.

## GitHub Pages

Projekt jest przygotowany jako statyczna strona GitHub Pages z workflow w `.github/workflows/pages.yml`. GitHub Pages może publikować projekt bez osobnego hostingu; dla project site adres ma postać `https://USERNAME.github.io/REPOSITORY/`.

## Dodanie panoramy

Dodaj rekord do odpowiedniego pliku, np. `data/2026.json`, a następnie wykonaj commit/push. Nie trzeba zmieniać `app.js`.

Przykład:

```json
{
  "id": "2026-sassnitz-harbour-002",
  "year": 2026,
  "country": "Germany",
  "city": "Sassnitz",
  "location": "Harbour",
  "title": "Sassnitz Harbour",
  "title_pl": "Port w Sassnitz",
  "title_en": "Sassnitz Harbour",
  "date": "2026-07-24",
  "provider": "Kuula",
  "url": "https://kuula.co/...",
  "embedUrl": "https://kuula.co/...",
  "coordinates": {"lat":54.515,"lng":13.644},
  "tags": ["harbour", "Rügen"]
}
```

## Uwaga

Nie przechowuj oryginalnych plików panoram 360° w repozytorium. Repozytorium przechowuje katalog, metadane, linki i współrzędne; media pozostają na Kuula/360Cities.

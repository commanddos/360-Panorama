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

**Rok → Kraj → Panorama**

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

## Miniatury JPG

Miniatury są przechowywane lokalnie w repozytorium — bez automatycznego pobierania z Kuula/360Cities. Struktura katalogów:

```text
thumbnails/
├── 2026/
│   ├── Sassnitz Harbour.jpg
│   ├── Königsstuhl.jpg
│   └── ...
├── 2025/
│   └── ...
└── ...
```

Nazwa pliku JPG jest taka sama jak wartość pola `title` w odpowiednim pliku JSON, z rozszerzeniem `.jpg`. Przykład: dla `"title": "Sassnitz Harbour"` plik musi być `thumbnails/2026/Sassnitz Harbour.jpg`.

Strona automatycznie buduje ścieżkę miniatury na podstawie `year` i `title`. Jeśli pliku nie ma, karta pokazuje zastępcze pole `360°`.

**Ważne:** ponieważ nazwa pliku pochodzi bezpośrednio z `title`, unikaj w `title` znaków niedozwolonych w nazwach plików Windows: `\ / : * ? " < > |`.

## Strona główna

Na stronie głównej, zamiast sekcji „Latest Panoramas”, wyświetlane są **wszystkie panoramy z ostatniego roku znajdującego się w `data/years.json`**. Są sortowane od najnowszej daty do najstarszej.

Po dodaniu nowego roku, np. `2027`, i wpisaniu go do `data/years.json`, strona automatycznie pokaże na stronie głównej wszystkie panoramy z `2027`.

## Dodawanie miniatury

1. Otwórz odpowiedni plik, np. `data/2026.json`.
2. Sprawdź dokładną wartość pola `title`.
3. Utwórz JPG o tej samej nazwie.
4. Umieść go w `thumbnails/<rok>/`.
5. Wgraj katalog `thumbnails/<rok>/` do repozytorium GitHub.

Nie trzeba zmieniać `app.js`, `years.json` ani dodawać adresu URL miniatury do JSON.
### Automatic thumbnail sizing
All JPG/JPEG files placed anywhere under `thumbnails/` are automatically normalized during GitHub Pages deployment to **285 × 362 px**. The image is scaled proportionally and center-cropped to fill the exact dimensions; it is not stretched.

The GitHub Actions workflow is compatible with both common ImageMagick command styles: ImageMagick 7 (`magick`) and ImageMagick 6 (`convert`). If ImageMagick is not available on the runner, the workflow installs it automatically and then detects the available command.


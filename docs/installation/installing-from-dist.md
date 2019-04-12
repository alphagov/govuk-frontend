# Použitie statického js/css vo vašom projekte

## Postup inštalácie

### 1. Stiahnutie súborov

Stiahnite si najnovšiu skompilovanú a minifikovanú verziu css, js a assetov:

- [CSS and JS](https://github.com/slovensko-digital/navody-frontend/tree/master/dist)
- [Assety](https://github.com/slovensko-digital/navody-frontend/tree/master/dist/assets)

### 2. Vloženie do vášho projektu

Musíte skopírovať celý obsah adresára `assets` do public root adresára vášho projektu.

Príklad použitia, za predpokladu, že ste css súbor skopírovali do adresára `stylesheets` a js súbor do adresára `javascript`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Ukážka</title>
    <!--[if !IE 8]><!-->
      <link rel="stylesheet" href="stylesheets/govuk-frontend-[latest version].min.css">
    <!--<![endif]-->
    <!--[if IE 8]>
      <link rel="stylesheet" href="stylesheets/govuk-frontend-ie8-[latest-version].min.css">
    <![endif]-->
  </head>
  <body>
    <button class="govuk-button">Toto je komponent tlačidlo</button>
    <script src="javascript/govuk-frontend-[latest version].min.js"></script>
    <script>window.GOVUKFrontend.initAll()</script>
  </body>
</html>
```

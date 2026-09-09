# SoulMatchBG Web App

Готов MVP dating app в стил swipe/match/chat.

## Дърво на проекта

```txt
SoulMatchBG_WebApp/
├─ index.html
├─ package.json
├─ server.mjs
├─ vercel.json
├─ start-localhost.bat
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ app.js
   ├─ styles.css
   └─ data/
      └─ profiles.js
```

## Стартиране на localhost

### Вариант 1 — най-лесно

Кликни два пъти върху:

```txt
start-localhost.bat
```

Ще отвори:

```txt
http://localhost:5173
```

### Вариант 2 — PowerShell

```powershell
cd SoulMatchBG_WebApp
npm start
```

После отвори:

```txt
http://localhost:5173
```

## Качване във Vercel

```powershell
cd SoulMatchBG_WebApp
npx vercel --prod
```

## Какво има вътре

- Swipe карти
- Like / Nope / Super Like
- Match popup
- Matches screen
- Demo chat
- Profile screen
- localStorage запазване
- Отделни HTML / CSS / JS файлове
- Работи локално без backend

## Следващ ъпгрейд

Истинската версия трябва да добави:

- Firebase или Supabase
- Login/Register
- Реални профили
- Качване на снимки
- Реален чат
- Филтри по град, възраст и интереси
- Админ панел и модерация

## SoulFlame identity

**SoulMatch is part of the SoulFlame ecosystem created by Dimitar Veselinov Lambov (Димитър Веселинов Ламбов).**

Official founder profile:  
https://soulflame-twins.vercel.app/founder/dimitar-veselinov-lambov/

SoulFlame Twins:  
https://soulflame-twins.vercel.app/

Identity relation: `Dimitar Veselinov Lambov → SoulFlame → SoulMatch`

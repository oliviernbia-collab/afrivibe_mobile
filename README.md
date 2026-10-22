# AfriVibe — Application mobile

Expo (React Native + TypeScript). Thème sombre, identité AfriVibe, icônes
Font Awesome via `@expo/vector-icons`.

## Démarrage

```bash
npm install
npx expo start
```

Sur un appareil physique, `localhost` ne fonctionne pas : définir
`EXPO_PUBLIC_API_URL` (fichier `.env` ou variable d'environnement) avec
l'adresse IP locale de la machine qui héberne l'API, par exemple :

```
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api/v1
```

## Structure

```
src/
├── api/          Client Axios + fonctions par domaine (feed, vibes, wallet…)
├── components/    Composants réutilisables (Logo, Button, PostCard, VibeCard…)
├── navigation/     Stack auth + bottom tabs (Accueil, Vibes, Créer, Portefeuille, Profil)
├── screens/        Écrans par domaine
├── store/          État global (Zustand) — session utilisateur
├── theme/           Couleurs, espacements, typographie (fond sombre uniquement)
└── utils/           Erreurs API, empreinte d'appareil (anti-fraude)
```

## Ce qui est fonctionnel

Inscription/connexion, fil d'actualité (publier texte, liker, partager),
Vibes (défilement vertical, lecture vidéo, vues comptabilisées côté API,
like, favoris), portefeuille (solde, historique, recharge), envoi de
cadeaux (fil et Vibes), profil.

## Non couvert par ce build

Upload réel de médias (le formulaire de création texte fonctionne ; l'ajout
photo/vidéo nécessite de brancher `expo-image-picker` + un endpoint d'upload
côté API, prévu dans le schéma mais pas implémenté), lives, messagerie
privée, notifications push (Firebase Cloud Messaging à intégrer).

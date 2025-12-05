# Configuration Backend - Leaderboard App

## ✅ Ce qui a été créé

### 1. Base de données

#### Migrations
- **teams** : Table pour les équipes
  - `name`, `code` (unique), `description`, `color`, `logo_url`
  - `is_active`, `total_score`, `rank`
  
- **scores** : Table pour les scores obtenus
  - `team_id`, `points`, `challenge_name`, `description`
  - `achieved_at`, `metadata` (JSON)
  
- **progress** : Table pour suivre la progression
  - `team_id`, `milestone`, `percentage` (0-100)
  - `notes`, `completed_at`

### 2. Modèles Eloquent

- **Team** : Gestion des équipes avec relations vers scores et progress
  - Méthode `updateTotalScore()` : Recalcule automatiquement le score total
  - Méthode `updateRank()` : Met à jour le classement de toutes les équipes
  
- **Score** : Gestion des scores
  - Hook automatique : Met à jour le score total et le rang de l'équipe après création/modification/suppression
  
- **Progress** : Suivi de la progression des équipes

### 3. Contrôleurs API

- **TeamController** : CRUD complet pour les équipes
- **LeaderboardController** : 
  - `index()` : Classement complet avec pagination
  - `top()` : Top N des équipes
  - `stats()` : Statistiques globales
- **ScoreController** : CRUD pour les scores + méthode `addPoints()` simplifiée
- **ProgressController** : CRUD pour la progression

### 4. Routes API

Toutes les routes sont préfixées par `/api` :

- `/api/teams` - Gestion des équipes
- `/api/leaderboard` - Classement en temps réel
- `/api/scores` - Gestion des scores
- `/api/progress` - Suivi de progression

### 5. Seeders

- **TeamSeeder** : Crée 5 équipes d'exemple
- **ScoreSeeder** : Génère des scores aléatoires pour chaque équipe

### 6. Configuration CORS

Configuration CORS activée pour permettre les appels depuis le frontend.

## 🚀 Installation

1. **Exécuter les migrations** :
```bash
php artisan migrate
```

2. **Remplir la base de données avec des données de test** :
```bash
php artisan db:seed
```

3. **Démarrer le serveur** :
```bash
php artisan serve
```

L'API sera disponible sur `http://localhost:8000/api/`

## 📡 Endpoints principaux

### Classement en temps réel
```
GET /api/leaderboard/top?limit=10
```
Retourne le top 10 des équipes avec leurs scores récents.

### Statistiques
```
GET /api/leaderboard/stats
```
Retourne les statistiques globales (nombre d'équipes, points totaux, moyenne, etc.)

### Ajouter des points
```
POST /api/scores/add-points
Body: {
  "team_id": 1,
  "points": 50,
  "challenge_name": "Défi Technique",
  "description": "Points obtenus pour..."
}
```

### Créer une équipe
```
POST /api/teams
Body: {
  "name": "Mon Équipe",
  "code": "TEAM001",
  "color": "#FF0000",
  "description": "Description de l'équipe"
}
```

## 🔄 Mise à jour automatique

Le système met automatiquement à jour :
- ✅ Le score total de chaque équipe quand un score est ajouté/modifié/supprimé
- ✅ Le classement (rank) de toutes les équipes après chaque modification

## 💡 Pour le frontend

### Polling pour temps réel
Pour un classement en temps réel, vous pouvez faire un polling toutes les 5 secondes :

```javascript
setInterval(async () => {
  const response = await fetch('http://localhost:8000/api/leaderboard/top?limit=10');
  const data = await response.json();
  // Mettre à jour l'interface
}, 5000);
```

### WebSockets (optionnel)
Pour une vraie mise à jour en temps réel, vous pouvez implémenter Laravel Broadcasting avec Pusher ou Laravel Echo.

## 📝 Format de réponse

Toutes les réponses suivent ce format :
```json
{
  "success": true,
  "data": {...},
  "message": "Message optionnel"
}
```

En cas d'erreur :
```json
{
  "success": false,
  "errors": {
    "field": ["Message d'erreur"]
  }
}
```

## 🎯 Prochaines étapes recommandées

1. **Frontend** : Créer l'interface utilisateur avec mise à jour automatique
2. **Accessibilité (WCAG)** : 
   - Ajouter des attributs ARIA
   - Support clavier complet
   - Contraste de couleurs approprié
   - Textes alternatifs pour les images
3. **WebSockets** : Implémenter Laravel Broadcasting pour des mises à jour push
4. **Authentification** : Ajouter un système d'authentification si nécessaire
5. **Validation** : Ajouter plus de règles de validation selon vos besoins

## 📚 Documentation complète

Voir `API_DOCUMENTATION.md` pour la documentation complète de tous les endpoints.



# Documentation API - Leaderboard App

## Base URL
Toutes les routes API sont préfixées par `/api`

## Endpoints

### Équipes (Teams)

#### GET `/api/teams`
Récupère la liste de toutes les équipes actives avec leurs scores récents.

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Les Champions",
      "code": "CHAMP001",
      "description": "Équipe déterminée à remporter la victoire",
      "color": "#FF6B6B",
      "total_score": 250,
      "rank": 1,
      "scores": [...]
    }
  ]
}
```

#### POST `/api/teams`
Crée une nouvelle équipe.

**Body:**
```json
{
  "name": "Nouvelle Équipe",
  "code": "TEAM001",
  "description": "Description de l'équipe",
  "color": "#FF0000",
  "logo_url": "https://example.com/logo.png"
}
```

#### GET `/api/teams/{id}`
Récupère les détails d'une équipe avec ses scores et progressions.

#### PUT/PATCH `/api/teams/{id}`
Met à jour une équipe.

#### DELETE `/api/teams/{id}`
Supprime une équipe.

---

### Classement (Leaderboard)

#### GET `/api/leaderboard`
Récupère le classement complet avec pagination.

**Query Parameters:**
- `limit` (optionnel, défaut: 50): Nombre d'équipes à retourner
- `offset` (optionnel, défaut: 0): Décalage pour la pagination

**Réponse:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 10,
    "limit": 50,
    "offset": 0
  }
}
```

#### GET `/api/leaderboard/top`
Récupère le top N des équipes.

**Query Parameters:**
- `limit` (optionnel, défaut: 10): Nombre d'équipes dans le top

#### GET `/api/leaderboard/stats`
Récupère les statistiques globales du classement.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "total_teams": 10,
    "total_scores": 45,
    "total_points": 1250,
    "average_score": 125.0,
    "top_team": {...}
  }
}
```

---

### Scores

#### GET `/api/scores`
Récupère la liste des scores.

**Query Parameters:**
- `team_id` (optionnel): Filtrer par équipe
- `challenge_name` (optionnel): Filtrer par nom de challenge
- `per_page` (optionnel, défaut: 20): Nombre de résultats par page

#### POST `/api/scores`
Crée un nouveau score.

**Body:**
```json
{
  "team_id": 1,
  "points": 50,
  "challenge_name": "Défi Technique",
  "description": "Score obtenu pour...",
  "achieved_at": "2024-12-04 23:00:00",
  "metadata": {
    "difficulty": "hard",
    "time_taken": 45
  }
}
```

#### POST `/api/scores/add-points`
Méthode simplifiée pour ajouter des points à une équipe.

**Body:**
```json
{
  "team_id": 1,
  "points": 25,
  "challenge_name": "Défi Bonus",
  "description": "Points bonus"
}
```

#### GET `/api/scores/{id}`
Récupère un score spécifique.

#### PUT/PATCH `/api/scores/{id}`
Met à jour un score.

#### DELETE `/api/scores/{id}`
Supprime un score.

---

### Progression (Progress)

#### GET `/api/progress`
Récupère la liste des progressions.

**Query Parameters:**
- `team_id` (optionnel): Filtrer par équipe

#### POST `/api/progress`
Crée une nouvelle entrée de progression.

**Body:**
```json
{
  "team_id": 1,
  "milestone": "Étape 1",
  "percentage": 50,
  "notes": "Progression à mi-parcours",
  "completed_at": "2024-12-04 23:00:00"
}
```

#### GET `/api/progress/{id}`
Récupère une progression spécifique.

#### PUT/PATCH `/api/progress/{id}`
Met à jour une progression.

#### DELETE `/api/progress/{id}`
Supprime une progression.

---

## Fonctionnalités

### Mise à jour automatique du classement
Le classement est automatiquement mis à jour lorsque :
- Un score est créé, modifié ou supprimé
- Une équipe est créée, modifiée ou supprimée

### Calcul automatique des scores
Le score total d'une équipe est automatiquement recalculé à chaque modification de score.

### Format de réponse standard
Toutes les réponses suivent ce format :
```json
{
  "success": true|false,
  "data": {...},
  "message": "Message optionnel",
  "errors": {...} // En cas d'erreur
}
```

## Installation et utilisation

1. Exécuter les migrations :
```bash
php artisan migrate
```

2. Remplir la base de données avec des données de test :
```bash
php artisan db:seed
```

3. Démarrer le serveur :
```bash
php artisan serve
```

Les endpoints API seront disponibles sur `http://localhost:8000/api/...`

## Notes pour le frontend

Pour un classement en temps réel, vous pouvez :
1. Utiliser un polling régulier (ex: toutes les 5 secondes) sur `/api/leaderboard/top`
2. Implémenter Laravel Broadcasting avec WebSockets pour des mises à jour en temps réel
3. Utiliser Server-Sent Events (SSE) pour des mises à jour push



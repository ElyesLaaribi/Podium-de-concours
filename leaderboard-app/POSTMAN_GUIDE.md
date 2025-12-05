# Guide de test API avec Postman

## Configuration de base

### Base URL
```
http://localhost:8000/api
```

Assurez-vous que votre serveur Laravel est démarré :
```bash
php artisan serve
```

---

## 1. Équipes (Teams)

### GET - Liste des équipes
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/teams`

**Headers:**
```
Accept: application/json
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Les Champions",
      "code": "CHAMP001",
      "total_score": 250,
      "rank": 1
    }
  ]
}
```

---

### POST - Créer une équipe
**Méthode:** `POST`  
**URL:** `http://localhost:8000/api/teams`

**Headers:**
```
Accept: application/json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Nouvelle Équipe",
  "code": "TEAM999",
  "description": "Description de l'équipe",
  "color": "#FF5733",
  "logo_url": "https://example.com/logo.png"
}
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Nouvelle Équipe",
    "code": "TEAM999",
    "total_score": 0,
    "rank": 6
  },
  "message": "Équipe créée avec succès"
}
```

---

### GET - Détails d'une équipe
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/teams/1`

**Réponse:** Retourne l'équipe avec ses scores et progressions

---

### PUT - Mettre à jour une équipe
**Méthode:** `PUT` ou `PATCH`  
**URL:** `http://localhost:8000/api/teams/1`

**Headers:**
```
Accept: application/json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Équipe Modifiée",
  "color": "#00FF00"
}
```

---

### DELETE - Supprimer une équipe
**Méthode:** `DELETE`  
**URL:** `http://localhost:8000/api/teams/1`

---

## 2. Classement (Leaderboard)

### GET - Classement complet
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/leaderboard`

**Query Parameters (optionnels):**
- `limit`: Nombre d'équipes (défaut: 50)
- `offset`: Décalage pour pagination (défaut: 0)

**Exemple avec paramètres:**
```
http://localhost:8000/api/leaderboard?limit=10&offset=0
```

**Réponse:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 10,
    "limit": 10,
    "offset": 0
  }
}
```

---

### GET - Top N des équipes
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/leaderboard/top`

**Query Parameters:**
- `limit`: Nombre d'équipes dans le top (défaut: 10)

**Exemple:**
```
http://localhost:8000/api/leaderboard/top?limit=5
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Les Champions",
      "rank": 1,
      "total_score": 350,
      "scores": [...]
    }
  ]
}
```

---

### GET - Statistiques globales
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/leaderboard/stats`

**Réponse:**
```json
{
  "success": true,
  "data": {
    "total_teams": 10,
    "total_scores": 45,
    "total_points": 1250,
    "average_score": 125.0,
    "top_team": {
      "id": 1,
      "name": "Les Champions",
      "total_score": 350
    }
  }
}
```

---

## 3. Scores

### GET - Liste des scores
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/scores`

**Query Parameters (optionnels):**
- `team_id`: Filtrer par équipe
- `challenge_name`: Filtrer par challenge
- `per_page`: Résultats par page (défaut: 20)

**Exemples:**
```
http://localhost:8000/api/scores?team_id=1
http://localhost:8000/api/scores?challenge_name=Défi%20Technique
http://localhost:8000/api/scores?per_page=10
```

---

### POST - Créer un score
**Méthode:** `POST`  
**URL:** `http://localhost:8000/api/scores`

**Headers:**
```
Accept: application/json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "team_id": 1,
  "points": 50,
  "challenge_name": "Défi Technique",
  "description": "Score obtenu pour avoir complété le défi",
  "achieved_at": "2024-12-04 23:00:00",
  "metadata": {
    "difficulty": "hard",
    "time_taken": 45
  }
}
```

**Note:** `achieved_at` est optionnel (utilise la date actuelle si non fourni)

---

### POST - Ajouter des points (méthode simplifiée)
**Méthode:** `POST`  
**URL:** `http://localhost:8000/api/scores/add-points`

**Headers:**
```
Accept: application/json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "team_id": 1,
  "points": 25,
  "challenge_name": "Défi Bonus",
  "description": "Points bonus pour participation"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "team_id": 1,
    "points": 25,
    "challenge_name": "Défi Bonus",
    "achieved_at": "2024-12-04 23:15:00"
  },
  "message": "Points ajoutés avec succès"
}
```

**⚠️ Important:** Après cette opération, le classement est automatiquement mis à jour !

---

### GET - Détails d'un score
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/scores/1`

---

### PUT - Mettre à jour un score
**Méthode:** `PUT` ou `PATCH`  
**URL:** `http://localhost:8000/api/scores/1`

**Body (raw JSON):**
```json
{
  "points": 75,
  "description": "Score modifié"
}
```

---

### DELETE - Supprimer un score
**Méthode:** `DELETE`  
**URL:** `http://localhost:8000/api/scores/1`

---

## 4. Progression (Progress)

### GET - Liste des progressions
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/progress`

**Query Parameters:**
- `team_id`: Filtrer par équipe

**Exemple:**
```
http://localhost:8000/api/progress?team_id=1
```

---

### POST - Créer une progression
**Méthode:** `POST`  
**URL:** `http://localhost:8000/api/progress`

**Headers:**
```
Accept: application/json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "team_id": 1,
  "milestone": "Étape 1 - Initialisation",
  "percentage": 50,
  "notes": "Progression à mi-parcours du défi",
  "completed_at": "2024-12-04 23:00:00"
}
```

**Note:** Si `percentage` = 100 et `completed_at` n'est pas fourni, il sera automatiquement défini à maintenant.

---

### GET - Détails d'une progression
**Méthode:** `GET`  
**URL:** `http://localhost:8000/api/progress/1`

---

### PUT - Mettre à jour une progression
**Méthode:** `PUT` ou `PATCH`  
**URL:** `http://localhost:8000/api/progress/1`

**Body (raw JSON):**
```json
{
  "percentage": 100,
  "notes": "Défi complété !"
}
```

---

### DELETE - Supprimer une progression
**Méthode:** `DELETE`  
**URL:** `http://localhost:8000/api/progress/1`

---

## Scénarios de test recommandés

### Scénario 1 : Créer une équipe et ajouter des scores

1. **POST** `/api/teams` - Créer une nouvelle équipe
2. **GET** `/api/teams/{id}` - Vérifier que l'équipe est créée
3. **POST** `/api/scores/add-points` - Ajouter des points à l'équipe
4. **GET** `/api/leaderboard/top` - Vérifier que l'équipe apparaît dans le classement
5. **GET** `/api/leaderboard/stats` - Vérifier les statistiques

### Scénario 2 : Tester le classement en temps réel

1. **GET** `/api/leaderboard/top?limit=5` - Voir le top 5 initial
2. **POST** `/api/scores/add-points` - Ajouter des points à une équipe
3. **GET** `/api/leaderboard/top?limit=5` - Vérifier que le classement a changé
4. Répéter plusieurs fois pour voir les changements de rang

### Scénario 3 : Gestion complète d'une équipe

1. **POST** `/api/teams` - Créer l'équipe
2. **POST** `/api/progress` - Ajouter une progression
3. **POST** `/api/scores` - Ajouter plusieurs scores
4. **GET** `/api/teams/{id}` - Voir tous les détails
5. **PUT** `/api/teams/{id}` - Modifier l'équipe
6. **GET** `/api/leaderboard` - Voir le classement final

---

## Configuration Postman

### Créer une collection Postman

1. Ouvrez Postman
2. Cliquez sur "New" → "Collection"
3. Nommez-la "Leaderboard API"
4. Créez des dossiers :
   - Teams
   - Leaderboard
   - Scores
   - Progress

### Variables d'environnement (recommandé)

Créez un environnement Postman avec ces variables :

**Nom de l'environnement:** `Local Development`

**Variables:**
- `base_url`: `http://localhost:8000`
- `api_url`: `{{base_url}}/api`

Ensuite, utilisez `{{api_url}}/teams` au lieu de l'URL complète.

### Headers par défaut

Pour éviter de les ajouter à chaque requête, créez un pré-requis dans votre collection :

1. Allez dans l'onglet "Pre-request Script" de votre collection
2. Ajoutez :
```javascript
pm.request.headers.add({
    key: 'Accept',
    value: 'application/json'
});
```

---

## Gestion des erreurs

### Erreur 422 - Validation
Si vous recevez une erreur 422, vérifiez le body de la réponse :

```json
{
  "success": false,
  "errors": {
    "code": ["The code has already been taken."],
    "points": ["The points field must be an integer."]
  }
}
```

### Erreur 404 - Not Found
Vérifiez que :
- L'ID existe dans la base de données
- L'URL est correcte
- Le serveur Laravel est démarré

### Erreur 500 - Server Error
- Vérifiez les logs Laravel : `storage/logs/laravel.log`
- Assurez-vous que les migrations sont exécutées : `php artisan migrate`

---

## Tests automatisés dans Postman

Vous pouvez ajouter des tests dans l'onglet "Tests" de chaque requête :

```javascript
// Vérifier le statut de la réponse
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier la structure de la réponse
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

// Vérifier les données
pm.test("Response contains data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

---

## Astuces

1. **Sauvegarder les IDs** : Après avoir créé une ressource, sauvegardez l'ID dans une variable Postman pour les requêtes suivantes
2. **Utiliser les variables** : Créez des variables d'environnement pour `team_id`, `score_id`, etc.
3. **Tests en chaîne** : Utilisez les scripts de test pour automatiser des scénarios complets
4. **Collection Runner** : Utilisez le Collection Runner pour exécuter tous les tests automatiquement

---

## Exemple de script de test complet

Dans l'onglet "Tests" d'une requête POST pour créer une équipe :

```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Team created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('id');
    
    // Sauvegarder l'ID pour les prochaines requêtes
    pm.environment.set("team_id", jsonData.data.id);
});
```

Ensuite, dans une autre requête, utilisez `{{team_id}}` dans l'URL !



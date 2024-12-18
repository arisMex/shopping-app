### **Description du projet : Application d'achat d'objets avec Stripe**  

Cette application mobile permet d'acheter des articles en tout genre en utilisant la plateforme de paiement Stripe. Elle offre une expérience fluide pour scanner, ajouter manuellement et payer des articles, tout en gérant un panier interactif. Voici les principales fonctionnalités :

- **Scan de codes-barres** : Permet de scanner des articles pour les ajouter au panier. Si l'appareil photo n'est pas disponible, les articles peuvent être ajoutés manuellement. Une vérification via une API est effectuée pour garantir que l'article existe.
- **Panier** : Affiche les articles scannés avec la possibilité de retirer des articles, de modifier les quantités, et d'afficher un indicateur de nombre pour les articles dupliqués. Les utilisateurs peuvent également sauvegarder leur panier pour de futurs achats.
- **Paiement sécurisé via Stripe** : Une fois les articles sélectionnés, les utilisateurs peuvent régler leurs achats directement via Stripe.
- **Historique des achats** : Suivi des articles déjà payés.
- **Thème jour/nuit** : L'application prend en charge un mode sombre et un mode clair pour s'adapter aux préférences de l'utilisateur.

### **Technologies utilisées :**
- **Backend** : API développée avec FastAPI pour l'intégration de Stripe.
- **Frontend** : Application mobile développée avec React Native, utilisant Expo pour la gestion de l'application.
- **Persistence des données** : Utilisation de **Expo.SQLite** pour stocker les données localement sur le client.

Ce projet a été conçu pour offrir une expérience utilisateur moderne, avec une interface intuitive et un paiement rapide grâce à Stripe, tout en permettant une gestion optimale des articles via le scan de codes-barres et un panier interactif.

N'hésitez pas à explorer le code et à me contacter pour toute question !

## Technologies requises

Vous allez avoir besoin des technologies suivantes :
- [Android Studio](https://developer.android.com/studio "Android Studio")
- [Docker](https://www.docker.com "Docker") Desktop ou CLI
- [NodeJS LTS](https://nodejs.org/fr "NodeJS")
- Un compte [Stripe](https://stripe.com/fr "Stripe")


Le projet est composé des choses suivantes :
- [Server](./server/README.md) : Une API développée avec FastAPI afin d'utiliser Stripe. Vous pouvez implémenter la vôtre.
- [Client](./client/README.md) : Une application React Native de départ, c'est ici que vous allez développer l'application.

Il est imposé d'utiliser `Expo.SQLite` pour la persistance des données au niveau du client.

***Il est important de configurer le serveur avant le client.***

## Informations

Le projet a été créé à l'aide de la commande suivante :

```shell
npx create-expo-app -t expo-template-blank-typescript
```

Il est possible de lancer l'application dans un émulateur Android et/ou iOS :

```shell
npx expo start #npx expo run:android  # npx expo run:ios
```

### **Remerciements et Collaborations**

Une grande partie du concept et des fonctionnalités de ce projet provient de **Maxence Lambard**, notre professeur, qui nous a donné ce projet de développement. Son expertise et ses directives ont été déterminantes dans la définition des bases du projet et des objectifs à atteindre. Il a joué un rôle clé en fournissant les éléments essentiels pour démarrer et orienter le développement de l'application.

Le projet a ensuite été construit en collaboration avec **Rabie TOABA**. Rabie a été un partenaire incontournable, apportant des idées innovantes et une forte expertise technique. Ensemble, nous avons développé les fonctionnalités principales de l'application, optimisé l'expérience utilisateur et assuré une intégration fluide des technologies.

Un grand merci à **Maxence Lambard** pour la conception du projet et à **Rabie TOABA** pour son investissement, sa créativité et son implication tout au long de ce projet. Leur collaboration et leur soutien ont été essentiels à la réussite de cette application.



# Crate.GG: MarketPlace Simulation WebApp Project

<img src="/docs/img/logo.png" alt="Crate.GG Logo" width="100%" />

<p>
<b>Crate.GG</b> is a web-based project designed to simulate a marketplace for virtual collectible crates. The project allows users to collect, trade, and open crates in a fully functional ecosystem. It includes features for user account management, marketplace interactions, and crate inventory systems. 
</p>
<p>
The project draws significant inspiration from the Steam Market, which features video game items that can be bought, sold, or traded. This website allows users to create their own storage units, where they can hold and manage all their collected crates.
</p>
<p>
Crates are categorized by rarity tiers: Common, Rare, and Legendary. Each crate also features unique patterns that affect its appearance. Some patterns are more frequently encountered, while others are rare and include a distinctive and special design.
The combination of rarity tiers and unique patterns encourages users to build and display the most impressive and diverse collections.
</p>

## Links to sections
- [Functional Features](#functional-features)
- [Technologies Used](#technologies-used)
- [How it Works](#how-it-works)
- [Getting Started](#getting-started)

## Functional Features
Crate.GG provides the following core functionalities:
- **Marketplace:** A dedicated page displaying all crates currently listed for trade or sale by users.
- **User Storage:** The ability to browse other users' inventories, showcasing their collection of crates.
- **User Account Management:** Full support for account creation and authentication.
- **Crate Assignment:** Backend functionality to assign crates to users dynamically, supporting actions like purchasing and receiving crates.
- **Crate Opening System:** A feature to simulate the opening of crates, including random crate generation with rarity tiers.
- **Admin Privileges:** Admins have the ability to remove crates from the market without the consent of the users who own them.
- **Trade Market History:** A detailed list showcasing all transactions associated with the user, including both purchases and sales.

<img src="/docs/img/crategg_2.png" alt="Crate.GG Logo" width="100%" />

## Technologies Used
The project is built with a modern tech stack for both the frontend and backend:
- **Frontend:** 
  - React with TypeScript for a clean, type-safe, and dynamic user interface.
  - **Axios** for handling API requests between the frontend and backend.
- **Backend:**
  - **SQLite3** as the database, paired with **Sequelize** as the ORM for data modeling and queries.
  - Authentication middleware to verify users during operations like crate purchases and account access (JWT).
  - RESTful API endpoints for all core functionalities, such as crate management, user data, and market operations.

## How It Works
1. **Marketplace Interaction:** Users can view and interact with all listed crates in the marketplace, either purchasing or inspecting them.
2. **Inventory Management:** Users can see their storage of crates, open them, or sell them on the market.
3. **Crate Opening Simulation:** Each crate can be opened to reveal sets of new crates to either open or sell on the market.
4. **Admin Tools:** Additional backend tools allow for controlled assignment of crates to users for events or promotions. The system also includes an admin role, which allows for market crate removal, regardless if the crates are owned by the user or not.

## Getting Started
Clone the repository, and set up the development environment:
1. Install the dependencies:
npm install
2. There might be a need to reinstall some of the plugins. Here is a one line command to install the missing plugins:
```
npm install sqlite3 sequelize axios express jsonwebtoken bcrypt dotenv cors body-parser
```
3. Running the website requires 2 active cmd consoles that will be running the frontend and the backend logic of the app. Here are the commands to run in the main project folder:
- **Frontend**
```
cd web-app
npm run dev
```
- **Backend**
```
cd server
node index.js
```
4. The project should be all set up and ready :D

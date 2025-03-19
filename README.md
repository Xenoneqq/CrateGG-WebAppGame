# CRATE.GG - MarketPlace WebApp
A web app where users can buy and sell items in a community-driven marketplace.

## About
CRATE.GG is a marketplace for trading crates (rare collectible items). The goal is to collect as many rare crates as possible through trading and a risk-based unboxing system. The app is designed to simulate an environment similar to the Steam Marketplace.

**👤 User Storage**

Each player, upon logging in, receives a dedicated storage page that can be viewed by other users. The storage page contains all the crates collected by the user and indicates whether any crate is currently listed on the marketplace.

**💸 Marketplace**

A community-driven marketplace where users can trade their crates for in-game currency. This currency can then be used to purchase better or rarer crates.

**📦 Crates**

Crates are collectible items that can be opened, with a chance to obtain better crates at the risk of losing the one being opened. Each crate is defined by the following attributes:

- **Name** – Used to differentiate one crate from another.
- **Pattern** – Each crate is assigned a random pattern number, which determines its design. Some patterns are exceptionally rare.
- **Rarity** – Defines how difficult the crate is to obtain. The rarer the crate, the harder it is to acquire through openings.

---

## How to Setup

### Prerequisites
The project uses **Node.js** for both the frontend and backend. You must install Node.js before launching the app. Download it [here](https://nodejs.org/en).

### Steps to Run the App

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Xenoneqq/CrateGG-WebAppGame
   ```

2. **Install Dependencies**
   Inside both the `server` and `web-app` directories, install all required dependencies:
   ```sh
   npm install
   ```

3. **Run the Server**
   The backend handles transactions such as opening crates and creating users. To start the server:
   ```sh
   cd server
   node index.js
   ```

4. **Launch the Frontend**
   In a new terminal, navigate to the `web-app` directory and start the development server:
   ```sh
   cd web-app
   npm run dev
   ```

5. **Access the Website**
   The terminal will display the website URL. Open it in your browser to see the **CRATE.GG** welcome page.


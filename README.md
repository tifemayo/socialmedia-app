UNIFEED - Unified Social Media Experience

UNIFEED is a web-based platform that integrate content from multiple social media platforms (currently Instagram and TikTok) into a single, unified feed. Designed with productivity, usability, and user well-being in mind, UNIFEED simplifies content consumption while reducing cognitive load and context switching.

## Features

- Cross-Platform Unified Feed  
  Combines Instagram and TikTok posts into one seamless view.

- AI-Powered Search  
  Unified search functionality with content summarization and categorization.

- Platform Filter  
  View content from selected platforms only.

- Usage Analytics  
  Track time spent on the app to promote healthier digital habits.

- Mock Data Implementation  
  Simulates API responses for demo and testing purposes.

- Future-Ready Service Layer  
  Extensible design to integrate real APIs (e.g., Instagram Graph API, TikTok API).

## Architecture

The application follows a clean 4-layer architecture:

1. **Presentation Layer** – Built with React.js (Atomic Design), includes components like `UnifiedFeed`, `PostCard`, `Header`.
2. **State Management Layer** – Uses React Query and Context API for fetching, caching, and managing UI state.
3. **Service Layer** – Abstracts platform-specific logic into services (`InstagramService`, `TikTokService`) via a shared interface.
4. **Data Layer** – Currently uses mocked data; structured to support real API data in the future.

![System Architecture](./assets/unifeed_system_architecture_diagram.png)

## Tech Stack

- Frontend: React.js, SCSS
- State Management: React Query, Context API
- Data Layer: MySQL (future), LocalStorage, Mock JSON
- API Integration: Service layer abstraction


## How to Run Locally

1. Clone the repo:

```bash
git clone https://github.com/your-username/unifeed.git
cd unifeed

npm install

npm start

Created with by Tife Olusina


# EverLife: The Last Cycle - A Text-Based Adventure Game

EverLife: The Last Cycle is an immersive text-based adventure game where players embark on a mission to save Earth from environmental destruction. This project combines a React-based frontend with an AWS-powered backend to deliver a unique gaming experience.

You can try out the game here:

`https://dkmutmakfs1gj.cloudfront.net/`

The game puts players in the role of a chosen guardian with elemental powers, tasked with combating the mysterious Blight Corporation and restoring balance to a world on the brink of collapse. Through a series of choices and battles, players navigate a rich narrative while managing their character's health, energy, and the overall state of the environment.

## Repository Structure

```
.
├── cdk                 # AWS CDK infrastructure code
│   ├── bin             # CDK app entry point
│   ├── lambda          # Lambda function source code
│   ├── lib             # CDK stack definition and game state
│   └── test            # CDK tests
├── scripts             # Utility scripts
├── src                 # React application source code
│   ├── components      # React components
│   ├── game            # Game logic and state management
│   ├── services        # API services
│   └── styles          # CSS stylesheets
└── public              # Static assets
```

Key Files:
- `cdk/bin/cdk.ts`: Entry point for the CDK application
- `cdk/lib/cdk-stack.ts`: Main CDK stack definition
- `src/App.tsx`: Main React component
- `src/components/GameContainer.tsx`: Core game logic and UI
- `vite.config.ts`: Vite configuration for the frontend build

## Usage Instructions

### Prerequisites
- Node.js (v14 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed globally (`npm install -g aws-cdk`)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd everlife-last-cycle
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Game

1. Start the development server:
   ```
   npm run dev
   ```

2. Open a web browser and navigate to `http://localhost:5173` (or the URL provided in the console).

3. Sign up or log in to start playing the game.

### Gameplay

- Follow the on-screen prompts to make decisions and progress through the story.
- Use the action buttons to interact with the game world.
- In combat mode, select your elemental powers to defeat enemies.
- Monitor your health, energy, and the Earth's health status throughout the game.

## Data Flow

1. User interacts with the React frontend (src/components/GameContainer.tsx).
2. Frontend sends API requests to AWS API Gateway.
3. API Gateway routes requests to appropriate Lambda functions.
4. Lambda functions interact with DynamoDB for game state and user data.
5. Lambda functions may also fetch data from SSM Parameter Store for game content.
6. Responses flow back through API Gateway to the frontend.
7. React components update to reflect the new game state.

```
[User] <-> [React Frontend] <-> [API Gateway] <-> [Lambda Functions] <-> [DynamoDB/SSM]
```

## Deployment

1. Ensure you have the AWS CLI configured with the correct credentials.

2. Build the frontend:
   ```
   npm run build
   ```

3. Deploy the backend infrastructure and frontend assets:
   ```
   npm run deploy:backend
   ```

4. The CDK stack will automatically deploy the frontend to an S3 bucket and set up CloudFront distribution.

5. After deployment, the CloudFront URL will be displayed in the console. Use this URL to access the deployed game.

## Infrastructure

The project uses AWS CDK to define and deploy the following resources:

- S3:
  - `everlife-bucket`: Hosts the frontend static files
- CloudFront:
  - Distribution for serving the website securely
- DynamoDB:
  - `gamestate`: Stores game state data
  - `savedstate`: Stores user-specific saved game data
- Cognito:
  - User Pool: Manages user authentication
- Lambda:
  - `LoginFunction`: Handles user authentication
  - `RefreshTokenFunction`: Refreshes authentication tokens
  - `StatesFunction`: Retrieves game state data
  - `GetStateFunction`: Retrieves user-specific saved game state
  - `SaveStateFunction`: Saves user game progress
- API Gateway:
  - RESTful API for frontend-backend communication
- SSM Parameter Store:
  - Stores game data (enemies, powers)
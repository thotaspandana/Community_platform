# Social Media Platform

A Facebook-like social media platform built with React, TypeScript, and modern web technologies. This application includes features such as communities, posts, comments, stories, and more.

## Features

- **User Profile**: Display user profile as "Sam" with profile picture
- **Posts Feed**: View, create, like, comment on, and share posts
- **Communities**: Create and join communities with customizable privacy settings
- **Stories**: View and create stories
- **Real-time Updates**: Posts and comments update in real-time
- **Persistent State**: Application remembers your state even after page refresh

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd FB
   ```

2. Install dependencies:
   ```bash
   npm install
   npm run build
   ```


3. Set up environment (optional):
   - If you need to connect to a custom API endpoint, update the `API_BASE_URL` in `src/services/config.ts`

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm start
```

This will start the development server and open the application in your default browser at [http://localhost:3000](http://localhost:3000).

The page will automatically reload when you make changes to the code. You will also see any lint errors in the console.

### API Server

The application requires a backend API server to be running for full functionality:

```bash
# Navigate to your API server directory (if separate)
cd ../api-server

# Start the API server
npm start
```

By default, the application expects the API server to be running at [http://localhost:8090](http://localhost:8090).

### Production Build

To create a production build:

```bash
npm run build
```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include content hashes for cache busting.

## Deployment

To deploy the production build, you can serve it with a static server:

```bash
npm install -g serve
serve -s build
```

This will serve your app at [http://localhost:5000](http://localhost:5000).

## Project Structure

```
src/
├── components/        # React components
│   ├── Communities/   # Community components
│   ├── CreatePost/    # Post creation components
│   ├── Header/        # Application header
│   ├── PostList/      # Posts and comments
│   └── ...
├── services/          # API services and data fetching
├── styles/            # CSS styles
└── ...
```

## Technologies Used

- React
- TypeScript
- CSS3
- Ant Design
- Material-UI Icons
- Axios for API calls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

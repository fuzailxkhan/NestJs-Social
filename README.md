# <h1 align="center">Social App in NestJs</h1>

## <h2>Overview</h2>

This project is a RESTful API built with **NestJS** that implements a **Post and Follow System**. It features **JWT Authentication** for secure access, allowing users to create posts, follow/unfollow other users, and comment on posts from users they follow. The application leverages PostgreSQL for data persistence and TypeORM as the ORM.

The system supports role-based access control, allowing for efficient CRUD operations, secure user authentication, and dynamic news feeds for users based on their follow relationships.

## <h2>Features</h2>

- <strong>User Authentication</strong>: JWT-based authentication for secure user login and access to protected endpoints.
- <strong>Post Management</strong>: Users can create, update, delete, and retrieve posts.
- <strong>Follow System</strong>: Users can follow and unfollow others. The system manages the followers and following relationships.
- <strong>Comments</strong>: Users can add comments to posts and view comments from others.
- <strong>News Feed</strong>: Users can view a personalized news feed consisting of posts from users they follow.

## <h2>Tech Stack</h2>

- <strong>NestJS</strong>: A progressive Node.js framework for building efficient, reliable, and scalable applications.
- <strong>PostgreSQL</strong>: Relational database used to store user data, posts, comments, and follow relationships.
- <strong>TypeORM</strong>: An ORM for TypeScript and JavaScript, used to interact with PostgreSQL.
- <strong>JWT (JSON Web Token)</strong>: A compact, URL-safe means of representing claims to securely transmit information between parties.
- <strong>Swagger</strong>: API documentation tool integrated with NestJS for easy exploration of API endpoints.

## <h2>Setup and Installation</h2>

Follow the steps below to get the application up and running:

### <h3>Prerequisites</h3>

Before running the project, ensure that you have the following installed:

- **Node.js** (v14.x or later)
- **PostgreSQL** (or Docker to run PostgreSQL container)
- **npm** or **yarn** package manager

### <h3>Clone the Repository</h3>

```bash
git clone https://github.com/fuzailxkhan/NestJs-Social.git
cd NestJs-Social
```

<h3>Install Dependencies</h3>
Install all required dependencies using npm :

```bash
npm install
```

<h3>Setup PostgreSQL Database</h3>
Local PostgreSQL:

Ensure that you have PostgreSQL running locally.
Create a new database (e.g., nestjs-posts).
Database Configuration:

In your src/config/database.config.ts, update the database connection settings to match your local or remote PostgreSQL instance.
Example configuration:

```bash
export const databaseConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'yourpassword',
  database: 'nestjs-posts',
  entities: [PostEntity, User, Comment],  // Include all entities here
  synchronize: true,
};
```

<h3>Environment Variables</h3>
Create a .env file in the root directory and define the following environment variables:

```bash
JWT_SECRET=your_jwt_secret_key
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=nestjs-posts
```

<h3>Run the Application</h3>
Start the NestJS server:

```bash
npm run start

```


The API will now be accessible at http://localhost:3000.

<h3>Swagger UI</h3>
Once the application is running, you can view the Swagger documentation for the API by navigating to:

```bash
  http://localhost:3000/api
```

This interface provides an easy-to-use way to interact with the API, test endpoints, and see the detailed descriptions of each route.

<h2>API Endpoints</h2>
The following are the main endpoints provided by the application:

<h3>Authentication</h3>
POST /auth/login: Login and get a JWT token.
Request body: { "username": "user1", "password": "password123" }

POST /auth/register: Register a new user.

<h3>User Profile</h3>
GET /profile: Get the authenticated user's profile.
<h3>Posts</h3>
POST /posts: Create a new post.
GET /posts: Retrieve all posts with pagination.
GET /posts/:id: Retrieve a specific post by ID.
PUT /posts/:id: Update a post.
DELETE /posts/:id: Delete a post.
<h3>Follow System</h3>
POST /follow/:followedId: Follow a user by their ID.
DELETE /follow/:followedId: Unfollow a user by their ID.
GET /follow/following: Get a list of users the authenticated user is following.
GET /follow/followers: Get a list of users following the authenticated user.
<h3>Comments</h3>
POST /posts/:id/comments: Add a comment to a post.
GET /posts/:id/comments: Get all comments on a post.
<h3>News Feed</h3>
GET /posts/newsFeed: Get the news feed for the authenticated user (posts from followed users).
<h2>Database Schema</h2>
The following entities are used in the database:

User: Stores user data (ID, username, password hash).
Post: Stores posts created by users (ID, content, user ID).
Comment: Stores comments on posts (ID, content, post ID, user ID).
Follow: Stores follow relationships between users (follower ID, followed ID).
<h2>Authentication</h2>
JWT authentication is used to protect endpoints. After logging in, you will receive a JWT token, which you need to include in the Authorization header as a Bearer token when accessing protected endpoints.

Example header:

```bash
Authorization: Bearer your_jwt_token
```

<h2>Testing</h2>
To test the endpoints, you can use Postman or Swagger UI to send requests with the JWT token included in the Authorization header.

<h2>Contributing</h2>
Feel free to fork the repository, make improvements, and submit pull requests. If you encounter any bugs or have suggestions for enhancements, please open an issue.

<h2>License</h2>
This project is licensed under the MIT License - see the LICENSE file for details.

Thank you for using the Post and Follow System! If you have any questions or need further assistance, feel free to reach out.


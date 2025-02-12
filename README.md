# Quizlytics

Quizlytics is a full-stack quiz application that enables users to create AI-generated quizzes, attempt quizzes, track their analytics, and manage their accounts. The application consists of two separate components:

#### Frontend:

A Nextjs-based web application that provides an intuitive UI for users.

#### Backend:

A Node.js and Express-based API that handles data storage and processing by using TypeScript and Prisma for mongodb.

## Features

#### 🌟 Frontend Features

- Authentication – Secure sign-up and sign-in functionality.
- User Dashboard – Manage your quiz attempts and progress.
- AI-Powered Quiz Creation – Generate quizzes automatically using AI.
- List Available Quizzes – Browse and select quizzes to attempt.
- Attempt Quizzes – Take quizzes with different question types.
- Quiz Analytics – View detailed insights after completing a quiz.

#### 🛠 Backend Features

- RESTful API – Provides endpoints for managing quizzes, user authentication, and analytics.
- Quiz Management – APIs for creating, updating, and deleting quizzes.
- User Authentication – Secure login and signup with JWT-based authentication.
- Quiz Attempt Tracking – Store and process quiz results.
- Performance Analytics – Generate and serve analytics for user's quiz performance.

## Future Scope

As Quizlytics continues to evolve, its future lies in integrating advanced analytics, AI-driven insights, and personalized learning experiences to make quizzes more engaging and insightful.

#### 1. AI-Powered Personalized Learning

- 🔹 `Adaptive Quiz Generation` – AI will tailor quizzes based on a user’s performance, focusing on weak areas to improve learning.
- 🔹 `Smart Question Recommendations` – AI will suggest relevant quiz topics based on past attempts and user interests.
- 🔹 `Difficulty Level Adjustment` – Dynamic difficulty scaling will adjust questions in real time based on responses.

#### 2. Advanced Analytics & Insights

- 📊 `Deep Performance Analysis` – AI-driven insights will analyze user trends, accuracy, and improvement areas over time.
- 📌 `Predictive Performance Modeling` – Machine learning models will forecast quiz outcomes and suggest study areas.
- 📈 `Benchmarking & Leaderboards` – Compare performance with peers or industry standards using AI-powered benchmarks.

#### 3. AI-Generated Questions & Explanations

- 📝 `AI-Generated Quizzes` – Automatically create quizzes using AI based on uploaded documents, articles, or study materials.
- 💡 `Instant Answer Explanations` – AI will provide explanations for wrong answers, helping users understand concepts better.
- 🤖 `Chatbot for Quiz Assistance` – An AI tutor will assist users with hints, explanations, and personalized feedback.

#### 4. Gamification & Engagement

- 🏆 `AI-Powered Challenges` – Create real-time AI-driven challenges based on trending topics.
- 🎯 `Custom Learning Paths` – AI will generate personalized study plans based on quiz performance.
- 📌 `Voice & Image-Based Quizzes` – AI will allow quizzes through voice commands or image-based recognition.

#### 5. Multi-Platform & Integration Capabilities

- 🔗 `Integration with Learning Platforms` – Sync Quizlytics with LMS platforms like Google Classroom and Coursera.
- 📲 `Mobile App with AI Tutor` – A mobile version with voice-assisted AI tutor for on-the-go learning.
- 🔍 `AI-Powered Search` – Find quizzes instantly based on keywords, subjects, or difficulty levels.

## 🏗 Tech Stack

#### Frontend:

- Next.js – For building the user interface.
- TypeScript – Ensures type safety and scalability.
- Tailwind CSS – For styling.
- Shadcn ui - for ui components.
- Axios – For API data fetching.

#### Backend:

- Node.js & Express.js – For building REST APIs.
- TypeScript – Ensures type safety and scalability.
- MongoDB – For data storage.
- Prisma – ORM/ODM for database interactions.
- JWT & bcrypt.js – For authentication and security.
- KIDJIG API – For AI-powered quiz generation.

## 🔧 Setup & Installation

#### 🚀 Backend Setup

##### Clone the backend repository:

    git clone https://github.com/Subhendu-Kumar/ai-quiz-app.git
    cd server

##### Install dependencies:

    npm install

##### Set up environment variables: Create a `.env` file and add:

    API_KEY="**************"
    DATABASE_URL="*************"
    API_URL="***********************"

##### Start the backend server:

    npm run dev

#### 🎨 Frontend Setup

##### Clone the frontend repository:

    git clone https://github.com/Subhendu-Kumar/ai-quiz-app.git
    cd client

##### Install dependencies:

    npm install

##### Set up environment variables: Create a `.env.local` file and add:

    NEXT_PUBLIC_BASE_BACKEND_URL=************
    NEXT_PUBLIC_IMAGE_UPLOAD_URL=*******************

##### Start the frontend server:

    npm run dev

## 📖 API Endpoints Overview

#### Authentication

`POST /api/auth/signup`

```json
{
  "email": "example@example.com",
  "username": "example-name",
  "password": "******",
  "avatar": "https://example.com/image/uifhwdjcweg",
  "role": "CREATOR"
}
```

`POST /api/auth/signin`

```json
{
  "email": "example@example.com",
  "password": "******"
}
```

#### Quizzes

`POST /api/create/quiz/ai`

```json
{
  "title": "example-title",
  "topic": "example-topic",
  "quiztype": "MULTIPLE_CHOICE",
  "description": "example-description",
  "difficultylevel": "HARD",
  "numberofquestions": 20
}
```

`GET /api/quiz/recent` – List recently created quizzes.

`GET /api/quiz/recent/me` – Get quizes created by me

`GET /api/quiz/list/:page` – Get quizes in paginated form

`GET /api/quiz/:quizId` – Get quiz details

#### Attempts & Analytics

`POST /api/quiz/attempt/:quizId` – Start a quiz attempt.

`POST /api/quiz/submit/:attemptId`

```json
{
  "answers": [
    { "questionId": "67a3028f4e076fb5ae92e84b", "selectedOption": 0 },
    { "questionId": "67a3028f4e076fb5ae92e84c", "selectedOption": 1 },
    { "questionId": "67a3028f4e076fb5ae92e84d", "selectedOption": 2 },
    { "questionId": "67a3028f4e076fb5ae92e84f", "selectedOption": 2 }
  ]
}
```

`GET /api/get/quiz/:attemptId` – get quiz questions.

`GET /api/quiz/analytics` – get total analytics of user.

`GET /api/quiz/analytics/:attemptId` – get analytics of particular attempt.

## 📌 Usage Workflow

- Sign Up / Log In – Users can create an account and sign in.
- Create Quizzes – Users with `role: CREATOR` can generate quizzes using AI.
- Attempt Quizzes – Users can attempt quizzes from the available list.
- View Analytics – After completing a quiz, users can view detailed performance analytics.

## 🚀 Deployment

- Frontend can be deployed using Vercel, Netlify, or Firebase Hosting.
- Backend can be deployed using Render, AWS, or DigitalOcean.
- **Client:** [Live Demo](https://ai-quiz-app-phi.vercel.app)
- **Server:** [API Server](https://ai-quiz-app-be.vercel.app)
- **Image Upload Api:** [Api Documentaion](https://github.com/Subhendu-Kumar/media-cloud-bridge/blob/main/README.md)
- **Ai Api:** [Api Documentation](https://kidjig.gitbook.io/kidjig-docs)

## 👨‍💻 Author

[Subhendu Kumar](https://www.linkedin.com/in/subhendu-kumar-dutta) – Developer

## 📄 License

This project is open-source under the MIT License.

#

🎯 Start exploring Quizlytics today and take your quiz experience to the next level!

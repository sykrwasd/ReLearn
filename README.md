# ReLearn - Student Marketplace

![ReLearn Screenshot 1](https://relearnn.s3.ap-southeast-2.amazonaws.com/ReLearn+(4).png)
![ReLearn Screenshot 2](https://relearnn.s3.ap-southeast-2.amazonaws.com/ReLearn+(3).png)

A modern React Native mobile application built with Expo, providing a marketplace platform for students.


## 🚀 Features

- Cross-platform support (iOS, Android, Web)
- Modern UI with Tailwind CSS styling
- MongoDB database integration
- AWS S3 integration for file storage
- Authentication system
- Real-time updates
- Interactive charts and analytics
- Custom navigation with drawer and bottom tabs

## 📋 Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd ReLearn
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Add your environment variables here
# MongoDB connection string
# AWS credentials
# Other API keys
```

## 🏃‍♂️ Running the App

```bash
# Start the development server
npm start
# or
yarn start

# Run on iOS
npm run ios
# or
yarn ios

# Run on Android
npm run android
# or
yarn android

# Run on Web
npm run web
# or
yarn web
```

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **State Management**: React Context/Hooks
- **Styling**: TailwindCSS (NativeWind)
- **UI Components**: 
  - React Native Paper
- **Navigation**: Expo Router
- **Backend Integration**: 
  - MongoDB
  - Express.js
  - AWS S3
- **Data Visualization**: React Native Chart Kit

## 📱 App Structure

```
ReLearn/
├── app/                # App screens and navigation
├── components/         # Reusable components
├── assets/            # Static assets
├── models/            # Data models
├── backend/           # Backend server code
└── ...
```

## 🔧 Development

The project uses TypeScript for type safety and includes ESLint for code quality. Key development commands:

```bash
# Type checking
npm run typescript

# Linting
npm run lint

# Testing
npm run test
```

## 📄 License

ISC

## 👥 Authors

[Umar Syakir]

---

Built with ❤️ using Expo and React Native

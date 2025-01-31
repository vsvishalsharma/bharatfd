# Multilingual FAQ Management System

## Overview
A comprehensive Node.js-based FAQ management system with multilingual support, translation, and caching mechanisms.

## Features
- Multilingual FAQ management
- Automatic translation using Google Translate API
- Redis-based caching
- RESTful API endpoints
- Docker support

## Prerequisites
- Node.js (v18+)
- MongoDB
- Redis
- Google Translate API Key

## Installation

### Local Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/faq-multilingual-project.git
cd faq-multilingual-project
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Run the application
```bash
npm run dev
```

### Docker Setup
```bash
docker-compose up --build
```

## API Endpoints

### Create FAQ
`POST /api/faqs`
```json
{
  "question": "What is this system?",
  "answer": "A multilingual FAQ management system.",
  "language": "en"
}
```

### Get FAQs
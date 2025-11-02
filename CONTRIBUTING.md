# Contributing to API-Talks

Thank you for your interest in contributing to API-Talks! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/ChiragArora31/API-Talks.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Set up environment variables (see README.md)
3. Run development server: `npm run dev`

## Coding Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent code formatting
- Follow the existing code style

## Adding New APIs

1. Add API documentation fetching logic in `lib/documentation-fetcher.ts`
2. Update the `getAllDocsForPlatform` method in `lib/rag-service.ts`
3. Add code generation logic in `lib/code-generator.ts`
4. Update the platform detection in `app/api/chat/route.ts`

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep commits focused on a single change

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Make sure all tests pass (if applicable)
3. Update documentation as needed
4. Request review from maintainers

Thank you for contributing! 🎉


# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-09-11

### Changed
- Updated README.md with Vercel deployment instructions and live demo link
- Removed broken screenshot reference from README
- Cleaned up codebase for production readiness

### Added
- CHANGELOG.md for tracking project changes
- Vercel deployment support (freestack.hub.vercel.app)
- Git tag v1.0.0 for version tracking

### Removed
- Google AI Studio references (`@google/genai` dependency, `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` metadata, AI Studio HMR comment)
- `assets/.aistudio/` directory
- Unused `@google/genai` npm dependency

### Fixed
- Cleaned vite.config.ts (removed AI Studio environment variable logic)

## [1.0.0] - 2026-06-19

### Added
- Initial release with 21 categories and 200+ free developer tools
- Fuzzy search via Fuse.js with real-time filtering
- Dark/Light/System mode with LocalStorage persistence
- Responsive sidebar with collapsible mobile drawer
- IntersectionObserver for active category tracking
- Category navigation with smooth scrolling
- Micro-interactions (card hover states, link transitions)
- Error boundary for crash protection
- Hot Module Replacement (HMR) for development

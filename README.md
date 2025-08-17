
# Notepad React

A simple notepad application built with React. This project allows users to create, view, and manage notes in a clean and modern interface.

## Features
- Create and manage note groups
- Add, edit, and delete notes
- Responsive sidebar for navigation
- Modal popup for adding new groups
- Persistent data using React Context


## Tech Stack
- React
- Vite
- CSS Modules

## Data Storage
All notes and groups are stored in the browser using IndexedDB for persistence. This allows for more robust and scalable storage compared to localStorage, and your data remains available even after refreshing or closing the browser, but is not shared across devices.

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- pnpm (or npm/yarn)

### Installation
1. Clone the repository:
	```bash
	git clone <repo-url>
	cd notepad-react
	```
2. Install dependencies:
	```bash
	pnpm install
	# or
	npm install
	# or
	yarn install
	```
3. Start the development server:
	```bash
	pnpm dev
	# or
	npm run dev
	# or
	yarn dev
	```
4. Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure
```
notepad-react/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```

## Scripts
- `dev` - Start the development server
- `build` - Build for production
- `preview` - Preview the production build

## License
This project is licensed under the MIT License.

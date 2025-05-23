ToDo.dev
A modern, responsive todo application built with React, TypeScript, Vite, and shadcn/ui. ToDo.dev helps users manage tasks efficiently with features like drag-and-drop reordering, task filtering, and deadline tracking.
Features

Task Management: Create, edit, complete, and delete tasks.
Drag-and-Drop: Reorder tasks using intuitive drag-and-drop functionality.
Filtering: View all, active, completed, or soon-due tasks.
Deadline Tracking: Set start and due times with visual status indicators (overdue, due soon, on track).
Responsive Design: Optimized for both desktop and mobile devices.
Accessible: Includes ARIA attributes for better screen reader support.

Tech Stack

Frontend: React, TypeScript
Build Tool: Vite
UI Components: shadcn/ui
State Management: Zustand
Drag-and-Drop: dnd-kit
Animations: Framer Motion
Styling: Tailwind CSS
Icons: Lucide React

Prerequisites
Ensure you have the following installed:

Node.js (v18.x or higher recommended)
Git
npm (comes with Node.js)

Installation

Clone the Repository:
git clone https://github.com/AbdElrhman-Magdy2007/ToDo.dev.git
cd ToDo.dev


Install Dependencies:
npm install


Run the Development Server:
npm run dev

The app will be available at http://localhost:8080.

Build for Production:
npm run build


Preview Production Build:
npm run preview



Project Structure
ToDo.dev/
├── src/
│   ├── components/         # Reusable UI components
│   ├── store/             # Zustand store for state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions (e.g., date formatting)
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation

Usage

Add a Task: Enter a title and optional start/due times in the input form.
Edit a Task: Click the edit button to modify the title or times.
Complete a Task: Click the checkbox to mark a task as complete.
Delete a Task: Click the trash icon to remove a task.
Reorder Tasks: Drag tasks to reorder them.
Filter Tasks: Use the filter options to view specific task categories.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.
License
This project is licensed under the MIT License.
Contact
For questions or feedback, reach out to AbdElrhman Magdy.

Built with ❤️ by AbdElrhman Magdy
#   T o D o - L i s t  
 
# Twilio Report App

## Overview
The **Twilio Report App** is a web application designed to generate and manage Twilio call and message reports efficiently. Built with **Next.js, TypeScript, and shadcn/ui**, this app leverages Twilio's APIs to provide detailed insights into communication data.

## Features
- 📊 **Generate Reports** – Fetch Twilio call and message logs.
- 🔍 **Advanced Filtering** – Search and filter reports based on various criteria.
- 🚀 **Real-time Updates** – Live data fetching and updates.
- 📁 **Export Reports** – Download reports in CSV format.
- 🔒 **User Authentication** – Secure login without token-based authentication.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, React, Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **Cloud Storage:** Firebase (instead of AWS)
- **API Integration:** Twilio API

## Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/developersayem/twilio-report-app.git
   cd twilio-report-app
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file and add the required Twilio and Firebase credentials:
   ```env
   NEXT_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_sid
   NEXT_PUBLIC_TWILIO_AUTH_TOKEN=your_twilio_auth_token
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open in browser:**
   Visit `http://localhost:3000` to access the app.

## Usage
1. **Login** using your credentials.
2. **View Reports** – Access Twilio call and message logs.
3. **Filter & Search** – Narrow down results using filters.
4. **Export** reports to CSV for further analysis.

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to your branch: `git push origin feature-name`.
5. Open a Pull Request.

## License
This project is licensed under the **MIT License**.

## Contact
For questions or support, reach out via GitHub Issues or [email@example.com](mailto:email@example.com).


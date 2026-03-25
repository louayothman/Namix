# **App Name**: Namix

## Core Features:

- User Authentication: Secure sign-up and login, managing user sessions and basic profile data using Supabase Auth.
- User Dashboard: A 'Digital Wallet' style dashboard displaying total balance, active investments, and accumulated profits in a clear, mobile-responsive layout.
- Investment Marketplace: Browse 'Plans' created by the Admin, including details such as minimum/maximum investment, profit percentage, and duration. Fetches data from Supabase Database.
- Deposit Submission: Users submit a 'Proof of Deposit' form including transaction ID, amount, and upload a screenshot/receipt. Proof is stored via Supabase Storage.
- Withdrawal Request Management: Users can request to withdraw their balance or profits, with real-time status updates showing as 'Pending' or 'Approved'.
- Admin Approval Dashboard: A centralized dashboard for administrators to manually approve or reject deposit and withdrawal requests.
- Admin Plan Management: Admin interface to create, edit, and archive investment plans, setting parameters like profit percentage, duration, and withdrawal rules.

## Style Guidelines:

- Primary color: A robust, digital-first blue (#2669E3), signifying trust and stability for financial transactions. (HSL: 220, 70%, 50%)
- Background color: A subtle, cool off-white (#FFFFFF) providing a clean and uncluttered canvas. (HSL: 220, 15%, 97%)
- Accent color: A deep, true blue (#0F5ECA) offering contrast and complementing the primary, used for calls-to-action and key interactive elements. (HSL: 210, 80%, 40%)
- Body and headline font: 'Tajawal' (sans-serif) for its clean, modern, and highly legible characteristics across all Arabic content. Note: currently only Google Fonts are supported.
- Utilize 'Lucide Icons' for a consistent set of crisp, modern line icons that align with a high-end digital wallet aesthetic.
- Right-to-Left (RTL) layout direction is fundamental for full Arabic localization. The UI features a mobile-responsive, card-based design inspired by digital wallets, incorporating progress bars and status badges for clarity.
- Implement subtle and smooth animations for transitions, data loading, and status updates to enhance the sleek and responsive feel of the application.
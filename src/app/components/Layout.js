// components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-gray-800 text-white py-2 px-4 flex justify-between">
                <div className="text-xl font-semibold">
                    <Link href="/">GitHub Clone</Link>
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/explore">Explore</Link></li>
                        <li><Link href="/notifications">Notifications</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-60 bg-gray-100 p-4 border-r">
                    <ul>
                        <li><Link href="/">Repositories</Link></li>
                        <li><Link href="/stars">Stars</Link></li>
                        <li><Link href="/settings">Settings</Link></li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-2 px-4 text-center">
                GitHub Clone - © 2024
            </footer>
        </div>
    );
}
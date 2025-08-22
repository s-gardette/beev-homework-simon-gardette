export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h1 className="text-6xl font-bold mb-8">404</h1>
            <p className="text-xl mb-8">Page Not Found</p>
            <a
                href="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
            >
                Go to Dashboard
            </a>
        </div>
    );
}

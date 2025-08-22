export function Footer() {
    return (
        <footer className="bg-background text-foreground p-4 text-center text-foreground">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} Beev. All rights reserved.
            </p>
        </footer>
    );
}

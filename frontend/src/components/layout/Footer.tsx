export function Footer() {
    return (
        <footer className="bg-secondary text-primary p-4 text-center text-white">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} Beev. All rights reserved.
            </p>
        </footer>
    );
}

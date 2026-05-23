export default function Footer() {
  return (
    <footer className="w-full py-xl px-lg border-t border-outline-variant/10 bg-surface-container-lowest mt-xl">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="font-headline-md text-headline-md text-on-surface font-bold">
            ZakatPro
          </span>
          <p className="font-label-sm text-label-sm text-on-tertiary-container text-center md:text-left">
            © 2026 ZakatPro Financial Systems. Analytical precision for global philanthropy.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-lg">
          {["Privacy Policy", "Terms of Service", "Compliance", "Institutional Support", "API Documentation"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-label-sm text-label-sm text-on-tertiary-container hover:text-on-surface hover:underline transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

type DisclaimerFooterProps = {
  text: string;
};

export function DisclaimerFooter({ text }: DisclaimerFooterProps) {
  return (
    <footer className="mt-12 border-t border-[var(--color-border)] py-6 text-xs text-[var(--color-text-secondary)]">
      <p className="mx-auto max-w-3xl px-4 text-center">{text}</p>
    </footer>
  );
}

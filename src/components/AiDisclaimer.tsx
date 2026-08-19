import { ShieldCheck } from "lucide-react";

export function AiDisclaimer() {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong className="font-medium text-foreground">Responsible AI:</strong> Generated content
        may be inaccurate or incomplete. Review and edit every draft before sending, and never enter
        confidential personal data or credentials.
      </span>
    </p>
  );
}

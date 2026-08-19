import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Check, Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runAssistant } from "@/lib/ai.functions";

export type Field =
  | { name: string; label: string; type: "input"; placeholder?: string; required?: boolean }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
      required?: boolean;
    }
  | { name: string; label: string; type: "select"; options: string[] };

export function ToolWorkspace({
  system,
  fields,
  initialValues,
  buildPrompt,
  submitLabel = "Generate with AI",
  outputLabel = "AI draft (editable)",
}: {
  system: string;
  fields: Field[];
  initialValues: Record<string, string>;
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel?: string;
  outputLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const callAssistant = useServerFn(runAssistant);

  const mutation = useMutation({
    mutationFn: async () => callAssistant({ data: { system, prompt: buildPrompt(values) } }),
    onSuccess: (result) => setOutput(result.text.trim()),
  });

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-base">Structured prompt</CardTitle>
          <CardDescription>Fill in the details — we build the AI prompt for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "input" && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder ?? ""}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder ?? ""}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.type === "select" && (
                <Select value={values[field.name]} onValueChange={(v) => set(field.name, v)}>
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

          <Button
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {mutation.isPending ? "Generating…" : submitLabel}
          </Button>

          {mutation.isError && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {(mutation.error as Error).message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">{outputLabel}</CardTitle>
            <CardDescription>Edit the result before you use it.</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={copy} disabled={!output} aria-label="Copy">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOutput("")}
              disabled={!output}
              aria-label="Clear"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={18}
            placeholder="Your AI draft will appear here, fully editable."
            className="resize-y font-normal"
          />
          <AiDisclaimer />
        </CardContent>
      </Card>
    </div>
  );
}

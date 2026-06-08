'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export type FieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
};

type CrudDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FieldConfig[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<string | void>;
  submitLabel?: string;
};

export function CrudDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues,
  onSubmit,
  submitLabel = 'Save',
}: CrudDialogProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const err = await onSubmit(values);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      setLoading(false);
      onOpenChange(false);
      setValues({});
    }
  }, [values, onSubmit, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
              {field.type === 'select' ? (
                <Select
                  value={values[field.name] || ''}
                  onValueChange={(v) => handleChange(field.name, v)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder={field.placeholder}
                />
              ) : field.type === 'number' ? (
                <Input
                  id={field.name}
                  type="number"
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  required={field.required}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

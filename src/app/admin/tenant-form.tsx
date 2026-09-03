"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { TENANT_CATEGORY_LABELS } from "@/lib/flow-config";
import { createTenantAction, type CreateTenantState } from "./actions";

const initialState: CreateTenantState = {};

export function TenantForm() {
  const [state, formAction, pending] = useActionState(
    createTenantAction,
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboard a new tenant</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Company name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" required defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              {Object.entries(TENANT_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" required />
          </div>
          <div>
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" name="contactPhone" placeholder="+91..." />
          </div>
          <div>
            <Label htmlFor="adminName">Employer admin name</Label>
            <Input id="adminName" name="adminName" required />
          </div>
          <div>
            <Label htmlFor="adminEmail">Employer admin email</Label>
            <Input id="adminEmail" name="adminEmail" type="email" required />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create tenant"}
            </Button>
          </div>
        </form>
        {state?.error && (
          <p className="mt-3 animate-fade-in rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state?.success && (
          <div className="mt-3 animate-fade-in rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
            <p className="font-medium">
              {state.success.tenantName} onboarded.
            </p>
            <p className="mt-1">
              Employer admin login:{" "}
              <span className="font-mono text-emerald-900">
                {state.success.adminEmail}
              </span>
              , temporary password:{" "}
              <span className="font-mono text-emerald-900">
                {state.success.tempPassword}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

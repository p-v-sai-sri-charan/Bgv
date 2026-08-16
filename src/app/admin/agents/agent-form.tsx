"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { createAgentAction, type CreateAgentState } from "../actions";

const initialState: CreateAgentState = {};

export function AgentForm() {
  const [state, formAction, pending] = useActionState(
    createAgentAction,
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add verification agent</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Adding..." : "Add agent"}
            </Button>
          </div>
        </form>
        {state?.error && (
          <p className="mt-3 text-sm text-red-600">{state.error}</p>
        )}
        {state?.success && (
          <div className="mt-3 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
            <p>
              Agent login:{" "}
              <span className="font-mono">{state.success.email}</span>,
              temporary password:{" "}
              <span className="font-mono">{state.success.tempPassword}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

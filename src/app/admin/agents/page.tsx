import { IconUserCog } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { AgentForm } from "./agent-form";

export default async function AdminAgentsPage() {
  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification agents"
        description="Agents work the manual review queue and sign off documents."
      />

      <AgentForm />

      <Card>
        <CardHeader>
          <CardTitle>Agents ({agents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <EmptyState
              title="No agents yet"
              description="Add an agent above to start clearing the review queue."
              icon={<IconUserCog />}
            />
          ) : (
            <Table>
              <Thead>
                <Th>Name</Th>
                <Th>Email</Th>
              </Thead>
              <Tbody>
                {agents.map((agent) => (
                  <Tr key={agent.id}>
                    <Td className="font-medium">{agent.name}</Td>
                    <Td className="text-muted-foreground">{agent.email}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

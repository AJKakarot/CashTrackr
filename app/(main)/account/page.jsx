import { getUserAccounts } from "@/actions/dashboard";
import { AccountCard } from "@/app/(main)/dashboard/_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function AccountsPage() {
  const accounts = await getUserAccounts();

  return (
    <div className="space-y-8 px-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title">
            My Accounts
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your financial accounts
          </p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5 min-h-[180px]">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No accounts yet. Create your first account to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";

import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  // const router = useRouter();

  // const handleInvestMoneyClick = () => {
  //   router.push("/invest");
  // };
  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>
        <div
          className="gap-7 flex justify-center items-center
        "
        >
          {parseFloat(account.balance).toFixed(2) > 500 ? (
            <Link href="../Investment">
              <Button className="flex items-center gap-2">
                <span className="hidden md:inline">Invest Money</span>
              </Button>
            </Link>
          ) : null}
          <div className="text-right pb-2">
            <div className="text-xl sm:text-2xl font-bold">
              ₹{parseFloat(account.balance).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {account._count.transactions} Transactions
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}

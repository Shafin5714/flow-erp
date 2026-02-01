import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecentSales() {
  return (
    <Card className="col-span-3 border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors -mx-2">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-black shadow-sm">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                OM
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                Olivia Martin
              </p>
              <p className="text-xs text-muted-foreground">olivia.martin@email.com</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-medium">+$1,999.00</div>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
              >
                Completed
              </Badge>
            </div>
          </div>
          <div className="flex items-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors -mx-2">
            <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border-2 border-white dark:border-black shadow-sm">
              <AvatarImage src="/avatars/02.png" alt="Avatar" />
              <AvatarFallback className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                JL
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                Jackson Lee
              </p>
              <p className="text-xs text-muted-foreground">jackson.lee@email.com</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-medium">+$39.00</div>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
              >
                Pending
              </Badge>
            </div>
          </div>
          <div className="flex items-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors -mx-2">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-black shadow-sm">
              <AvatarImage src="/avatars/03.png" alt="Avatar" />
              <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                IN
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                Isabella Nguyen
              </p>
              <p className="text-xs text-muted-foreground">isabella.nguyen@email.com</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-medium">+$299.00</div>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
              >
                Completed
              </Badge>
            </div>
          </div>
          <div className="flex items-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors -mx-2">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-black shadow-sm">
              <AvatarImage src="/avatars/04.png" alt="Avatar" />
              <AvatarFallback className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                WK
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                William Kim
              </p>
              <p className="text-xs text-muted-foreground">will@email.com</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-medium">+$99.00</div>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
              >
                Completed
              </Badge>
            </div>
          </div>
          <div className="flex items-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors -mx-2">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-black shadow-sm">
              <AvatarImage src="/avatars/05.png" alt="Avatar" />
              <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                SD
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                Sofia Davis
              </p>
              <p className="text-xs text-muted-foreground">sofia.davis@email.com</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-medium">+$39.00</div>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              >
                Rejected
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

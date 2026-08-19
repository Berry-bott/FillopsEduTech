
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Ban, Trash2, Edit, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function UserTable({ users, onView, onEdit, onReassign, onSuspend, onDelete, entity = "User" }) {
  if (!Array.isArray(users)) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No {entity.toLowerCase()} data available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{entity}</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const name =
            [user?.firstName, user?.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() || user?.email || `Unknown ${entity}`;

          const initials = (() => {
            const first = user?.firstName?.trim()?.[0] || "";
            const last = user?.lastName?.trim()?.[0] || "";
            if (first || last) return (first + last).toUpperCase().slice(0, 2);
            if (user?.email && typeof user.email === "string" && user.email.trim()) {
              return user.email.trim()[0].toUpperCase();
            }
            return "?";
          })();

          const isActive = user?.isActive !== false;

          return (
            <TableRow key={user?.id || Math.random()}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-foreground">
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    isActive
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                      : "border-destructive bg-destructive/10 text-destructive"
                  )}
                >
                  {isActive ? "Active" : "Suspended"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    user?.emailVerified
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                      : "border-amber-500 bg-amber-500/10 text-amber-600"
                  )}
                >
                  {user?.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user?.createdAt
                  ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                  : "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>

                    {entity === "Tutor" && (
                      <DropdownMenuItem onClick={() => onEdit?.(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit {entity}
                      </DropdownMenuItem>
                    )}

                    {entity === "Tutor" && (
                      <DropdownMenuItem onClick={() => onReassign?.(user)}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Reassign Subject
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => onSuspend?.(user)} className="text-amber-600">
                      <Ban className="mr-2 h-4 w-4" />
                      {isActive ? "Suspend" : "Unsuspend"}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onDelete?.(user)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
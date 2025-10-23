"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MembershipCard } from "@/lib/memberships"

interface MembershipStatsProps {
  memberships: MembershipCard[]
}

export function MembershipStats({ memberships }: MembershipStatsProps) {
  const total = memberships.length
  const withDiscount = memberships.filter(m => m.discount_id != null).length
  const withoutDiscount = total - withDiscount

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total memberships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">All membership cards</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">With discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withDiscount}</div>
          <p className="text-xs text-muted-foreground">Linked to a discount policy</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Without discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withoutDiscount}</div>
          <p className="text-xs text-muted-foreground">No discount applied</p>
        </CardContent>
      </Card>
    </div>
  )
}



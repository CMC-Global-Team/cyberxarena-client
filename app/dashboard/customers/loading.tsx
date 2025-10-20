import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  )
}

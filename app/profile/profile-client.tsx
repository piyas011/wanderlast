"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import {
  Camera,
  DollarSign,
  Loader2,
  LogOut,
  MapPin,
  PencilLine,
  Plane,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ProfileUser = {
  id: string
  name: string
  email: string
  image: string | null
  emailVerified: boolean
  createdAt: string
}

type ProfileClientProps = {
  user: ProfileUser
  stats: {
    totalBookings: number
    countriesVisited: number
    upcomingTrips: number
    totalSpent: number
  }
}

export default function ProfileClient({
  user,
  stats: profileStats,
}: ProfileClientProps) {
  const router = useRouter()
  const [profile, setProfile] = useState(user)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [name, setName] = useState(user.name)
  const [image, setImage] = useState(user.image ?? "")

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  const initials =
    profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"

  const cancelEditing = () => {
    setName(profile.name)
    setImage(profile.image ?? "")
    setIsEditing(false)
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedImage = image.trim()

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.")
      return
    }

    if (trimmedImage) {
      try {
        const url = new URL(trimmedImage)
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid image URL")
        }
      } catch {
        toast.error("Please enter a valid HTTP or HTTPS image URL.")
        return
      }
    }

    setIsSaving(true)
    const { data, error } = await authClient.updateUser({
      name: trimmedName,
      image: trimmedImage || null,
    })
    setIsSaving(false)

    if (error) {
      toast.error(error.message || "Unable to update your profile.")
      return
    }

    if (data) {
      setProfile((current) => ({
        ...current,
        name: trimmedName,
        image: trimmedImage || null,
      }))
      setIsEditing(false)
      toast.success("Profile updated successfully.")
      router.refresh()
    }
  }

  const signOut = async () => {
    setIsSigningOut(true)
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
          router.refresh()
        },
      },
    })
    setIsSigningOut(false)

    if (error) {
      toast.error(error.message || "Unable to sign out.")
    }
  }

  const stats = [
    {
      label: "Total Bookings",
      value: String(profileStats.totalBookings),
      icon: Plane,
      iconClass: "text-sky-600",
      valueClass: "text-sky-700",
    },
    {
      label: "Countries visited",
      value: String(profileStats.countriesVisited),
      icon: MapPin,
      iconClass: "text-emerald-600",
      valueClass: "text-emerald-700",
    },
    {
      label: "Upcoming Trips",
      value: String(profileStats.upcomingTrips),
      icon: TrendingUp,
      iconClass: "text-orange-500",
      valueClass: "text-orange-600",
    },
    {
      label: "Total Spent",
      value: `$${profileStats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      iconClass: "text-fuchsia-500",
      valueClass: "text-fuchsia-600",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#edf1f3] px-4 py-8 sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1120px]">
        <header>
          <h1 className="text-[30px] leading-none font-semibold tracking-tight text-slate-950 sm:text-[34px]">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Manage your account settings and travel preferences
          </p>
        </header>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col items-center">
              <div className="relative mt-1">
                <div className="relative size-[82px] overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      fill
                      sizes="82px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xl font-semibold text-slate-500">
                      {initials}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <span className="absolute right-0 bottom-0 grid size-6 place-items-center rounded-full border-2 border-white bg-cyan-600 text-white">
                    <Camera className="size-3" />
                  </span>
                )}
              </div>

              {!isEditing ? (
                <>
                  <h2 className="mt-3 text-center text-sm font-bold text-slate-950">
                    {profile.name}
                  </h2>
                  <p
                    className="mt-1 max-w-full truncate text-xs text-slate-500"
                    title={profile.email}
                  >
                    {profile.email}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3" />
                    Location not set
                  </p>
                </>
              ) : (
                <form
                  onSubmit={saveProfile}
                  className="mt-4 w-full space-y-3"
                  id="profile-form"
                >
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="profile-name"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      minLength={2}
                      required
                      autoComplete="name"
                      className="h-9 rounded-md border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="profile-image"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Profile image URL
                    </Label>
                    <Input
                      id="profile-image"
                      value={image}
                      onChange={(event) => setImage(event.target.value)}
                      type="url"
                      placeholder="https://..."
                      autoComplete="photo"
                      className="h-9 rounded-md border-slate-200 bg-white text-xs"
                    />
                  </div>
                </form>
              )}
            </div>

            {!isEditing && (
              <div className="mt-4 grid grid-cols-2 gap-x-3 border-t border-slate-100 pt-3 text-xs">
                <div>
                  <p className="text-slate-500">Member since</p>
                  <p className="mt-1 font-bold text-slate-950">{memberSince}</p>
                </div>
                <div>
                  <p className="text-slate-500">Account status</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {profile.emailVerified ? "Verified" : "Active"}
                  </p>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="h-8 rounded-none text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="profile-form"
                  size="sm"
                  disabled={isSaving}
                  className="h-8 rounded-none bg-cyan-600 text-xs text-white hover:bg-cyan-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-full rounded-none bg-cyan-600 text-xs font-semibold text-white hover:bg-cyan-700"
                >
                  <PencilLine className="size-3" />
                  Edit Profile
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSigningOut}
                        className="h-8 w-full rounded-none border-slate-200 text-xs text-slate-600 hover:text-slate-950"
                      >
                        <LogOut className="size-3" />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Sign out of Wanderlust?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to sign in again to access your profile.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={signOut}
                        className="bg-cyan-600 text-white hover:bg-cyan-700"
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </aside>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-5">
            <h2 className="text-sm font-bold text-slate-950">
              Travel Statistics
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {stats.map(
                ({ label, value, icon: Icon, iconClass, valueClass }) => (
                  <div
                    key={label}
                    className="flex min-h-[68px] items-center justify-between rounded-md border border-slate-100 bg-[#f9fafb] px-4 py-3"
                  >
                    <div>
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className={`mt-1 text-base font-bold ${valueClass}`}>
                        {value}
                      </p>
                    </div>
                    <div className="grid size-9 place-items-center rounded-full bg-white shadow-sm">
                      <Icon className={`size-4 ${iconClass}`} />
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
